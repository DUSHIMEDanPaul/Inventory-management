'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/firebase';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Import our enhanced components
import NavigationHeader from './components/NavigationHeader';
import SearchAndFilter from './components/SearchAndFilter';
import StatsDashboard from './components/StatsDashboard';
import ItemCard from './components/ItemCard';
import AddItemModal from './components/AddItemModal';
import ExportDialog from './components/ExportDialog';
import { useToast } from './components/ToastProvider';

// Import utilities and constants
import { 
  searchAndFilterInventory, 
  getLowStockItems, 
  validateItemData, 
  generateItemId 
} from './utils';
import { KEYBOARD_SHORTCUTS, DEFAULT_CATEGORY, DEFAULT_LOW_STOCK_THRESHOLD } from './constants';

export default function Home() {
  // State management
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Operation states
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const toast = useToast();

  // Load inventory data from Firestore
  const updateInventory = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data()
        });
      });
      
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Apply search and filters
  useEffect(() => {
    const filtered = searchAndFilterInventory(inventory, searchTerm, categoryFilter, sortBy);
    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, sortBy]);

  // Initial data load
  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      if (isCtrlOrCmd) {
        switch (key.toLowerCase()) {
          case 'n':
            event.preventDefault();
            handleAddNewItem();
            break;
          case 'k':
            event.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) searchInput.focus();
            break;
          case 'e':
            event.preventDefault();
            setExportModalOpen(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add or update item
  const addOrUpdateItem = async (itemData, isUpdate = false) => {
    try {
      setOperationLoading(true);
      
      // Validate item data
      const validation = validateItemData(itemData);
      if (!validation.isValid) {
        toast.error('Please fix the validation errors');
        return;
      }

      const itemId = generateItemId(itemData.name);
      const docRef = doc(collection(firestore, 'inventory'), itemId);
      
      // Prepare document data
      const docData = {
        name: itemData.name.trim(),
        category: itemData.category || DEFAULT_CATEGORY,
        quantity: itemData.quantity || 0,
        price: itemData.price || 0,
        description: itemData.description?.trim() || '',
        lowStockThreshold: itemData.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD,
        updatedAt: serverTimestamp(),
      };

      if (!isUpdate) {
        // Check if item already exists when adding new
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          toast.error('An item with this name already exists');
          return;
        }
        docData.createdAt = serverTimestamp();
      }

      await setDoc(docRef, docData, { merge: isUpdate });
      await updateInventory();
      
      toast.success(isUpdate ? 'Item updated successfully' : 'Item added successfully');
      
    } catch (error) {
      console.error('Error adding/updating item:', error);
      toast.error('Failed to save item');
    } finally {
      setOperationLoading(false);
    }
  };

  // Add quantity to existing item
  const addItemQuantity = async (itemName, quantity = 1) => {
    try {
      setOperationLoading(true);
      
      const docRef = doc(collection(firestore, 'inventory'), generateItemId(itemName));
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await setDoc(docRef, {
          ...currentData,
          quantity: (currentData.quantity || 0) + quantity,
          updatedAt: serverTimestamp(),
        });
        
        await updateInventory();
        toast.success(`Added ${quantity} to ${itemName}`);
      }
    } catch (error) {
      console.error('Error adding quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setOperationLoading(false);
    }
  };

  // Remove quantity from existing item
  const removeItemQuantity = async (itemName, quantity = 1) => {
    try {
      setOperationLoading(true);
      
      const docRef = doc(collection(firestore, 'inventory'), generateItemId(itemName));
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const newQuantity = Math.max(0, (currentData.quantity || 0) - quantity);
        
        await setDoc(docRef, {
          ...currentData,
          quantity: newQuantity,
          updatedAt: serverTimestamp(),
        });
        
        await updateInventory();
        toast.success(`Removed ${quantity} from ${itemName}`);
      }
    } catch (error) {
      console.error('Error removing quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete item completely
  const deleteItem = async (itemName) => {
    try {
      setOperationLoading(true);
      
      const docRef = doc(collection(firestore, 'inventory'), generateItemId(itemName));
      await deleteDoc(docRef);
      
      await updateInventory();
      toast.success(`${itemName} deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setOperationLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // Event handlers
  const handleAddNewItem = () => {
    setEditingItem(null);
    setAddModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setAddModalOpen(true);
  };

  const handleDeleteItem = (itemName) => {
    setItemToDelete(itemName);
    setDeleteDialogOpen(true);
  };

  const handleModalSubmit = async (itemData) => {
    await addOrUpdateItem(itemData, !!editingItem);
    setAddModalOpen(false);
    setEditingItem(null);
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    setEditingItem(null);
  };

  // Calculate stats
  const lowStockItems = getLowStockItems(inventory);

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <NavigationHeader 
          onAddItem={() => {}}
          onExport={() => {}}
          totalItems={0}
          lowStockCount={0}
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Loading skeletons */}
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation Header */}
      <NavigationHeader 
        onAddItem={handleAddNewItem}
        onExport={() => setExportModalOpen(true)}
        totalItems={inventory.length}
        lowStockCount={lowStockItems.length}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Statistics Dashboard */}
        <StatsDashboard inventory={inventory} />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalItems={inventory.length}
          filteredCount={filteredInventory.length}
          lowStockCount={lowStockItems.length}
        />

        {/* Inventory Grid */}
        {filteredInventory.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 2,
          }}>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              {inventory.length === 0 ? 'No Items Yet' : 'No Items Found'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {inventory.length === 0 
                ? 'Get started by adding your first inventory item'
                : 'Try adjusting your search or filter criteria'
              }
            </Typography>
            {inventory.length === 0 && (
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<AddIcon />}
                onClick={handleAddNewItem}
              >
                Add Your First Item
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredInventory.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                <ItemCard
                  item={item}
                  onAdd={addItemQuantity}
                  onRemove={removeItemQuantity}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={handleAddNewItem}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Add/Edit Item Modal */}
      <AddItemModal
        open={addModalOpen}
        onClose={handleModalClose}
        onAdd={handleModalSubmit}
        existingItem={editingItem}
      />

      {/* Export Modal */}
      <ExportDialog
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        inventory={inventory}
        filteredInventory={filteredInventory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{itemToDelete}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => deleteItem(itemToDelete)} 
            color="error"
            variant="contained"
            disabled={operationLoading}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

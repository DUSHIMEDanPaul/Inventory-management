import { format } from 'date-fns';

// Format currency values
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

// Format date timestamps
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format date with time
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return 'Invalid Date';
  }
};

// Validate item data
export const validateItemData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Item name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Item name must be less than 100 characters';
  }

  if (data.quantity === undefined || data.quantity === null || data.quantity < 0) {
    errors.quantity = 'Quantity must be 0 or greater';
  }

  if (data.price !== undefined && data.price !== null && data.price < 0) {
    errors.price = 'Price must be 0 or greater';
  }

  if (data.lowStockThreshold !== undefined && data.lowStockThreshold !== null && data.lowStockThreshold < 0) {
    errors.lowStockThreshold = 'Low stock threshold must be 0 or greater';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generate item ID from name
export const generateItemId = (name) => {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
};

// Check if item has low stock
export const isLowStock = (item) => {
  const threshold = item.lowStockThreshold || 5;
  return item.quantity <= threshold;
};

// Calculate total inventory value
export const calculateTotalValue = (inventory) => {
  return inventory.reduce((total, item) => {
    return total + ((item.price || 0) * (item.quantity || 0));
  }, 0);
};

// Get low stock items
export const getLowStockItems = (inventory) => {
  return inventory.filter(isLowStock);
};

// Search and filter inventory
export const searchAndFilterInventory = (inventory, searchTerm, categoryFilter, sortBy) => {
  let filtered = inventory;

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  }

  // Apply category filter
  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter(item => item.category === categoryFilter);
  }

  // Apply sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'quantity':
          return (a.quantity || 0) - (b.quantity || 0);
        case 'quantity_desc':
          return (b.quantity || 0) - (a.quantity || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        case 'updated':
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
  }

  return filtered;
};

// Export data to CSV
export const exportToCSV = (inventory) => {
  const headers = ['Name', 'Category', 'Quantity', 'Price', 'Description', 'Low Stock Threshold', 'Created', 'Updated'];
  
  const csvContent = [
    headers.join(','),
    ...inventory.map(item => [
      `"${item.name || ''}"`,
      `"${item.category || ''}"`,
      item.quantity || 0,
      item.price || 0,
      `"${(item.description || '').replace(/"/g, '""')}"`,
      item.lowStockThreshold || 0,
      formatDate(item.createdAt),
      formatDate(item.updatedAt),
    ].join(','))
  ].join('\n');

  return csvContent;
};

// Export data to JSON
export const exportToJSON = (inventory) => {
  const exportData = inventory.map(item => ({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    price: item.price,
    description: item.description,
    lowStockThreshold: item.lowStockThreshold,
    createdAt: item.createdAt ? formatDateTime(item.createdAt) : null,
    updatedAt: item.updatedAt ? formatDateTime(item.updatedAt) : null,
  }));

  return JSON.stringify(exportData, null, 2);
};

// Download file
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
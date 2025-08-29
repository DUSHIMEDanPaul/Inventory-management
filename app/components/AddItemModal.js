'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Chip,
  FormHelperText,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { CATEGORIES, DEFAULT_LOW_STOCK_THRESHOLD, DEFAULT_CATEGORY } from '../constants';
import { validateItemData } from '../utils';

const steps = ['Basic Info', 'Details', 'Settings'];

const AddItemModal = ({ open, onClose, onAdd, existingItem = null }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    category: DEFAULT_CATEGORY,
    quantity: 1,
    price: 0,
    description: '',
    lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when editing existing item
  useEffect(() => {
    if (existingItem) {
      setFormData({
        name: existingItem.name || '',
        category: existingItem.category || DEFAULT_CATEGORY,
        quantity: existingItem.quantity || 1,
        price: existingItem.price || 0,
        description: existingItem.description || '',
        lowStockThreshold: existingItem.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD,
      });
    } else {
      setFormData({
        name: '',
        category: DEFAULT_CATEGORY,
        quantity: 1,
        price: 0,
        description: '',
        lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
      });
    }
    setActiveStep(0);
    setErrors({});
  }, [existingItem, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateCurrentStep = () => {
    const validation = validateItemData(formData);
    setErrors(validation.errors);

    switch (activeStep) {
      case 0: // Basic Info
        return !validation.errors.name && !validation.errors.category;
      case 1: // Details
        return !validation.errors.quantity && !validation.errors.price;
      case 2: // Settings
        return !validation.errors.lowStockThreshold && !validation.errors.description;
      default:
        return validation.isValid;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    try {
      await onAdd(formData);
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setErrors({});
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.label}
                        <Chip 
                          label={category.value} 
                          size="small" 
                          variant="outlined"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Unit"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                error={!!errors.price}
                helperText={errors.price}
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description || `${(formData.description || '').length}/500 characters`}
                inputProps={{ maxLength: 500 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Low Stock Threshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                error={!!errors.lowStockThreshold}
                helperText={errors.lowStockThreshold || 'You\'ll be notified when quantity falls below this number'}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography><strong>Name:</strong> {formData.name}</Typography>
                <Typography><strong>Category:</strong> {CATEGORIES.find(c => c.value === formData.category)?.label}</Typography>
                <Typography><strong>Quantity:</strong> {formData.quantity}</Typography>
                <Typography><strong>Price:</strong> ${formData.price.toFixed(2)}</Typography>
                <Typography><strong>Total Value:</strong> ${(formData.quantity * formData.price).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2">
          {existingItem ? 'Edit Item' : 'Add New Item'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {existingItem ? 'Update item information' : 'Fill in the details for your new inventory item'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={isLoading}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={isLoading}
          >
            Next
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : existingItem ? 'Update Item' : 'Add Item'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddItemModal;
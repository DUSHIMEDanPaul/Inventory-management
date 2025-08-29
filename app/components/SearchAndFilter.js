'use client'
import React from 'react';
import {
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { CATEGORIES, SORT_OPTIONS } from '../constants';

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalItems,
  filteredCount,
  lowStockCount,
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleClearCategory = () => {
    onCategoryChange('all');
  };

  const hasActiveFilters = searchTerm || (categoryFilter && categoryFilter !== 'all');

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Stats Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Inventory Overview
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`${totalItems} Total Items`}
            variant="outlined"
            color="primary"
          />
          {hasActiveFilters && (
            <Chip 
              label={`${filteredCount} Filtered`}
              variant="outlined"
              color="secondary"
            />
          )}
          {lowStockCount > 0 && (
            <Chip 
              label={`${lowStockCount} Low Stock`}
              variant="filled"
              color="warning"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}>
        {/* Search Field */}
        <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
          <TextField
            fullWidth
            placeholder="Search items by name, description, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Tooltip title="Clear search">
                    <IconButton 
                      size="small" 
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              }
            }}
          />
        </Box>

        {/* Category Filter */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter || 'all'}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FilterIcon color="action" sx={{ ml: 1 }} />
              </InputAdornment>
            }
            sx={{
              borderRadius: 1.5,
            }}
          >
            <MenuItem value="all">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                All Categories
                {categoryFilter && categoryFilter !== 'all' && (
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearCategory();
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </MenuItem>
            {CATEGORIES.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy || 'name'}
            label="Sort By"
            onChange={(e) => onSortChange(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SortIcon color="action" sx={{ ml: 1 }} />
              </InputAdornment>
            }
            sx={{
              borderRadius: 1.5,
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            Active filters:
          </Typography>
          
          {searchTerm && (
            <Chip
              label={`Search: "${searchTerm}"`}
              onDelete={handleClearSearch}
              size="small"
              variant="outlined"
            />
          )}
          
          {categoryFilter && categoryFilter !== 'all' && (
            <Chip
              label={`Category: ${CATEGORIES.find(c => c.value === categoryFilter)?.label}`}
              onDelete={handleClearCategory}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SearchAndFilter;
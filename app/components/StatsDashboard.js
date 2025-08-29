'use client'
import React from 'react';
import {
  Paper,
  Grid,
  Typography,
  Box,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { formatCurrency, calculateTotalValue, getLowStockItems } from '../utils';
import { CATEGORIES } from '../constants';

const StatCard = ({ title, value, subtitle, icon: Icon, color, progress }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: color || 'inherit' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        <Box 
          sx={{ 
            p: 1.5,
            borderRadius: 2,
            backgroundColor: color ? `${color}15` : `${theme.palette.primary.main}15`,
          }}
        >
          <Icon 
            sx={{ 
              fontSize: 28,
              color: color || theme.palette.primary.main,
            }} 
          />
        </Box>
      </Box>
      
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: `${color}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 3,
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {Math.round(progress)}% of target
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

const CategoryBreakdown = ({ inventory }) => {
  const theme = useTheme();
  
  const categoryStats = CATEGORIES.map(category => {
    const items = inventory.filter(item => item.category === category.value);
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
    
    return {
      ...category,
      itemCount: items.length,
      totalQuantity,
      totalValue,
    };
  }).filter(category => category.itemCount > 0)
    .sort((a, b) => b.totalValue - a.totalValue);

  const maxValue = categoryStats.length > 0 ? Math.max(...categoryStats.map(c => c.totalValue)) : 1;

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Category Breakdown
      </Typography>
      
      {categoryStats.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No items in inventory
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {categoryStats.map((category, index) => (
            <Box key={category.value} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {category.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(category.totalValue)}
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={(category.totalValue / maxValue) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.action.hover,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {category.itemCount} items • {category.totalQuantity} total qty
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round((category.totalValue / maxValue) * 100)}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

const StatsDashboard = ({ inventory }) => {
  const theme = useTheme();
  
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = calculateTotalValue(inventory);
  const lowStockItems = getLowStockItems(inventory);
  const outOfStockItems = inventory.filter(item => item.quantity === 0);
  
  const averageValue = totalItems > 0 ? totalValue / totalItems : 0;
  const stockHealthPercentage = totalItems > 0 ? ((totalItems - lowStockItems.length) / totalItems) * 100 : 100;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Total Items */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Items"
            value={totalItems.toLocaleString()}
            subtitle={`${totalQuantity.toLocaleString()} total quantity`}
            icon={InventoryIcon}
            color={theme.palette.primary.main}
          />
        </Grid>

        {/* Total Value */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={formatCurrency(totalValue)}
            subtitle={`Avg: ${formatCurrency(averageValue)} per item`}
            icon={MoneyIcon}
            color={theme.palette.success.main}
          />
        </Grid>

        {/* Low Stock Alert */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockItems.length}
            subtitle={`${outOfStockItems.length} out of stock`}
            icon={WarningIcon}
            color={lowStockItems.length > 0 ? theme.palette.warning.main : theme.palette.success.main}
          />
        </Grid>

        {/* Stock Health */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stock Health"
            value={`${Math.round(stockHealthPercentage)}%`}
            subtitle="Items above low stock threshold"
            icon={TrendingIcon}
            color={stockHealthPercentage >= 80 ? theme.palette.success.main : 
                   stockHealthPercentage >= 60 ? theme.palette.warning.main : 
                   theme.palette.error.main}
            progress={stockHealthPercentage}
          />
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <CategoryBreakdown inventory={inventory} />
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Stats
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {[
                { label: 'Items with price data', value: inventory.filter(item => item.price > 0).length },
                { label: 'Items with descriptions', value: inventory.filter(item => item.description).length },
                { label: 'Categories in use', value: new Set(inventory.map(item => item.category)).size },
                { label: 'Items added today', value: inventory.filter(item => {
                  if (!item.createdAt) return false;
                  const today = new Date().toDateString();
                  const itemDate = (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt)).toDateString();
                  return today === itemDate;
                }).length },
              ].map((stat, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDashboard;
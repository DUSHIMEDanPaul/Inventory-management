'use client'
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { formatCurrency, formatDate, isLowStock } from '../utils';
import { CATEGORIES } from '../constants';

const ItemCard = ({ 
  item, 
  onAdd, 
  onRemove, 
  onEdit, 
  onDelete,
  isSelected = false,
  onSelect,
  showActions = true 
}) => {
  const theme = useTheme();
  const lowStock = isLowStock(item);
  const category = CATEGORIES.find(c => c.value === item.category);
  const totalValue = (item.quantity || 0) * (item.price || 0);

  const getStatusColor = () => {
    if (lowStock) return theme.palette.error.main;
    if (item.quantity === 0) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getStatusIcon = () => {
    if (lowStock || item.quantity === 0) return <WarningIcon />;
    return <CheckCircleIcon />;
  };

  const getStatusText = () => {
    if (item.quantity === 0) return 'Out of Stock';
    if (lowStock) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: onSelect ? 'pointer' : 'default',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        }
      }}
      onClick={onSelect}
    >
      {/* Status indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
        }}
      >
        <Tooltip title={getStatusText()}>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            size="small"
            sx={{
              backgroundColor: getStatusColor(),
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        </Tooltip>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 5 }}>
        {/* Category Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: theme.palette.primary.main,
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <Typography variant="h6">
              {item.name.charAt(0).toUpperCase()}
            </Typography>
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="h3"
              sx={{ 
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {category?.label || 'Uncategorized'}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        {item.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.description}
          </Typography>
        )}

        {/* Stats */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.quantity || 0}
            </Typography>
          </Box>
          
          {(item.price > 0) && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCurrency(item.price)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {formatCurrency(totalValue)}
                </Typography>
              </Box>
            </>
          )}

          {item.updatedAt && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Updated
              </Typography>
              <Typography variant="body2">
                {formatDate(item.updatedAt)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {showActions && (
        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
          {/* Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Remove one">
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); onRemove(item.name); }}
                disabled={item.quantity === 0}
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  },
                  '&:disabled': {
                    backgroundColor: theme.palette.action.disabled,
                  },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Typography 
              variant="h6" 
              sx={{ 
                minWidth: 30, 
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {item.quantity || 0}
            </Typography>
            
            <Tooltip title="Add one">
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); onAdd(item.name); }}
                sx={{
                  backgroundColor: theme.palette.success.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark,
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit item">
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                sx={{ color: theme.palette.primary.main }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete item">
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); onDelete(item.name); }}
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default ItemCard;
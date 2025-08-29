'use client'
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Inventory,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const NavigationHeader = ({ onAddItem, onExport, totalItems, lowStockCount }) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Inventory sx={{ mr: 2, fontSize: 28 }} />
          <Box>
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Enhanced Inventory
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {totalItems} items • {lowStockCount} low stock
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Add New Item (Ctrl+N)">
            <IconButton 
              color="inherit" 
              onClick={onAddItem}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export Data (Ctrl+E)">
            <IconButton 
              color="inherit" 
              onClick={onExport}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <ExportIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode (Ctrl+T)`}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationHeader;
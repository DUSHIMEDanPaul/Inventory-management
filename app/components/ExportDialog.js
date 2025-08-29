'use client'
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Description as CSVIcon,
  Code as JSONIcon,
} from '@mui/icons-material';
import { exportToCSV, exportToJSON, downloadFile } from '../utils';
import { EXPORT_FORMATS } from '../constants';

const ExportDialog = ({ open, onClose, inventory, filteredInventory }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const dataToExport = exportScope === 'all' ? inventory : filteredInventory;
      const timestamp = new Date().toISOString().split('T')[0];
      
      let content, filename, mimeType;
      
      if (exportFormat === 'csv') {
        content = exportToCSV(dataToExport);
        filename = `inventory-export-${timestamp}.csv`;
        mimeType = 'text/csv';
      } else {
        content = exportToJSON(dataToExport);
        filename = `inventory-export-${timestamp}.json`;
        mimeType = 'application/json';
      }
      
      downloadFile(content, filename, mimeType);
      
      // Close dialog after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'csv':
        return <CSVIcon />;
      case 'json':
        return <JSONIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getFormatDescription = (format) => {
    switch (format) {
      case 'csv':
        return 'Comma-separated values file. Compatible with Excel, Google Sheets, and other spreadsheet applications.';
      case 'json':
        return 'JavaScript Object Notation file. Structured data format ideal for importing into other applications.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DownloadIcon />
          <Typography variant="h6">Export Inventory Data</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {/* Export Scope */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Data to Export
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
            >
              <FormControlLabel
                value="filtered"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2">
                      Current filtered results ({filteredInventory.length} items)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Export only the items currently visible with applied filters
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2">
                      All inventory items ({inventory.length} items)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Export the complete inventory database
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>

          {/* Export Format */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Export Format
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              {EXPORT_FORMATS.map((format) => (
                <FormControlLabel
                  key={format.value}
                  value={format.value}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {getFormatIcon(format.value)}
                      <Box>
                        <Typography variant="body2">
                          {format.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getFormatDescription(format.value)}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Export Preview */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Export will include:</strong> Item name, category, quantity, price, description, 
              low stock threshold, creation date, and last updated date.
            </Typography>
          </Alert>

          {/* Warning for large exports */}
          {inventory.length > 1000 && exportScope === 'all' && (
            <Alert severity="warning">
              <Typography variant="body2">
                Large export detected ({inventory.length} items). This may take a moment to process.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={isExporting || (exportScope === 'filtered' && filteredInventory.length === 0)}
          startIcon={isExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
        >
          {isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
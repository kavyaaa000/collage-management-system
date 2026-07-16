import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import apiService from '../services/api';

interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  documentId: number | null;
  title?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  open,
  onClose,
  documentId,
  title = 'Document Viewer',
}) => {
  if (!documentId) return null;

  const viewUrl = apiService.getDocumentViewUrl(documentId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <iframe
          src={viewUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
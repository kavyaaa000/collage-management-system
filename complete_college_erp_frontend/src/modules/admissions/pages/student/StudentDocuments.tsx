import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  Paper,
  Chip,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  CloudUpload,
  Visibility,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import type { StudentDocumentDTO, StudentDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import DocumentViewer from '../../components/DocumentViewer';

const DOCUMENT_TYPES = [
  { value: 'PHOTO', label: 'Passport Photo' },
  { value: 'TENTH_MARKSHEET', label: '10th Marksheet' },
  { value: 'TWELFTH_MARKSHEET', label: '12th Marksheet' },
  { value: 'TRANSFER_CERTIFICATE', label: 'Transfer Certificate' },
  { value: 'COMMUNITY_CERTIFICATE', label: 'Community Certificate' },
  { value: 'INCOME_CERTIFICATE', label: 'Income Certificate' },
];

const StudentDocuments: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboardDTO | null>(null);
  const [documents, setDocuments] = useState<StudentDocumentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, docsRes] = await Promise.all([
        apiService.getStudentDashboard(),
        apiService.getMyDocuments(),
      ]);
      setDashboard(dashboardRes.data);
      setDocuments(docsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Only PDF and image files (JPG, PNG) are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(documentType);

    try {
      await apiService.uploadDocument(file, documentType);
      setSuccess(`${documentType} uploaded successfully`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const viewDocument = (documentId: number) => {
    setSelectedDocument(documentId);
    setViewerOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  const isSubmitted = dashboard?.profile.registrationStatus === 'SUBMITTED';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Document Upload
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {isSubmitted && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your registration has been submitted. Documents cannot be changed.
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Document Requirements:
        </Typography>
        <Typography variant="body2">
          • Accepted formats: PDF, JPG, PNG
          <br />
          • Maximum file size: 10MB
          <br />• Upload clear, readable copies of all required documents
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = documents.find((d) => d.documentType === docType.value);
          const isUploading = uploading === docType.value;

          return (
            <Grid item xs={12} md={6} key={docType.value}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1">{docType.label}</Typography>
                  {uploaded ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Uploaded"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip icon={<ErrorIcon />} label="Required" color="error" size="small" />
                  )}
                </Box>

                {uploaded && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {uploaded.originalFilename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uploaded: {new Date(uploaded.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {uploaded && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => viewDocument(uploaded.id)}
                      fullWidth
                    >
                      View
                    </Button>
                  )}

                  {!isSubmitted && (
                    <Button
                      variant="contained"
                      size="small"
                      component="label"
                      startIcon={<CloudUpload />}
                      disabled={isUploading}
                      fullWidth
                    >
                      {isUploading
                        ? 'Uploading...'
                        : uploaded
                        ? 'Replace'
                        : 'Upload'}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, docType.value)}
                      />
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentId={selectedDocument}
        title="Document Viewer"
      />

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Box>
  );
};

export default StudentDocuments;
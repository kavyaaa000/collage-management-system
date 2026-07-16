import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
} from '@mui/icons-material';
import type { StudentProfileDTO, StudentDocumentDTO } from '../../services/api';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import DocumentViewer from '../../components/DocumentViewer';

const StudentVerification: React.FC = () => {
  const [students, setStudents] = useState<StudentProfileDTO[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileDTO | null>(null);
  const [documents, setDocuments] = useState<StudentDocumentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [correctionDialog, setCorrectionDialog] = useState(false);
  const [correctionRemarks, setCorrectionRemarks] = useState('');

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await apiService.getPendingVerifications();
      setStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (student: StudentProfileDTO) => {
    setSelectedStudent(student);
    try {
     const response = await apiService.getStudentDocuments(student.id);
setDocuments(response.data);

    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const handleVerify = async () => {
    if (!selectedStudent) return;

    setProcessing(true);
    setError('');

    try {
      await apiService.verifyStudent(selectedStudent.id);
      setSuccess('Student verified successfully');
      setSelectedStudent(null);
      fetchPendingStudents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify student');
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!selectedStudent || !correctionRemarks.trim()) {
      setError('Please enter correction remarks');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      await apiService.requestCorrection(selectedStudent.id, correctionRemarks);
      setSuccess('Correction request sent successfully');
      setCorrectionDialog(false);
      setCorrectionRemarks('');
      setSelectedStudent(null);
      fetchPendingStudents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request correction');
    } finally {
      setProcessing(false);
    }
  };

  const viewDocument = (documentId: number) => {
    setSelectedDocument(documentId);
    setViewerOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Verification
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {students.length === 0 ? (
        <Alert severity="info">No students pending verification</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Students List */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Students ({students.length})
                </Typography>
                <List>
                  {students.map((student) => (
                    <Paper
                      key={student.id}
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        bgcolor:
                          selectedStudent?.id === student.id
                            ? 'action.selected'
                            : 'background.paper',
                      }}
                      onClick={() => selectStudent(student)}
                    >
                      <ListItem>
                        <ListItemText
                          primary={student.fullName}
                          secondary={student.applicationNumber}
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Student Details */}
          <Grid item xs={12} md={8}>
            {selectedStudent ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Student Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.fullName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Application Number
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.applicationNumber}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.email}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.phone || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.dateOfBirth || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Gender
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.gender || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Stream
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.stream || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Cutoff Score
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.cutoffScore || 'Not calculated'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.address || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.city || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        State
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.state || 'Not provided'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Pincode
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedStudent.pincode || 'Not provided'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Documents
                  </Typography>

                  {documents.length === 0 ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      No documents uploaded yet
                    </Alert>
                  ) : (
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {documents.map((doc) => (
                        <Grid item xs={12} md={6} key={doc.id}>
                          <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              {doc.documentType.replace(/_/g, ' ')}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => viewDocument(doc.id)}
                            >
                              View
                            </Button>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={handleVerify}
                      disabled={processing}
                      fullWidth
                    >
                      Verify Student
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ErrorIcon />}
                      onClick={() => setCorrectionDialog(true)}
                      disabled={processing}
                      fullWidth
                    >
                      Request Correction
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">Select a student to view details</Alert>
            )}
          </Grid>
        </Grid>
      )}

      {/* Correction Dialog */}
      <Dialog
        open={correctionDialog}
        onClose={() => setCorrectionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Correction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Correction Remarks"
            value={correctionRemarks}
            onChange={(e) => setCorrectionRemarks(e.target.value)}
            placeholder="Specify what needs to be corrected..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCorrectionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRequestCorrection}
            variant="contained"
            color="error"
            disabled={processing || !correctionRemarks.trim()}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Viewer */}
      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentId={selectedDocument}
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

export default StudentVerification;
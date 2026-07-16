
import apiService from '../../services/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Pending,
  Error as ErrorIcon,
  School,
} from '@mui/icons-material';
import type { StudentDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<StudentDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getStudentDashboard();
      setDashboard(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CORRECTION_REQUESTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle />;
      case 'PENDING':
        return <Pending />;
      case 'CORRECTION_REQUESTED':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    if (!dashboard) return 0;
    let completed = 0;
    const total = 4;

    if (dashboard.profile.phone && dashboard.profile.dateOfBirth) completed++;
    if (dashboard.marks) completed++;
    if (dashboard.preferences.length > 0) completed++;
    if (dashboard.documents.length >= 3) completed++;

    return (completed / total) * 100;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!dashboard) return <Alert severity="error">No data available</Alert>;

  const progress = calculateProgress();
  const isSubmitted = dashboard.profile.registrationStatus === 'SUBMITTED';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Application Number: <strong>{dashboard.profile.applicationNumber}</strong>
      </Typography>

      {/* Registration Window Status */}
      <Alert
        severity={dashboard.registrationWindowStatus === 'OPEN' ? 'info' : 'warning'}
        sx={{ mb: 3 }}
      >
        Registration Window:{' '}
        <strong>{dashboard.registrationWindowStatus}</strong>
      </Alert>

      {/* Verification Status */}
      {dashboard.profile.verificationStatus === 'CORRECTION_REQUESTED' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Correction Required
          </Typography>
          <Typography variant="body2">
            {dashboard.profile.verificationRemarks}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => navigate('/student/profile')}
          >
            Edit Profile
          </Button>
        </Alert>
      )}

      {/* Progress */}
      {!isSubmitted && (
  <Card sx={{ mb: 3, p: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Registration Progress
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Complete all steps and then submit your registration.
      </Typography>

      {/* ✅ SUBMIT BUTTON */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={progress < 100}
        onClick={async () => {
          try {
            setError('');
            const response = await apiService.submitRegistration();
            setDashboard((prev) =>
              prev
                ? {
                    ...prev,
                    profile: {
                      ...prev.profile,
                      registrationStatus: 'SUBMITTED',
                    },
                  }
                : prev
            );
          } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit registration');
          }
        }}
      >
        Submit Registration
      </Button>

      {progress < 100 && (
        <Typography variant="caption" color="error">
          Complete all required sections before submitting.
        </Typography>
      )}
    </CardContent>
  </Card>
)}

      <Grid container spacing={3}>
        {/* Profile Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {getStatusIcon(dashboard.profile.verificationStatus)}
                <Chip
                  label={dashboard.profile.verificationStatus}
                  color={getStatusColor(dashboard.profile.verificationStatus)}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Stream: {dashboard.profile.stream || 'Not set'}
              </Typography>
              {dashboard.profile.cutoffScore && (
                <Typography variant="body2" color="text.secondary">
                  Cutoff Score: <strong>{dashboard.profile.cutoffScore}</strong>
                </Typography>
              )}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/profile')}
                disabled={isSubmitted}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Marks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Academic Marks
              </Typography>
              {dashboard.marks ? (
                <Box>
                  <Typography variant="body2">
                    Physics: {dashboard.marks.physicsMarks}
                  </Typography>
                  <Typography variant="body2">
                    Chemistry: {dashboard.marks.chemistryMarks}
                  </Typography>
                  {dashboard.marks.mathsMarks && (
                    <Typography variant="body2">
                      Maths: {dashboard.marks.mathsMarks}
                    </Typography>
                  )}
                  {dashboard.marks.computerScienceMarks && (
                    <Typography variant="body2">
                      Computer Science: {dashboard.marks.computerScienceMarks}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No marks entered yet
                </Typography>
              )}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/marks')}
                disabled={isSubmitted}
              >
                {dashboard.marks ? 'Edit Marks' : 'Enter Marks'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Preferences
              </Typography>
              {dashboard.preferences.length > 0 ? (
                <List dense>
                  {dashboard.preferences.map((pref) => (
                    <ListItem key={pref.id} disableGutters>
                      <ListItemText
                        primary={`${pref.preferenceOrder}. ${pref.departmentName}`}
                        secondary={pref.departmentCode}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No preferences set yet
                </Typography>
              )}
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/preferences')}
                disabled={isSubmitted}
              >
                {dashboard.preferences.length > 0 ? 'Edit Preferences' : 'Set Preferences'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Uploaded: {dashboard.documents.length} documents
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/documents')}
                disabled={isSubmitted}
              >
                Manage Documents
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Admission Result */}
        {dashboard.admissionResult && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School color="primary" />
                  <Typography variant="h6">Admission Result</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {dashboard.admissionResult.allocationStatus === 'ALLOTTED' ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Congratulations! You have been allotted a seat.
                    </Alert>
                    <Typography variant="body1" gutterBottom>
                      <strong>Department:</strong>{' '}
                      {dashboard.admissionResult.allocatedDepartmentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Department Code: {dashboard.admissionResult.allocatedDepartmentCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Offer Status:{' '}
                      <Chip
                        label={dashboard.admissionResult.offerStatus}
                        size="small"
                        color={
                          dashboard.admissionResult.offerStatus === 'ACCEPTED'
                            ? 'success'
                            : dashboard.admissionResult.offerStatus === 'DECLINED'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Your application is being processed. Results will be announced soon.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
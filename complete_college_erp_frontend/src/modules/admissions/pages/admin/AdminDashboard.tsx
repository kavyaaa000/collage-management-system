import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  People,
  Pending,
  CheckCircle,
  Error as ErrorIcon,
  Business,
  EventSeat,
  AssignmentTurnedIn,
  AssignmentLate,
} from '@mui/icons-material';
import type { AdminDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getAdminDashboard();
      setDashboard(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRegistration = async () => {
    setToggling(true);
    setError('');
    try {
      const response = await apiService.toggleRegistrationWindow();
      setSuccess(response.message);
      fetchDashboard();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle registration');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !dashboard) return <Alert severity="error">{error}</Alert>;
  if (!dashboard) return <Alert severity="error">No data available</Alert>;

  const registrationOpen = dashboard.registrationWindowStatus === 'OPEN';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="contained"
          color={registrationOpen ? 'error' : 'success'}
          onClick={handleToggleRegistration}
          disabled={toggling}
        >
          {toggling
            ? 'Processing...'
            : registrationOpen
            ? 'Close Registration'
            : 'Open Registration'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Registration Status */}
      <Alert severity={registrationOpen ? 'success' : 'warning'} sx={{ mb: 3 }}>
        <Typography variant="subtitle2">
          Registration Window: <strong>{dashboard.registrationWindowStatus}</strong>
        </Typography>
        <Typography variant="body2">
          Admission Process: <strong>{dashboard.admissionProcessStatus}</strong>
        </Typography>
      </Alert>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Student Statistics
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People color="primary" />
                <Typography variant="h5">{dashboard.totalStudents}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pending color="warning" />
                <Typography variant="h5">{dashboard.pendingVerification}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Pending Verification
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="h5">{dashboard.verified}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Verified
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="h5">{dashboard.correctionRequested}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Correction Requested
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Department & Seats
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="primary" />
                <Typography variant="h5">{dashboard.totalDepartments}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventSeat color="info" />
                <Typography variant="h5">{dashboard.totalSeatsAvailable}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Seats Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Admission Results
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentTurnedIn color="success" />
                <Typography variant="h5">{dashboard.allottedStudents}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Allotted Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentLate color="error" />
                <Typography variant="h5">{dashboard.notAllottedStudents}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Not Allotted
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="h5">{dashboard.acceptedOffers}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Accepted Offers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="h5">{dashboard.declinedOffers}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Declined Offers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/departments')}
              >
                Manage Departments
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/staff')}
              >
                Manage Staff
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/admin/students')}
              >
                View Students
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/admin/admissions')}
              >
                Admission Process
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
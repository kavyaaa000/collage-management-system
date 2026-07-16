import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  People,
  Pending,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import apiService from '../../services/api';
import type { StaffDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<StaffDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getStaffDashboard();
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

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!dashboard) return <Alert severity="error">No data available</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <People color="primary" />
                <Typography variant="h6">{dashboard.totalAssignedStudents}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Assigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Pending color="warning" />
                <Typography variant="h6">{dashboard.pendingVerification}</Typography>
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
                <Typography variant="h6">{dashboard.verified}</Typography>
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
                <Typography variant="h6">{dashboard.correctionRequested}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Correction Requested
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {dashboard.pendingVerification > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have {dashboard.pendingVerification} student(s) pending verification.{' '}
          <Button
            size="small"
            onClick={() => navigate('/staff/verification')}
            sx={{ ml: 1 }}
          >
            Verify Now
          </Button>
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Assigned Students
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Stream</TableCell>
                  <TableCell>Cutoff</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboard.assignedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No students assigned yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  dashboard.assignedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.applicationNumber}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.stream || '-'}</TableCell>
                      <TableCell>{student.cutoffScore || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.verificationStatus}
                          color={getStatusColor(student.verificationStatus)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffDashboard;
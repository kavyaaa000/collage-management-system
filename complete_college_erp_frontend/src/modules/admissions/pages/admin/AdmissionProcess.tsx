import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Send,
  Assessment,
} from '@mui/icons-material';
import type { AdmissionResultDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdmissionProcess: React.FC = () => {
  const [results, setResults] = useState<AdmissionResultDTO[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Run Admission Process', 'Review Results', 'Notify Students'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resultsRes, statsRes] = await Promise.all([
        apiService.getAdmissionResults(),
        apiService.getAdmissionStatistics(),
      ]);
      setResults(resultsRes.data);
      setStatistics(statsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAdmission = async () => {
    if (
      !confirm(
        'This will allocate departments to all verified students. This action cannot be undone. Continue?'
      )
    )
      return;

    setProcessing(true);
    setError('');
    try {
      const response = await apiService.runAdmissionProcess();
      setSuccess(response.message);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to run admission process');
    } finally {
      setProcessing(false);
    }
  };

  const handleNotifyStudents = async () => {
    if (!confirm('This will send emails to all students with their admission results. Continue?'))
      return;

    setProcessing(true);
    setError('');
    try {
      const response = await apiService.notifyStudents();
      setSuccess(response.message);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to notify students');
    } finally {
      setProcessing(false);
    }
  };

  const getAllocationColor = (status: string) => {
    switch (status) {
      case 'ALLOTTED':
        return 'success';
      case 'NOT_ALLOTTED':
        return 'error';
      case 'WAITLISTED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getOfferColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'DECLINED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admission Process
      </Typography>

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

      {/* Process Steps */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={results.length > 0 ? 2 : 0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleRunAdmission}
              disabled={processing}
              size="large"
            >
              {processing ? 'Running...' : 'Run Admission Process'}
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<Send />}
              onClick={handleNotifyStudents}
              disabled={processing || results.length === 0}
              size="large"
            >
              {processing ? 'Sending...' : 'Notify Students'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Statistics */}
      {statistics && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
              Admission Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {statistics.verifiedStudents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Verified Students
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {statistics.allotted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Allotted
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {statistics.notAllotted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Not Allotted
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {statistics.accepted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accepted Offers
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Department Statistics */}
            {statistics.departmentStatistics && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Department-wise Allocation
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell align="center">Total Seats</TableCell>
                        <TableCell align="center">Allocated</TableCell>
                        <TableCell align="center">Available</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statistics.departmentStatistics.map((dept: any) => (
                        <TableRow key={dept.code}>
                          <TableCell>
                            {dept.name} ({dept.code})
                          </TableCell>
                          <TableCell align="center">{dept.totalSeats}</TableCell>
                          <TableCell align="center">{dept.allocatedSeats}</TableCell>
                          <TableCell align="center">{dept.availableSeats}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Admission Results ({results.length})
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application No.</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell align="center">Cutoff Score</TableCell>
                  <TableCell>Allocated Department</TableCell>
                  <TableCell align="center">Allocation Status</TableCell>
                  <TableCell align="center">Offer Status</TableCell>
                  <TableCell align="center">Notified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No results available. Run the admission process first.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.applicationNumber}</TableCell>
                      <TableCell>{result.studentName}</TableCell>
                      <TableCell align="center">{result.cutoffScore}</TableCell>
                      <TableCell>
                        {result.allocatedDepartmentName
                          ? `${result.allocatedDepartmentName} (${result.allocatedDepartmentCode})`
                          : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.allocationStatus}
                          color={getAllocationColor(result.allocationStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.offerStatus}
                          color={getOfferColor(result.offerStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.notificationSent ? 'Yes' : 'No'}
                          color={result.notificationSent ? 'success' : 'default'}
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

export default AdmissionProcess;
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import type{ StudentDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentMarks: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    physicsMarks: '',
    chemistryMarks: '',
    mathsMarks: '',
    computerScienceMarks: '',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiService.getStudentDashboard();
      const data = response.data;
      setDashboard(data);

      if (data.marks) {
        setFormData({
          physicsMarks: data.marks.physicsMarks?.toString() || '',
          chemistryMarks: data.marks.chemistryMarks?.toString() || '',
          mathsMarks: data.marks.mathsMarks?.toString() || '',
          computerScienceMarks: data.marks.computerScienceMarks?.toString() || '',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const stream = dashboard?.profile.stream;

      if (!stream) {
        setError('Please set your stream in profile first');
        setSaving(false);
        return;
      }

      const payload: any = {
        physicsMarks: parseFloat(formData.physicsMarks),
        chemistryMarks: parseFloat(formData.chemistryMarks),
      };

      if (stream === 'BIO_MATHS') {
        if (!formData.mathsMarks) {
          setError('Maths marks are required for Bio-Maths stream');
          setSaving(false);
          return;
        }
        payload.mathsMarks = parseFloat(formData.mathsMarks);
      } else if (stream === 'COMPUTER_SCIENCE') {
        if (!formData.computerScienceMarks) {
          setError('Computer Science marks are required for CS stream');
          setSaving(false);
          return;
        }
        payload.computerScienceMarks = parseFloat(formData.computerScienceMarks);
      }

      await apiService.updateMarks(payload);
      setSuccess(true);
      fetchDashboard();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update marks');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const isSubmitted = dashboard?.profile.registrationStatus === 'SUBMITTED';
  const stream = dashboard?.profile.stream;
  const isBioMaths = stream === 'BIO_MATHS';
  const isCS = stream === 'COMPUTER_SCIENCE';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Academic Marks
      </Typography>

      {!stream && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please set your stream in profile before entering marks.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isSubmitted && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your registration has been submitted. Marks cannot be edited.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cutoff Calculation
            </Typography>
            <Typography variant="body2">
              {isBioMaths && 'Bio-Maths: Maths + Physics/2 + Chemistry/2'}
              {isCS && 'Computer Science: CS + Physics/2 + Chemistry/2'}
            </Typography>
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Physics Marks"
                  value={formData.physicsMarks}
                  onChange={(e) => handleChange('physicsMarks', e.target.value)}
                  disabled={isSubmitted || !stream}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  helperText="Out of 100"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Chemistry Marks"
                  value={formData.chemistryMarks}
                  onChange={(e) => handleChange('chemistryMarks', e.target.value)}
                  disabled={isSubmitted || !stream}
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  helperText="Out of 100"
                />
              </Grid>

              {isBioMaths && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Maths Marks"
                    value={formData.mathsMarks}
                    onChange={(e) => handleChange('mathsMarks', e.target.value)}
                    disabled={isSubmitted}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    helperText="Out of 100"
                  />
                </Grid>
              )}

              {isCS && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="number"
                    label="Computer Science Marks"
                    value={formData.computerScienceMarks}
                    onChange={(e) =>
                      handleChange('computerScienceMarks', e.target.value)
                    }
                    disabled={isSubmitted}
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    helperText="Out of 100"
                  />
                </Grid>
              )}

              {dashboard?.profile.cutoffScore && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="subtitle2">
                      Your Cutoff Score: <strong>{dashboard.profile.cutoffScore}</strong>
                    </Typography>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitted || saving || !stream}
                >
                  {saving ? 'Saving...' : 'Save Marks'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Marks updated successfully"
      />
    </Box>
  );
};

export default StudentMarks;
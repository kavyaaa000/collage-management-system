import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  Delete,
  Add,
} from '@mui/icons-material';
import type { DepartmentDTO, StudentDashboardDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

interface PreferenceItem {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  preferenceOrder: number;
}

const StudentPreferences: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboardDTO | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [preferences, setPreferences] = useState<PreferenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, departmentsRes] = await Promise.all([
        apiService.getStudentDashboard(),
        apiService.getActiveDepartments(),
      ]);

      setDashboard(dashboardRes.data);
      setDepartments(departmentsRes.data);

      // Initialize preferences
      if (dashboardRes.data.preferences.length > 0) {
        setPreferences(
          dashboardRes.data.preferences.map((p) => ({
            departmentId: p.departmentId,
            departmentCode: p.departmentCode,
            departmentName: p.departmentName,
            preferenceOrder: p.preferenceOrder,
          }))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addPreference = (dept: DepartmentDTO) => {
    if (preferences.find((p) => p.departmentId === dept.id)) {
      setError('Department already added');
      return;
    }

    const newPreference: PreferenceItem = {
      departmentId: dept.id,
      departmentCode: dept.code,
      departmentName: dept.name,
      preferenceOrder: preferences.length + 1,
    };

    setPreferences([...preferences, newPreference]);
  };

  const removePreference = (departmentId: number) => {
    const updated = preferences
      .filter((p) => p.departmentId !== departmentId)
      .map((p, index) => ({ ...p, preferenceOrder: index + 1 }));
    setPreferences(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...preferences];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((p, i) => (p.preferenceOrder = i + 1));
    setPreferences(updated);
  };

  const moveDown = (index: number) => {
    if (index === preferences.length - 1) return;
    const updated = [...preferences];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((p, i) => (p.preferenceOrder = i + 1));
    setPreferences(updated);
  };

  const handleSubmit = async () => {
    if (preferences.length === 0) {
      setError('Please add at least one preference');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const payload = {
        preferences: preferences.map((p) => ({
          departmentId: p.departmentId,
          preferenceOrder: p.preferenceOrder,
        })),
      };

      await apiService.updatePreferences(payload);
      setSuccess(true);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const isSubmitted = dashboard?.profile.registrationStatus === 'SUBMITTED';
  const availableDepartments = departments.filter(
    (d) => !preferences.find((p) => p.departmentId === d.id)
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Department Preferences
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isSubmitted && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your registration has been submitted. Preferences cannot be edited.
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        Arrange departments in order of preference. Top preference will be considered first
        during admission allocation.
      </Alert>

      {/* Current Preferences */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Preferences
          </Typography>

          {preferences.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No preferences added yet
            </Typography>
          ) : (
            <List>
              {preferences.map((pref, index) => (
                <Paper key={pref.departmentId} sx={{ mb: 1 }}>
                  <ListItem
                    secondaryAction={
                      !isSubmitted && (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUpward />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => moveDown(index)}
                            disabled={index === preferences.length - 1}
                          >
                            <ArrowDownward />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removePreference(pref.departmentId)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      )
                    }
                  >
                    <Chip
                      label={pref.preferenceOrder}
                      color="primary"
                      size="small"
                      sx={{ mr: 2 }}
                    />
                    <ListItemText
                      primary={pref.departmentName}
                      secondary={pref.departmentCode}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}

          {!isSubmitted && (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={saving || preferences.length === 0}
              sx={{ mt: 2 }}
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Available Departments */}
      {!isSubmitted && availableDepartments.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Departments
            </Typography>
            <List>
              {availableDepartments.map((dept) => (
                <Paper key={dept.id} sx={{ mb: 1 }}>
                  <ListItem
                    secondaryAction={
                      <Button
                        startIcon={<Add />}
                        onClick={() => addPreference(dept)}
                        size="small"
                      >
                        Add
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={dept.name}
                      secondary={`${dept.code} - ${dept.availableSeats} seats available`}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Preferences saved successfully"
      />
    </Box>
  );
};

export default StudentPreferences;
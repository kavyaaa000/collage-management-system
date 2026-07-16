import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Snackbar,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { DepartmentDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentDTO | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    totalSeats: '',
    isActive: true,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await apiService.getAllDepartments();
      setDepartments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedDept(null);
    setFormData({ code: '', name: '', totalSeats: '', isActive: true });
    setDialogOpen(true);
  };

  const handleOpenEdit = (dept: DepartmentDTO) => {
    setEditMode(true);
    setSelectedDept(dept);
    setFormData({
      code: dept.code,
      name: dept.name,
      totalSeats: dept.totalSeats.toString(),
      isActive: dept.isActive,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setFormData({ code: '', name: '', totalSeats: '', isActive: true });
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setProcessing(true);

    try {
      if (editMode && selectedDept) {
        await apiService.updateDepartment(selectedDept.id, {
          name: formData.name,
          totalSeats: parseInt(formData.totalSeats),
          isActive: formData.isActive,
        });
        setSuccess('Department updated successfully');
      } else {
        await apiService.createDepartment({
          code: formData.code,
          name: formData.name,
          totalSeats: parseInt(formData.totalSeats),
        });
        setSuccess('Department created successfully');
      }
      handleClose();
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    setProcessing(true);
    try {
      await apiService.deleteDepartment(id);
      setSuccess('Department deleted successfully');
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete department');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Department Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Add Department
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Total Seats</TableCell>
                  <TableCell align="center">Available Seats</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No departments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell align="center">{dept.totalSeats}</TableCell>
                      <TableCell align="center">{dept.availableSeats}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={dept.isActive ? 'Active' : 'Inactive'}
                          color={dept.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEdit(dept)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(dept.id)}
                          disabled={processing}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Department' : 'Create Department'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              required
              label="Department Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              disabled={editMode}
              helperText="Cannot be changed after creation"
            />

            <TextField
              fullWidth
              required
              label="Department Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Total Seats"
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
              inputProps={{ min: 0 }}
            />

            {editMode && (
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value === 'true' })
                }
                SelectProps={{ native: true }}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </TextField>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              processing ||
              !formData.name ||
              !formData.totalSeats ||
              (!editMode && !formData.code)
            }
          >
            {processing ? 'Processing...' : editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Box>
  );
};

export default DepartmentManagement;
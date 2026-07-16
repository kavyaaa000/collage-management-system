import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search } from '@mui/icons-material';
import apiService from '../../services/api';
import type { StudentProfileDTO } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<StudentProfileDTO[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentProfileDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');




const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
const [selectedStudent, setSelectedStudent] = useState<StudentProfileDTO | null>(null);
const [staffList, setStaffList] = useState<UserDTO[]>([]);
const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);

const handleOpenReassign = (student: StudentProfileDTO) => {
  setSelectedStudent(student);
  apiService.getAllStaff().then(res => setStaffList(res.data));
  setReassignDialogOpen(true);
};

const handleReassign = async () => {
  await apiService.reassignMentor({
    studentProfileId: selectedStudent!.id,
    mentorId: selectedMentorId!
  });
  setReassignDialogOpen(false);
  fetchStudents();
};






  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, statusFilter, students]);

  const fetchStudents = async () => {
    try {
      const response = await apiService.getAllStudents();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((s) => s.verificationStatus === statusFilter);
    }

    setFilteredStudents(filtered);
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

  const getRegistrationColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by name, email, or application number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Verification Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="VERIFIED">Verified</MenuItem>
              <MenuItem value="CORRECTION_REQUESTED">Correction Requested</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Students ({filteredStudents.length})
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>





                  <TableCell>Application No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Stream</TableCell>
                  <TableCell align="center">Cutoff</TableCell>
                  <TableCell>Assigned Mentor</TableCell>
                  <TableCell align="center">Verification</TableCell>
                  <TableCell align="center">Registration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No students found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.applicationNumber}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.stream || '-'}</TableCell>
                      <TableCell align="center">
                        {student.cutoffScore || '-'}
                      </TableCell>
                      <TableCell>
                        {student.assignedMentorName || 'Not assigned'}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.verificationStatus}
                          color={getStatusColor(student.verificationStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.registrationStatus}
                          color={getRegistrationColor(student.registrationStatus)}
                          size="small"
                        />
                      </TableCell>



                        
                                        <TableCell align="center">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenReassign(student)}
                        >
                            Assign / Change
                        </Button>
                        </TableCell>








                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>


                <Dialog open={reassignDialogOpen} onClose={() => setReassignDialogOpen(false)}>
  <DialogTitle>Assign Mentor</DialogTitle>
  <DialogContent sx={{ pt: 2 }}>
    <TextField
      select
      fullWidth
      label="Select Mentor"
      value={selectedMentorId || ''}
      onChange={(e) => setSelectedMentorId(Number(e.target.value))}
    >
      {staffList.map(s => (
        <MenuItem key={s.id} value={s.id}>
          {s.fullName} ({s.email})
        </MenuItem>
      ))}
    </TextField>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setReassignDialogOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleReassign} disabled={!selectedMentorId}>
      Save
    </Button>
  </DialogActions>
</Dialog>






    </Box>
  );
};

export default StudentManagement;
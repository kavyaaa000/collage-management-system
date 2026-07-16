import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel } from '@mui/icons-material';
import { contestApi, ContestResponse, ApprovalRequest } from '../api/contests';

export const ApproveContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<ContestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<boolean>(true);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const data = await contestApi.getById(Number(id));
        setContest(data);
        setError('');
      } catch (err: any) {
        setError('Failed to load contest details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContest();
    }
  }, [id]);

  const handleOpenDialog = (approved: boolean) => {
    setApprovalDecision(approved);
    setReason('');
    setDialogOpen(true);
  };

  const handleSubmitApproval = async () => {
    if (!approvalDecision && !reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setSubmitting(true);
      const request: ApprovalRequest = {
        approved: approvalDecision,
        reason: reason.trim() || undefined,
      };
      await contestApi.approve(Number(id), request);
      navigate('/contests');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to process approval');
    } finally {
      setSubmitting(false);
      setDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error && !contest) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/contests')} sx={{ mt: 2 }}>
          Back to Contests
        </Button>
      </Container>
    );
  }

  if (!contest || contest.status !== 'PENDING_APPROVAL') {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">This contest is not pending approval</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/contests')} sx={{ mt: 2 }}>
          Back to Contests
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/contests')} sx={{ mb: 2 }}>
        Back to Contests
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Review Contest
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">{contest.title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {contest.description}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Scope: {contest.scope}
            </Typography>
            {contest.departmentName && (
              <Typography variant="subtitle2" color="text.secondary">
                Department: {contest.departmentName}
              </Typography>
            )}
            <Typography variant="subtitle2" color="text.secondary">
              Created By: {contest.createdByName}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Start: {new Date(contest.startTime).toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              End: {new Date(contest.endTime).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => handleOpenDialog(true)}
              size="large"
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleOpenDialog(false)}
              size="large"
            >
              Reject
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {approvalDecision ? 'Approve Contest' : 'Reject Contest'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {approvalDecision
              ? 'This contest will be made active and visible to participants.'
              : 'Please provide a reason for rejection:'}
          </Typography>
          {!approvalDecision && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for Rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitApproval}
            variant="contained"
            color={approvalDecision ? 'success' : 'error'}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
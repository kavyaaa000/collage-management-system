import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, EmojiEvents, Schedule, CheckCircle } from '@mui/icons-material';
import { canCreateContest, isHodOrAdmin } from '../utils/roles';
import { useAuth } from '../hooks/useAuth';
import { contestApi, ContestResponse } from '../api/contests';

export const ContestsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contests, setContests] = useState<ContestResponse[]>([]);
  const [pendingContests, setPendingContests] = useState<ContestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // REPLACE fetchContests function with this:

const fetchContests = async () => {
  try {
    setLoading(true);
    setError(''); // Clear previous errors
    
    const data = await contestApi.getVisible();
    
    // ✅ Validate response
    if (!Array.isArray(data)) {
      throw new Error('Invalid response from server');
    }
    
    setContests(data);
    
    // ✅ Log for debugging
    console.log(`Loaded ${data.length} contests`);
    
  } catch (err: any) {
    console.error('Failed to load contests:', err);
    
    // ✅ Better error messages
    if (err.response?.status === 401) {
      setError('Session expired. Please login again.');
      // Optionally redirect to login
    } else if (err.response?.status === 403) {
      setError('Access denied. Please check your permissions.');
    } else {
      setError(err.response?.data || err.message || 'Failed to load contests');
    }
    
    // ✅ Clear contests on error
    setContests([]);
  } finally {
    setLoading(false);
  }
};

  const fetchPending = async () => {
    try {
      const data = await contestApi.getPending();
      setPendingContests(data);
    } catch (err) {
      console.error('Failed to load pending contests');
    }
  };

  useEffect(() => {
    fetchContests();
    if (isHodOrAdmin(user?.role)) {
      fetchPending();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'default';
      case 'PENDING_APPROVAL':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const displayContests = tabValue === 0 ? contests : pendingContests;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Contests</Typography>
        {canCreateContest(user?.role) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/contests/create')}
          >
            Create Contest
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isHodOrAdmin(user?.role) && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Contests" />
            <Tab label={`Pending Approvals (${pendingContests.length})`} />
          </Tabs>
        </Box>
      )}

      {loading ? (
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <Typography>Loading contests...</Typography>
        </Paper>
      ) : displayContests.length === 0 ? (
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <EmojiEvents sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {tabValue === 0 ? 'No Contests Available' : 'No Pending Approvals'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {tabValue === 0 
              ? 'Check back later for new contests!' 
              : 'All contests have been reviewed'}
          </Typography>
          {canCreateContest(user?.role) && tabValue === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/contests/create')}
            >
              Create Your First Contest
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {displayContests.map((contest) => (
            <Grid item xs={12} md={6} key={contest.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {contest.title}
                    </Typography>
                    <Chip
                      label={contest.status}
                      color={getStatusColor(contest.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {contest.description || 'No description provided'}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<EmojiEvents />}
                      label={contest.scope}
                      size="small"
                      variant="outlined"
                    />
                    {contest.departmentName && (
                      <Chip
                        label={contest.departmentName}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Start: {new Date(contest.startTime).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    End: {new Date(contest.endTime).toLocaleString()}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      MCQ: {contest.mcqCount} | Code: {contest.codeCount}
                    </Typography>
                  </Box>

                  {contest.isApproved === false && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Rejected: {contest.approvalReason}
                    </Alert>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/contests/${contest.id}`)}
                  >
                    View Details
                  </Button>
                  {tabValue === 1 && contest.canApprove && (
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => navigate(`/contests/${contest.id}/approve`)}
                    >
                      Review
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
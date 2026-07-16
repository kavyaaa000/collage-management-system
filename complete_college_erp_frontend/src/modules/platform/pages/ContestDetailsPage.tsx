// src/pages/ContestDetailsPage.tsx - FIXED VERSION
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { 
  ArrowBack, 
  Edit, 
  PlayArrow,
  EmojiEvents,
  Code as CodeIcon,
  Quiz as QuizIcon,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { contestApi, ContestResponse } from '../api/contests';
import { mcqApi } from '../api/mcq';
import { codeApi } from '../api/code';
import { useAuth } from '../hooks/useAuth';

interface UserProgress {
  mcqAnswered: number;
  mcqTotal: number;
  mcqCorrect: number;
  mcqPoints: number;
  codeAttempted: number;
  codeTotal: number;
  codeSolved: number;
  codePoints: number;
  totalPoints: number;
  isCompleted: boolean;
}

export const ContestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [contest, setContest] = useState<ContestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mcqCount, setMcqCount] = useState(0);
  const [codeCount, setCodeCount] = useState(0);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const data = await contestApi.getById(Number(id));
        setContest(data);
        
        // Fetch actual question counts and user progress
        if (data.status === 'ACTIVE' || data.status === 'EXPIRED') {
          try {
            const [mcqs, codes] = await Promise.all([
              mcqApi.getQuestions(Number(id)),
              codeApi.getProblems(Number(id))
            ]);
            
            setMcqCount(mcqs.length);
            setCodeCount(codes.length);

            // Calculate user progress
            const mcqAnswered = mcqs.filter(q => q.userSelectedIndex !== null && q.userSelectedIndex !== undefined).length;
            const mcqCorrect = mcqs.filter(q => q.isCorrect === true).length;
            const mcqPoints = mcqs.filter(q => q.isCorrect === true).reduce((sum, q) => sum + q.points, 0);

            const codeAttempted = codes.filter(p => p.userBestScore > 0).length;
            const codeSolved = codes.filter(p => p.isSolved).length;
            const codePoints = codes.reduce((sum, p) => sum + p.userBestScore, 0);

            const totalPoints = mcqPoints + codePoints;
            const isCompleted = (mcqs.length === 0 || mcqAnswered === mcqs.length) && 
                               (codes.length === 0 || codeSolved === codes.length);

            setUserProgress({
              mcqAnswered,
              mcqTotal: mcqs.length,
              mcqCorrect,
              mcqPoints,
              codeAttempted,
              codeTotal: codes.length,
              codeSolved,
              codePoints,
              totalPoints,
              isCompleted
            });
          } catch (err) {
            console.error('Error fetching questions:', err);
          }
        }
        
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

  const handleStartContest = () => {
    if (!contest) return;
    navigate(`/contests/${contest.id}/participate`);
  };

  const handleViewProgress = () => {
    if (!contest) return;
    navigate(`/contests/${contest.id}/participate`);
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

  if (!contest) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Contest not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/contests')} sx={{ mt: 2 }}>
          Back to Contests
        </Button>
      </Container>
    );
  }

  const isActive = contest.status === 'ACTIVE';
  const hasStarted = new Date() >= new Date(contest.startTime);
  const hasEnded = new Date() >= new Date(contest.endTime);
  const canParticipate = isActive && hasStarted && !hasEnded && (mcqCount > 0 || codeCount > 0);
  const hasAttempted = userProgress && (userProgress.mcqAnswered > 0 || userProgress.codeAttempted > 0);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {contest.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={contest.status} 
                color={contest.status === 'ACTIVE' ? 'success' : 'default'} 
              />
              <Chip label={contest.scope} variant="outlined" />
              {contest.departmentName && <Chip label={contest.departmentName} variant="outlined" />}
              {hasEnded && <Chip label="Ended" color="error" />}
              {!hasStarted && <Chip label="Not Started" color="warning" />}
            </Box>
          </Box>

          {contest.canEdit && (
            <Button variant="outlined" startIcon={<Edit />}>
              Edit
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {contest.description || 'No description provided'}
            </Typography>
          </Grid>

          {/* User Progress Section */}
          {userProgress && hasAttempted && (
            <Grid item xs={12}>
              <Alert 
                severity={userProgress.isCompleted ? "success" : "info"} 
                icon={userProgress.isCompleted ? <CheckCircle /> : <EmojiEvents />}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {userProgress.isCompleted ? "🎉 Contest Completed!" : "Your Progress"}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {mcqCount > 0 && (
                    <Typography variant="body2">
                      MCQ: {userProgress.mcqCorrect}/{userProgress.mcqTotal} correct 
                      ({userProgress.mcqAnswered} answered) • {userProgress.mcqPoints} points
                    </Typography>
                  )}
                  {codeCount > 0 && (
                    <Typography variant="body2">
                      Code: {userProgress.codeSolved}/{userProgress.codeTotal} solved 
                      ({userProgress.codeAttempted} attempted) • {userProgress.codePoints} points
                    </Typography>
                  )}
                  <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                    Total Points Earned: {userProgress.totalPoints} 🪙
                  </Typography>
                </Box>
              </Alert>

              {/* Progress Bars */}
              {mcqCount > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">MCQ Progress</Typography>
                    <Typography variant="caption">
                      {Math.round((userProgress.mcqAnswered / userProgress.mcqTotal) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(userProgress.mcqAnswered / userProgress.mcqTotal) * 100}
                    color={userProgress.mcqAnswered === userProgress.mcqTotal ? "success" : "primary"}
                  />
                </Box>
              )}

              {codeCount > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Code Problems Progress</Typography>
                    <Typography variant="caption">
                      {Math.round((userProgress.codeSolved / userProgress.codeTotal) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(userProgress.codeSolved / userProgress.codeTotal) * 100}
                    color={userProgress.codeSolved === userProgress.codeTotal ? "success" : "primary"}
                  />
                </Box>
              )}
            </Grid>
          )}

          {/* Contest Stats Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <QuizIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">MCQ Questions</Typography>
                    </Box>
                    <Typography variant="h4">{mcqCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CodeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">Code Problems</Typography>
                    </Box>
                    <Typography variant="h4">{codeCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmojiEvents color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">Total Points</Typography>
                    </Box>
                    <Typography variant="h4">
                      {(mcqCount * 10) + (codeCount * 100)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Start Time
            </Typography>
            <Typography variant="body1">
              {new Date(contest.startTime).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              End Time
            </Typography>
            <Typography variant="body1">
              {new Date(contest.endTime).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Allowed Languages
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {contest.allowedLanguages.map((lang) => (
                <Chip key={lang} label={lang} size="small" />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Created By
            </Typography>
            <Typography variant="body1">
              {contest.createdByName}
            </Typography>
          </Grid>

          {contest.status === 'PENDING_APPROVAL' && contest.canApprove && (
            <Grid item xs={12}>
              <Alert severity="warning">
                This contest is pending approval
              </Alert>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate(`/contests/${contest.id}/approve`)}
              >
                Review Contest
              </Button>
            </Grid>
          )}

          {contest.isApproved === false && (
            <Grid item xs={12}>
              <Alert severity="error">
                <strong>Rejection Reason:</strong> {contest.approvalReason}
              </Alert>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons Section */}
        {canParticipate && (
          <Box sx={{ mt: 4 }}>
            {hasAttempted ? (
              <Button 
                variant="contained" 
                size="large" 
                fullWidth
                startIcon={<Visibility />}
                onClick={handleViewProgress}
                sx={{ py: 2 }}
                color="info"
              >
                View Progress & Continue
              </Button>
            ) : (
              <Button 
                variant="contained" 
                size="large" 
                fullWidth
                startIcon={<PlayArrow />}
                onClick={handleStartContest}
                sx={{ py: 2 }}
              >
                Start Contest
              </Button>
            )}
          </Box>
        )}

        {!hasStarted && contest.status === 'ACTIVE' && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              Contest has not started yet. Please wait until {new Date(contest.startTime).toLocaleString()}
            </Alert>
          </Box>
        )}

        {hasEnded && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="warning">
              This contest has ended. You can no longer participate.
            </Alert>
            {hasAttempted && (
              <Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handleViewProgress}
                sx={{ mt: 2 }}
              >
                View Your Results
              </Button>
            )}
          </Box>
        )}

        {contest.status !== 'ACTIVE' && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="info">
              This contest is currently {contest.status.toLowerCase().replace('_', ' ')}.
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
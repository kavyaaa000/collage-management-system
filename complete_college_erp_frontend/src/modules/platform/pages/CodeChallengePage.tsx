// src/pages/CodeChallengePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  TextField,
  MenuItem,
  LinearProgress,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Code as CodeIcon,
  CheckCircle,
  Cancel,
  Timer,
  Memory,
  ArrowBack,
} from '@mui/icons-material';
import { codeApi, CodeProblemResponse, CodeSubmissionRequest, CodeSubmissionResponse } from '../api/code';

const LANGUAGES = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const CodeChallengePage: React.FC = () => {
  const { contestId, problemId } = useParams<{ contestId: string; problemId: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<CodeProblemResponse | null>(null);
  const [submissions, setSubmissions] = useState<CodeSubmissionResponse[]>([]);
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('Python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchProblemAndSubmissions();
  }, [contestId, problemId]);

  const fetchProblemAndSubmissions = async () => {
    try {
      setLoading(true);
      const [problemData, submissionsData] = await Promise.all([
        codeApi.getProblemById(Number(contestId), Number(problemId)),
        codeApi.getUserSubmissions(Number(contestId)),
      ]);
      setProblem(problemData);
      setSubmissions(submissionsData.filter(s => s.problemId === Number(problemId)));
      setError('');
    } catch (err: any) {
      setError('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!sourceCode.trim()) {
      setError('Please enter your code');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const request: CodeSubmissionRequest = {
        problemId: Number(problemId),
        sourceCode,
        language,
      };
      await codeApi.submitCode(Number(contestId), request);
      
      // Refresh submissions after delay
      setTimeout(async () => {
        await fetchProblemAndSubmissions();
        setTabValue(1); // Switch to submissions tab
      }, 2000);
    } catch (err: any) {
  const message =
    err.response?.data?.error === "CODE_EXECUTION_UNAVAILABLE"
      ? "⚠️ Code execution server is not responding. Try again shortly."
      : err.response?.data?.error || "Failed to submit code.";

  setError(message);
}
 finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'WRONG_ANSWER':
        return 'error';
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return 'error';
      case 'TIME_LIMIT_EXCEEDED':
      case 'MEMORY_LIMIT_EXCEEDED':
        return 'warning';
      case 'PROCESSING':
      case 'PENDING':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle />;
      case 'WRONG_ANSWER':
      case 'COMPILATION_ERROR':
      case 'RUNTIME_ERROR':
        return <Cancel />;
      default:
        return <Timer />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>Loading problem...</Typography>
        </Box>
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 4 }}>Problem not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(`/contests/${contestId}`)} sx={{ mt: 2 }}>
          Back to Contest
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Button startIcon={<ArrowBack />} onClick={() => navigate(`/contests/${contestId}`)} sx={{ mb: 2 }}>
        Back to Contest
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel - Problem Description */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Typography variant="h5">{problem.title}</Typography>
              <Box>
                <Chip label={`${problem.points} pts`} color="primary" size="small" sx={{ mr: 1 }} />
                {problem.isSolved && <Chip icon={<CheckCircle />} label="Solved" color="success" size="small" />}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {problem.description}
            </Typography>

            {problem.inputFormat && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Input Format</Typography>
                <Typography variant="body2" paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {problem.inputFormat}
                </Typography>
              </>
            )}

            {problem.outputFormat && (
              <>
                <Typography variant="h6" gutterBottom>Output Format</Typography>
                <Typography variant="body2" paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {problem.outputFormat}
                </Typography>
              </>
            )}

            {problem.constraints && (
              <>
                <Typography variant="h6" gutterBottom>Constraints</Typography>
                <Typography variant="body2" paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {problem.constraints}
                </Typography>
              </>
            )}

            {problem.sampleInput && problem.sampleOutput && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Sample</Typography>
                <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Input:</Typography>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>{problem.sampleInput}</pre>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" gutterBottom>Output:</Typography>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>{problem.sampleOutput}</pre>
                </Paper>
              </>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Chip icon={<Timer />} label={`${problem.timeLimit}ms`} size="small" variant="outlined" />
              <Chip icon={<Memory />} label={`${Math.round(problem.memoryLimit / 1024)}MB`} size="small" variant="outlined" />
              <Chip label={`${problem.totalTestCases} test cases`} size="small" variant="outlined" />
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Code Editor & Submissions */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                <Tab label="Code Editor" />
                <Tab label="Submissions" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 340px)' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    size="small"
                    sx={{ minWidth: 150 }}
                  >
                    {LANGUAGES.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                    startIcon={<CodeIcon />}
                  >
                    {submitting ? 'Submitting...' : 'Submit Code'}
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={25}
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  placeholder="Write your code here..."
                  variant="outlined"
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-root': {
                      fontFamily: 'monospace',
                      fontSize: '14px',
                    },
                  }}
                />

                {problem.userBestScore > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your best score: {problem.userBestScore} / {problem.points} points
                  </Alert>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2, height: 'calc(100vh - 340px)', overflow: 'auto' }}>
                {submissions.length === 0 ? (
                  <Alert severity="info">No submissions yet</Alert>
                ) : (
                  submissions.map((submission) => (
                    <Card key={submission.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(submission.status)}
                            label={submission.status.replace(/_/g, ' ')}
                            color={getStatusColor(submission.status) as any}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Language: {submission.language}
                        </Typography>

                        {submission.passedTestCases !== undefined && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              Test Cases: {submission.passedTestCases} / {submission.totalTestCases} passed
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(submission.passedTestCases / (submission.totalTestCases || 1)) * 100}
                              color={submission.status === 'ACCEPTED' ? 'success' : 'error'}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        )}

                        <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Points: {submission.pointsEarned} / {problem.points}
                          </Typography>
                          {submission.executionTime && (
                            <Typography variant="caption" color="text.secondary">
                              Time: {submission.executionTime}ms
                            </Typography>
                          )}
                          {submission.memoryUsed && (
                            <Typography variant="caption" color="text.secondary">
                              Memory: {Math.round(submission.memoryUsed / 1024)}KB
                            </Typography>
                          )}
                        </Box>

                        {submission.stderr && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                              {submission.stderr}
                            </Typography>
                          </Alert>
                        )}

                        {submission.compilerOutput && (
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                              {submission.compilerOutput}
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
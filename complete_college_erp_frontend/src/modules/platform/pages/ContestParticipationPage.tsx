// src/pages/ContestParticipationPage.tsx - NEW UNIFIED CONTEST PAGE
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  RadioButtonUnchecked,
  Code as CodeIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';
import { contestApi } from '../api/contests';
import { mcqApi, MCQQuestionResponse } from '../api/mcq';
import { codeApi, CodeProblemResponse } from '../api/code';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const ContestParticipationPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  
  const [contest, setContest] = useState<any>(null);
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestionResponse[]>([]);
  const [codeProblems, setCodeProblems] = useState<CodeProblemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchContestData();
  }, [contestId]);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch contest details
      const contestData = await contestApi.getById(Number(contestId));
      setContest(contestData);

      // Fetch MCQ questions if any
      if (contestData.mcqCount > 0) {
        try {
          const mcqs = await mcqApi.getQuestions(Number(contestId));
          setMcqQuestions(mcqs);
        } catch (err) {
          console.error('Failed to load MCQ questions:', err);
        }
      }

      // Fetch code problems if any
      if (contestData.codeCount > 0) {
        try {
          const problems = await codeApi.getProblems(Number(contestId));
          setCodeProblems(problems);
        } catch (err) {
          console.error('Failed to load code problems:', err);
        }
      }

      // Auto-select first available tab
      if (contestData.mcqCount > 0) {
        setTabValue(0); // MCQ tab
      } else if (contestData.codeCount > 0) {
        setTabValue(1); // Code tab
      }

    } catch (err: any) {
      setError(err.response?.data || 'Failed to load contest');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMCQClick = (questionIndex: number) => {
    navigate(`/contests/${contestId}/mcq?question=${questionIndex}`);
  };

  const handleCodeProblemClick = (problemId: number) => {
    navigate(`/contests/${contestId}/code/${problemId}`);
  };

  const getMCQStatus = (question: MCQQuestionResponse) => {
    if (question.userSelectedIndex !== null && question.userSelectedIndex !== undefined) {
      return question.isCorrect ? 'correct' : 'incorrect';
    }
    return 'unanswered';
  };

  const getCodeStatus = (problem: CodeProblemResponse) => {
    if (problem.isSolved) return 'solved';
    if (problem.userBestScore > 0) return 'partial';
    return 'unattempted';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>
            Loading contest...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !contest) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Contest not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/contests')}
          sx={{ mt: 2 }}
        >
          Back to Contests
        </Button>
      </Container>
    );
  }

  const mcqAnswered = mcqQuestions.filter(
    q => q.userSelectedIndex !== null && q.userSelectedIndex !== undefined
  ).length;

  const codeAttempted = codeProblems.filter(p => p.userBestScore > 0).length;
  const codeSolved = codeProblems.filter(p => p.isSolved).length;

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/contests/${contest.id}`)}
        sx={{ mb: 2 }}
      >
        Back to Contest Details
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {contest.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={`MCQ: ${mcqAnswered}/${mcqQuestions.length}`}
            color={mcqAnswered === mcqQuestions.length ? 'success' : 'default'}
            icon={<QuizIcon />}
          />
          <Chip
            label={`Code: ${codeSolved}/${codeProblems.length} solved`}
            color={codeSolved === codeProblems.length ? 'success' : 'default'}
            icon={<CodeIcon />}
          />
        </Box>

        {mcqQuestions.length === 0 && codeProblems.length === 0 && (
          <Alert severity="warning">
            No questions available in this contest yet.
          </Alert>
        )}

        {(mcqQuestions.length > 0 || codeProblems.length > 0) && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                {mcqQuestions.length > 0 && (
                  <Tab
                    label={`MCQ Questions (${mcqQuestions.length})`}
                    icon={<QuizIcon />}
                    iconPosition="start"
                  />
                )}
                {codeProblems.length > 0 && (
                  <Tab
                    label={`Code Problems (${codeProblems.length})`}
                    icon={<CodeIcon />}
                    iconPosition="start"
                  />
                )}
              </Tabs>
            </Box>

            {/* MCQ Tab */}
            {mcqQuestions.length > 0 && (
              <TabPanel value={tabValue} index={0}>
                <List>
                  {mcqQuestions.map((question, index) => {
                    const status = getMCQStatus(question);
                    return (
                      <ListItem key={question.id} disablePadding>
                        <ListItemButton
                          onClick={() => handleMCQClick(index)}
                          sx={{
                            border: '1px solid',
                            borderColor:
                              status === 'correct'
                                ? 'success.main'
                                : status === 'incorrect'
                                ? 'error.main'
                                : 'divider',
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor:
                              status === 'correct'
                                ? 'success.lighter'
                                : status === 'incorrect'
                                ? 'error.lighter'
                                : 'background.paper',
                          }}
                        >
                          <ListItemIcon>
                            {status === 'correct' ? (
                              <CheckCircle color="success" />
                            ) : status === 'incorrect' ? (
                              <CheckCircle color="error" />
                            ) : (
                              <RadioButtonUnchecked />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`Question ${index + 1}`}
                            secondary={question.questionText.substring(0, 100) + '...'}
                          />
                          <Chip
                            label={`${question.points} pts`}
                            size="small"
                            color={status === 'correct' ? 'success' : 'default'}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>

                {mcqAnswered === mcqQuestions.length && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    ✅ All MCQ questions completed! 
                    {codeProblems.length > 0 && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setTabValue(1)}
                        sx={{ ml: 2 }}
                      >
                        Continue to Code Problems
                      </Button>
                    )}
                  </Alert>
                )}
              </TabPanel>
            )}

            {/* Code Problems Tab */}
            {codeProblems.length > 0 && (
              <TabPanel
                value={tabValue}
                index={mcqQuestions.length > 0 ? 1 : 0}
              >
                <List>
                  {codeProblems.map((problem, index) => {
                    const status = getCodeStatus(problem);
                    return (
                      <ListItem key={problem.id} disablePadding>
                        <ListItemButton
                          onClick={() => handleCodeProblemClick(problem.id)}
                          sx={{
                            border: '1px solid',
                            borderColor:
                              status === 'solved'
                                ? 'success.main'
                                : status === 'partial'
                                ? 'warning.main'
                                : 'divider',
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor:
                              status === 'solved'
                                ? 'success.lighter'
                                : status === 'partial'
                                ? 'warning.lighter'
                                : 'background.paper',
                          }}
                        >
                          <ListItemIcon>
                            <CodeIcon
                              color={
                                status === 'solved'
                                  ? 'success'
                                  : status === 'partial'
                                  ? 'warning'
                                  : 'inherit'
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${index + 1}. ${problem.title}`}
                            secondary={`${problem.description.substring(0, 100)}...`}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={`${problem.userBestScore}/${problem.points} pts`}
                              size="small"
                              color={
                                status === 'solved'
                                  ? 'success'
                                  : status === 'partial'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                            {problem.isSolved && (
                              <Chip
                                icon={<CheckCircle />}
                                label="Solved"
                                size="small"
                                color="success"
                              />
                            )}
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>

                {codeSolved === codeProblems.length && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    🎉 Congratulations! You've solved all code problems!
                  </Alert>
                )}
              </TabPanel>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};
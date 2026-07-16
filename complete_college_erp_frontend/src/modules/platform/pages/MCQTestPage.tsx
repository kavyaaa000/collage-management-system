// src/pages/MCQTestPage.tsx - UPDATED WITH CODE NAVIGATION
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CheckCircle, Cancel, ArrowBack, ArrowForward } from '@mui/icons-material';
import { mcqApi, MCQQuestionResponse, MCQSubmissionRequest } from '../api/mcq';
import { codeApi } from '../api/code';

export const MCQTestPage: React.FC = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [questions, setQuestions] = useState<MCQQuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [codeProblemsCount, setCodeProblemsCount] = useState(0);

  useEffect(() => {
    fetchQuestions();
    checkCodeProblems();
    
    // Set initial question from URL parameter
    const questionParam = searchParams.get('question');
    if (questionParam) {
      setCurrentIndex(parseInt(questionParam));
    }
  }, [contestId]);





// Key additions:



useEffect(() => {
  checkCodeProblems();
}, [contestId]);

const checkCodeProblems = async () => {
  try {
    const problems = await codeApi.getProblems(Number(contestId));
    setCodeProblemsCount(problems.length);
  } catch (err) {
    console.error('Failed to check code problems:', err);
  }
};

const handleFinishMCQ = () => {
  if (codeProblemsCount > 0) {
    navigate(`/contests/${contestId}/participate`);
  } else {
    navigate(`/contests/${contestId}`);
  }
};















  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await mcqApi.getQuestions(Number(contestId));
      setQuestions(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };



  const currentQuestion = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedOption === null) {
      setError('Please select an answer');
      return;
    }

    try {
      setSubmitting(true);
      const request: MCQSubmissionRequest = {
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedOption,
      };

      const result = await mcqApi.submitAnswer(Number(contestId), request);

      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = result;
      setQuestions(updatedQuestions);

      setSelectedOption(null);
      setError('');

      // Auto-advance after 1.5 seconds
      if (currentIndex < questions.length - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null);
      setError('');
    }
  };



  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography align="center" sx={{ mt: 2 }}>
            Loading questions...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container maxWidth="sm">
        <Alert severity="info" sx={{ mt: 4 }}>
          No questions available for this contest
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/contests/${contestId}`)}
          sx={{ mt: 2 }}
        >
          Back to Contest
        </Button>
      </Container>
    );
  }

  const isAnswered =
    currentQuestion.userSelectedIndex !== null &&
    currentQuestion.userSelectedIndex !== undefined;

  const answeredCount = questions.filter(
    (q) => q.userSelectedIndex !== null && q.userSelectedIndex !== undefined
  ).length;

  const allAnswered = answeredCount === questions.length;

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/contests/${contestId}/participate`)}
        sx={{ mb: 2 }}
      >
        Back to Contest
      </Button>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          MCQ Section - Question {currentIndex + 1} of {questions.length}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {currentQuestion.questionText}
        </Typography>

        {isAnswered && (
          <Chip
            icon={currentQuestion.isCorrect ? <CheckCircle /> : <Cancel />}
            label={currentQuestion.isCorrect ? 'Correct!' : 'Incorrect'}
            color={currentQuestion.isCorrect ? 'success' : 'error'}
            sx={{ mb: 2 }}
          />
        )}

        <FormControl fullWidth>
          <RadioGroup
            value={isAnswered ? currentQuestion.userSelectedIndex : selectedOption}
            onChange={(e) => !isAnswered && setSelectedOption(Number(e.target.value))}
          >
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio disabled={isAnswered} />}
                label={option}
                sx={{
                  mb: 1,
                  p: 1,
                  border: '1px solid',
                  borderColor:
                    isAnswered && currentQuestion.correctOptionIndex === index
                      ? 'success.main'
                      : isAnswered &&
                        currentQuestion.userSelectedIndex === index &&
                        !currentQuestion.isCorrect
                      ? 'error.main'
                      : 'divider',
                  borderRadius: 1,
                  backgroundColor:
                    isAnswered && currentQuestion.correctOptionIndex === index
                      ? 'success.lighter'
                      : isAnswered &&
                        currentQuestion.userSelectedIndex === index &&
                        !currentQuestion.isCorrect
                      ? 'error.lighter'
                      : 'transparent',
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          {!isAnswered ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={selectedOption === null || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          ) : currentIndex < questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleFinishMCQ}
            >
              {codeProblemsCount > 0 ? 'Continue to Code Problems' : 'Finish MCQ'}
            </Button>
          )}
        </Box>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <LinearProgress
          variant="determinate"
          value={(answeredCount / questions.length) * 100}
        />
        <Typography sx={{ mt: 1 }}>
          Answered: {answeredCount} / {questions.length}
        </Typography>

        {allAnswered && (
          <Alert severity="success" sx={{ mt: 2 }}>
            🎉 All MCQ questions completed!
            {codeProblemsCount > 0 && (
              <>
                <br />
                Click "Continue to Code Problems" to solve coding challenges.
              </>
            )}
          </Alert>
        )}
      </Box>
    </Container>
  );
};
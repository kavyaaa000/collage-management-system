// src/pages/CreateContestPage.tsx - WITH QUESTION BUILDING
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
  Alert,
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { contestApi, ContestRequest } from '../api/contests';
import { mcqApi, MCQQuestionRequest } from '../api/mcq';
import { codeApi, CodeProblemRequest, TestCaseRequest } from '../api/code';
import { useAuth } from '../hooks/useAuth';

const steps = ['Contest Details', 'MCQ Questions', 'Code Problems', 'Review'];
const LANGUAGES = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust'];

interface MCQQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

interface CodeProblem {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCaseRequest[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
}

export const CreateContestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdContestId, setCreatedContestId] = useState<number | null>(null);
  
  const [contestData, setContestData] = useState({
    title: '',
    description: '',
    scope: 'DEPT' as 'DEPT' | 'COLLEGE',
    departmentCode: user?.department || '',
    startTime: '',
    endTime: '',
    removeTime: '',
    mcqCount: 0,
    codeCount: 0,
    allowedLanguages: ['C', 'C++', 'Java', 'Python'],
  });

  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [codeProblems, setCodeProblems] = useState<CodeProblem[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setContestData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleInputChange('allowedLanguages', typeof value === 'string' ? value.split(',') : value);
  };

  const validateStep = (): boolean => {
    if (activeStep === 0) {
      if (!contestData.title || !contestData.startTime || !contestData.endTime || !contestData.removeTime) {
        setError('Please fill in all required fields');
        return false;
      }
      if (new Date(contestData.startTime) >= new Date(contestData.endTime)) {
        setError('End time must be after start time');
        return false;
      }
      if (new Date(contestData.endTime) >= new Date(contestData.removeTime)) {
        setError('Remove time must be after end time');
        return false;
      }
    }
    
    if (activeStep === 1 && contestData.mcqCount > 0 && mcqQuestions.length !== contestData.mcqCount) {
      setError(`Please add all ${contestData.mcqCount} MCQ questions`);
      return false;
    }
    
    if (activeStep === 2 && contestData.codeCount > 0 && codeProblems.length !== contestData.codeCount) {
      setError(`Please add all ${contestData.codeCount} code problems`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    
    // Create contest after step 0
    if (activeStep === 0 && createdContestId === null) {
      await createContest();
    }
    
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const createContest = async () => {
    setError('');
    setSubmitting(true);

    try {
      const request: ContestRequest = {
        title: contestData.title,
        description: contestData.description,
        scope: contestData.scope,
        departmentCode: contestData.scope === 'DEPT' ? contestData.departmentCode : undefined,
        startTime: contestData.startTime,
        endTime: contestData.endTime,
        removeTime: contestData.removeTime,
        mcqCount: contestData.mcqCount,
        codeCount: contestData.codeCount,
        allowedLanguages: contestData.allowedLanguages,
      };

      const response = await contestApi.create(request);
      setCreatedContestId(response.id);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create contest');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      // Add MCQ questions
      for (let i = 0; i < mcqQuestions.length; i++) {
        const mcq = mcqQuestions[i];
        const request: MCQQuestionRequest = {
          questionText: mcq.questionText,
          options: mcq.options,
          correctOptionIndex: mcq.correctOptionIndex,
          points: mcq.points,
          orderIndex: i,
        };
        await mcqApi.addQuestion(createdContestId!, request);
      }

      // Add code problems
      for (let i = 0; i < codeProblems.length; i++) {
        const code = codeProblems[i];
        const request: CodeProblemRequest = {
          title: code.title,
          description: code.description,
          inputFormat: code.inputFormat,
          outputFormat: code.outputFormat,
          constraints: code.constraints,
          sampleInput: code.sampleInput,
          sampleOutput: code.sampleOutput,
          testCases: code.testCases,
          points: code.points,
          timeLimit: code.timeLimit,
          memoryLimit: code.memoryLimit,
          orderIndex: i,
        };
        await codeApi.addProblem(createdContestId!, request);
      }

      navigate('/contests');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to add questions');
    } finally {
      setSubmitting(false);
    }
  };

  // MCQ Builder Functions
  const addMcqQuestion = () => {
    if (mcqQuestions.length < contestData.mcqCount) {
      setMcqQuestions([...mcqQuestions, {
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        points: 10,
      }]);
    }
  };

  const updateMcqQuestion = (index: number, field: keyof MCQQuestion, value: any) => {
    const updated = [...mcqQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setMcqQuestions(updated);
  };

  const updateMcqOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...mcqQuestions];
    const options = [...updated[qIndex].options];
    options[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options };
    setMcqQuestions(updated);
  };

  const deleteMcqQuestion = (index: number) => {
    setMcqQuestions(mcqQuestions.filter((_, i) => i !== index));
  };

  // Code Problem Builder Functions
  const addCodeProblem = () => {
    if (codeProblems.length < contestData.codeCount) {
      setCodeProblems([...codeProblems, {
        title: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        sampleInput: '',
        sampleOutput: '',
        testCases: [{ input: '', expectedOutput: '', isSample: false }],
        points: 100,
        timeLimit: 2000,
        memoryLimit: 256000,
      }]);
    }
  };

  const updateCodeProblem = (index: number, field: keyof CodeProblem, value: any) => {
    const updated = [...codeProblems];
    updated[index] = { ...updated[index], [field]: value };
    setCodeProblems(updated);
  };

  const addTestCase = (problemIndex: number) => {
    const updated = [...codeProblems];
    updated[problemIndex].testCases.push({ input: '', expectedOutput: '', isSample: false });
    setCodeProblems(updated);
  };

  const updateTestCase = (problemIndex: number, tcIndex: number, field: keyof TestCaseRequest, value: any) => {
    const updated = [...codeProblems];
    updated[problemIndex].testCases[tcIndex] = {
      ...updated[problemIndex].testCases[tcIndex],
      [field]: value,
    };
    setCodeProblems(updated);
  };

  const deleteCodeProblem = (index: number) => {
    setCodeProblems(codeProblems.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Create New Contest
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Step 0: Contest Details */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Contest Details</Typography>
            <TextField
              fullWidth
              label="Title *"
              margin="normal"
              value={contestData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={contestData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <TextField
              fullWidth
              select
              label="Scope *"
              margin="normal"
              value={contestData.scope}
              onChange={(e) => handleInputChange('scope', e.target.value)}
            >
              <MenuItem value="DEPT">Department</MenuItem>
              <MenuItem value="COLLEGE">College</MenuItem>
            </TextField>
            {contestData.scope === 'DEPT' && (
              <TextField
                fullWidth
                label="Department Code"
                margin="normal"
                value={contestData.departmentCode}
                onChange={(e) => handleInputChange('departmentCode', e.target.value)}
                helperText="Leave empty to use your department"
              />
            )}
            <TextField
              fullWidth
              label="Start Time *"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={contestData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
            />
            <TextField
              fullWidth
              label="End Time *"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={contestData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
            />
            <TextField
              fullWidth
              label="Remove Time *"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={contestData.removeTime}
              onChange={(e) => handleInputChange('removeTime', e.target.value)}
              helperText="Contest will be hidden after this time"
            />
            <TextField
              fullWidth
              label="MCQ Count"
              type="number"
              margin="normal"
              value={contestData.mcqCount}
              onChange={(e) => handleInputChange('mcqCount', parseInt(e.target.value) || 0)}
            />
            <TextField
              fullWidth
              label="Code Problems Count"
              type="number"
              margin="normal"
              value={contestData.codeCount}
              onChange={(e) => handleInputChange('codeCount', parseInt(e.target.value) || 0)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Allowed Languages</InputLabel>
              <Select
                multiple
                value={contestData.allowedLanguages}
                onChange={handleLanguageChange}
                input={<OutlinedInput label="Allowed Languages" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Step 1: MCQ Questions */}
        {activeStep === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                MCQ Questions ({mcqQuestions.length}/{contestData.mcqCount})
              </Typography>
              {mcqQuestions.length < contestData.mcqCount && (
                <Button variant="contained" startIcon={<Add />} onClick={addMcqQuestion}>
                  Add Question
                </Button>
              )}
            </Box>

            {mcqQuestions.map((mcq, qIndex) => (
              <Card key={qIndex} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Question {qIndex + 1}</Typography>
                    <IconButton color="error" onClick={() => deleteMcqQuestion(qIndex)}>
                      <Delete />
                    </IconButton>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="Question Text"
                    margin="normal"
                    multiline
                    rows={2}
                    value={mcq.questionText}
                    onChange={(e) => updateMcqQuestion(qIndex, 'questionText', e.target.value)}
                  />

                  {mcq.options.map((option, optIndex) => (
                    <TextField
                      key={optIndex}
                      fullWidth
                      label={`Option ${optIndex + 1}`}
                      margin="normal"
                      value={option}
                      onChange={(e) => updateMcqOption(qIndex, optIndex, e.target.value)}
                    />
                  ))}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Correct Answer:</Typography>
                    <RadioGroup
                      row
                      value={mcq.correctOptionIndex}
                      onChange={(e) => updateMcqQuestion(qIndex, 'correctOptionIndex', parseInt(e.target.value))}
                    >
                      {mcq.options.map((_, optIndex) => (
                        <FormControlLabel
                          key={optIndex}
                          value={optIndex}
                          control={<Radio />}
                          label={`Option ${optIndex + 1}`}
                        />
                      ))}
                    </RadioGroup>
                  </Box>

                  <TextField
                    label="Points"
                    type="number"
                    margin="normal"
                    value={mcq.points}
                    onChange={(e) => updateMcqQuestion(qIndex, 'points', parseInt(e.target.value) || 10)}
                    sx={{ width: 150 }}
                  />
                </CardContent>
              </Card>
            ))}

            {contestData.mcqCount === 0 && (
              <Alert severity="info">No MCQ questions needed for this contest</Alert>
            )}
          </Box>
        )}

        {/* Step 2: Code Problems */}
        {activeStep === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Code Problems ({codeProblems.length}/{contestData.codeCount})
              </Typography>
              {codeProblems.length < contestData.codeCount && (
                <Button variant="contained" startIcon={<Add />} onClick={addCodeProblem}>
                  Add Problem
                </Button>
              )}
            </Box>

            {codeProblems.map((problem, pIndex) => (
              <Card key={pIndex} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Problem {pIndex + 1}</Typography>
                    <IconButton color="error" onClick={() => deleteCodeProblem(pIndex)}>
                      <Delete />
                    </IconButton>
                  </Box>

                  <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    value={problem.title}
                    onChange={(e) => updateCodeProblem(pIndex, 'title', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    margin="normal"
                    multiline
                    rows={4}
                    value={problem.description}
                    onChange={(e) => updateCodeProblem(pIndex, 'description', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Sample Input"
                    margin="normal"
                    multiline
                    rows={2}
                    value={problem.sampleInput}
                    onChange={(e) => updateCodeProblem(pIndex, 'sampleInput', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Sample Output"
                    margin="normal"
                    multiline
                    rows={2}
                    value={problem.sampleOutput}
                    onChange={(e) => updateCodeProblem(pIndex, 'sampleOutput', e.target.value)}
                  />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Test Cases:</Typography>
                    {problem.testCases.map((tc, tcIndex) => (
                      <Box key={tcIndex} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <TextField
                          fullWidth
                          label="Input"
                          margin="normal"
                          multiline
                          rows={2}
                          value={tc.input}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, 'input', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          label="Expected Output"
                          margin="normal"
                          multiline
                          rows={2}
                          value={tc.expectedOutput}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, 'expectedOutput', e.target.value)}
                        />
                      </Box>
                    ))}
                    <Button onClick={() => addTestCase(pIndex)}>Add Test Case</Button>
                  </Box>

                  <TextField
                    label="Points"
                    type="number"
                    margin="normal"
                    value={problem.points}
                    onChange={(e) => updateCodeProblem(pIndex, 'points', parseInt(e.target.value) || 100)}
                    sx={{ width: 150, mr: 2 }}
                  />
                  <TextField
                    label="Time Limit (ms)"
                    type="number"
                    margin="normal"
                    value={problem.timeLimit}
                    onChange={(e) => updateCodeProblem(pIndex, 'timeLimit', parseInt(e.target.value) || 2000)}
                    sx={{ width: 150 }}
                  />
                </CardContent>
              </Card>
            ))}

            {contestData.codeCount === 0 && (
              <Alert severity="info">No code problems needed for this contest</Alert>
            )}
          </Box>
        )}

        {/* Step 3: Review */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Review & Submit</Typography>
            <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5', mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Title:</strong> {contestData.title}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Scope:</strong> {contestData.scope}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>MCQ Questions Added:</strong> {mcqQuestions.length}/{contestData.mcqCount}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Code Problems Added:</strong> {codeProblems.length}/{contestData.codeCount}
              </Typography>
              {contestData.scope === 'COLLEGE' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This contest requires approval from HOD/ADMIN before it becomes visible
                </Alert>
              )}
            </Paper>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : activeStep === steps.length - 1 ? 'Create Contest' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
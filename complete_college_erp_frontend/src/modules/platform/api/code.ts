// src/api/code.ts
import { http } from './http';

export interface TestCaseRequest {
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface CodeProblemRequest {
  title: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCases: TestCaseRequest[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
  orderIndex: number;
}

export interface CodeProblemResponse {
  id: number;
  contestId: number;
  title: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  points: number;
  timeLimit: number;
  memoryLimit: number;
  orderIndex: number;
  totalTestCases: number;
  userBestScore: number;
  isSolved: boolean;
}

export interface CodeSubmissionRequest {
  problemId: number;
  sourceCode: string;
  language: string;
}

export interface CodeSubmissionResponse {
  id: number;
  problemId: number;
  problemTitle: string;
  status: 'PENDING' | 'PROCESSING' | 'ACCEPTED' | 'WRONG_ANSWER' | 
          'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 
          'RUNTIME_ERROR' | 'COMPILATION_ERROR';
  passedTestCases?: number;
  totalTestCases?: number;
  executionTime?: number;
  memoryUsed?: number;
  compilerOutput?: string;
  stderr?: string;
  pointsEarned: number;
  submittedAt: string;
  language: string;
}

export const codeApi = {
  addProblem: async (contestId: number, data: CodeProblemRequest): Promise<CodeProblemResponse> => {
    const response = await http.post(`/api/contests/${contestId}/code/problems`, data);
    return response.data;
  },

  getProblems: async (contestId: number): Promise<CodeProblemResponse[]> => {
    const response = await http.get(`/api/contests/${contestId}/code/problems`);
    return response.data;
  },

  getProblemById: async (contestId: number, problemId: number): Promise<CodeProblemResponse> => {
    const response = await http.get(`/api/contests/${contestId}/code/problems/${problemId}`);
    return response.data;
  },

  submitCode: async (contestId: number, data: CodeSubmissionRequest): Promise<CodeSubmissionResponse> => {
    const response = await http.post(`/api/contests/${contestId}/code/submit`, data);
    return response.data;
  },

  getUserSubmissions: async (contestId: number): Promise<CodeSubmissionResponse[]> => {
    const response = await http.get(`/api/contests/${contestId}/code/submissions`);
    return response.data;
  },
};
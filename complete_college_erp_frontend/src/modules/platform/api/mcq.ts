import { http } from './http';

export interface MCQQuestionRequest {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  orderIndex: number;
}

export interface MCQQuestionResponse {
  id: number;
  contestId: number;
  questionText: string;
  options: string[];
  points: number;
  orderIndex: number;
  correctOptionIndex?: number;
  userSelectedIndex?: number;
  isCorrect?: boolean;
}

export interface MCQSubmissionRequest {
  questionId: number;
  selectedOptionIndex: number;
}

export const mcqApi = {
  addQuestion: async (
    contestId: number,
    data: MCQQuestionRequest
  ): Promise<MCQQuestionResponse> => {
    const response = await http.post(`/api/contests/${contestId}/mcq/questions`, data);
    return response.data;
  },

  getQuestions: async (
    contestId: number
  ): Promise<MCQQuestionResponse[]> => {
    const response = await http.get(`/api/contests/${contestId}/mcq/questions`);
    return response.data;
  },

  submitAnswer: async (
    contestId: number,
    data: MCQSubmissionRequest
  ): Promise<MCQQuestionResponse> => {
    const response = await http.post(`/api/contests/${contestId}/mcq/submit`, data);
    return response.data;
  },
};

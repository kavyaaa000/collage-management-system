import { http } from './http';

export interface ContestRequest {
  title: string;
  description: string;
  scope: 'DEPT' | 'COLLEGE';
  departmentCode?: string;
  startTime: string;
  endTime: string;
  removeTime: string;
  mcqCount: number;
  codeCount: number;
  allowedLanguages: string[];
}

export interface ContestResponse {
  id: number;
  title: string;
  description: string;
  scope: 'DEPT' | 'COLLEGE';
  departmentCode?: string;
  departmentName?: string;
  createdById: number;
  createdByName: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'EXPIRED' | 'REMOVED';
  startTime: string;
  endTime: string;
  removeTime: string;
  createdAt: string;
  updatedAt: string;
  mcqCount: number;
  codeCount: number;
  allowedLanguages: string[];
  canEdit: boolean;
  canApprove: boolean;
  isApproved?: boolean;
  approvalReason?: string;
}

export interface ApprovalRequest {
  approved: boolean;
  reason?: string;
}

export const contestApi = {
  create: async (data: ContestRequest): Promise<ContestResponse> => {
    const response = await http.post('/api/contests', data);
    return response.data;
  },

  getVisible: async (): Promise<ContestResponse[]> => {
    const response = await http.get('/api/contests/visible');
    return response.data;
  },

  getPending: async (): Promise<ContestResponse[]> => {
    const response = await http.get('/api/contests/pending');
    return response.data;
  },

  getById: async (id: number): Promise<ContestResponse> => {
    const response = await http.get(`/api/contests/${id}`);
    return response.data;
  },

  approve: async (id: number, data: ApprovalRequest): Promise<ContestResponse> => {
    const response = await http.put(`/api/contests/${id}/approve`, data);
    return response.data;
  },
};
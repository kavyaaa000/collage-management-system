export type Role = 'STUDENT' | 'STAFF' | 'HOD' | 'COE' | 'ADMIN';

export interface User {
  userId: number;
  name: string;
  email?: string;
  role: Role;
  department: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  departmentCode: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  role: Role;
  department: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
}



// Add to existing types:

export interface Contest {
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

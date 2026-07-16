// import axios from "axios";
// import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";


// export const API_BASE_URL = 'http://localhost:8080/api/ad';


// export interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data: T;
//   timestamp: string;
// }

// export interface ErrorResponse {
//   timestamp: string;
//   status: number;
//   error: string;
//   message: string;
//   path: string;
// }

// class ApiService {
//   private api: AxiosInstance;

//   constructor() {
//     this.api = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Request interceptor
//     this.api.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor
//     this.api.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError<ErrorResponse>) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           window.location.href = '/login';
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Auth endpoints
//   async login(email: string, password: string) {
//     const response = await this.api.post<ApiResponse<LoginResponse>>('/auth/login', {
//       email,
//       password,
//     });
//     return response.data;
//   }

//   async register(data: RegisterRequest) {
//     const response = await this.api.post<ApiResponse<UserDTO>>('/auth/register', data);
//     return response.data;
//   }

//   async getRegistrationStatus() {
//     const response = await this.api.get<ApiResponse<string>>('/auth/registration-status');
//     return response.data;
//   }

//   // Student endpoints
//   async getStudentDashboard() {
//     const response = await this.api.get<ApiResponse<StudentDashboardDTO>>('/students/dashboard');
//     return response.data;
//   }

//   async getStudentProfile() {
//     const response = await this.api.get<ApiResponse<StudentProfileDTO>>('/students/profile');
//     return response.data;
//   }




// async getStudentDocuments(studentProfileId: number) {
//   const response = await this.api.get<ApiResponse<StudentDocumentDTO[]>>(
//     `/staff/students/${studentProfileId}/documents`
//   );
//   return response.data;
// }







//   async updateStudentProfile(data: UpdateStudentProfileRequest) {
//     const response = await this.api.put<ApiResponse<StudentProfileDTO>>('/students/profile', data);
//     return response.data;
//   }

//   async updateMarks(data: UpdateMarksRequest) {
//     const response = await this.api.put<ApiResponse<StudentMarksDTO>>('/students/marks', data);
//     return response.data;
//   }

//   async getActiveDepartments() {
//     const response = await this.api.get<ApiResponse<DepartmentDTO[]>>('/students/departments');
//     return response.data;
//   }

//   async updatePreferences(data: UpdatePreferencesRequest) {
//     const response = await this.api.put<ApiResponse<StudentPreferenceDTO[]>>(
//       '/students/preferences',
//       data
//     );
//     return response.data;
//   }

//   async getMyDocuments() {
//     const response = await this.api.get<ApiResponse<StudentDocumentDTO[]>>('/students/documents');
//     return response.data;
//   }

//   async uploadDocument(file: File, documentType: string) {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('documentType', documentType);

//     const response = await this.api.post<ApiResponse<StudentDocumentDTO>>(
//       '/students/documents/upload',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     return response.data;
//   }

//   async submitRegistration() {
//     const response = await this.api.post<ApiResponse<void>>('/students/submit');
//     return response.data;
//   }

//   // Staff endpoints
//   async getStaffDashboard() {
//     const response = await this.api.get<ApiResponse<StaffDashboardDTO>>('/staff/dashboard');
//     return response.data;
//   }

//   async getAssignedStudents() {
//     const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>('/staff/students');
//     return response.data;
//   }

//   async getPendingVerifications() {
//     const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>('/staff/students/pending');
//     return response.data;
//   }

//   async verifyStudent(studentProfileId: number) {
//     const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
//       `/staff/verify/${studentProfileId}`
//     );
//     return response.data;
//   }

//  async requestCorrection(studentProfileId: number, remarks: string) {
//   const requestBody = {
//     action: "REQUEST_CORRECTION",
//     remarks: remarks
//   };

//   const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
//     `/staff/request-correction/${studentProfileId}`,
//     requestBody
//   );
//   return response.data;
// }



//   // Admin endpoints
//   async getAdminDashboard() {
//     const response = await this.api.get<ApiResponse<AdminDashboardDTO>>('/admin/dashboard');
//     return response.data;
//   }

//   async toggleRegistrationWindow() {
//     const response = await this.api.post<ApiResponse<string>>('/admin/registration/toggle');
//     return response.data;
//   }

//   async getAllStaff() {
//     const response = await this.api.get<ApiResponse<UserDTO[]>>('/admin/staff');
//     return response.data;
//   }

//   async createStaff(data: CreateStaffRequest) {
//     const response = await this.api.post<ApiResponse<UserDTO>>('/admin/staff', data);
//     return response.data;
//   }

//   async deleteStaff(staffId: number) {
//     const response = await this.api.delete<ApiResponse<void>>(`/admin/staff/${staffId}`);
//     return response.data;
//   }

//   async getAllDepartments() {
//     const response = await this.api.get<ApiResponse<DepartmentDTO[]>>('/admin/departments');
//     return response.data;
//   }

//   async createDepartment(data: CreateDepartmentRequest) {
//     const response = await this.api.post<ApiResponse<DepartmentDTO>>('/admin/departments', data);
//     return response.data;
//   }

//   async updateDepartment(id: number, data: UpdateDepartmentRequest) {
//     const response = await this.api.put<ApiResponse<DepartmentDTO>>(
//       `/admin/departments/${id}`,
//       data
//     );
//     return response.data;
//   }

//   async deleteDepartment(id: number) {
//     const response = await this.api.delete<ApiResponse<void>>(`/admin/departments/${id}`);
//     return response.data;
//   }

//   async assignMentorsRandomly() {
//     const response = await this.api.post<ApiResponse<void>>('/admin/assign-mentors/random');
//     return response.data;
//   }

//   async reassignMentor(data: AssignMentorRequest) {
//     const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
//       '/admin/assign-mentor',
//       data
//     );
//     return response.data;
//   }

//   async runAdmissionProcess() {
//     const response = await this.api.post<ApiResponse<string>>('/admin/admissions/run');
//     return response.data;
//   }

//   async notifyStudents() {
//     const response = await this.api.post<ApiResponse<string>>('/admin/admissions/notify');
//     return response.data;
//   }

//   async getAdmissionResults() {
//     const response = await this.api.get<ApiResponse<AdmissionResultDTO[]>>(
//       '/admin/admissions/results'
//     );
//     return response.data;
//   }

//   async getAdmissionStatistics() {
//     const response = await this.api.get<ApiResponse<Record<string, any>>>(
//       '/admin/admissions/statistics'
//     );
//     return response.data;
//   }

//   async getAllStudents() {
//     const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>('/admin/students');
//     return response.data;
//   }

//   async getStudentById(id: number) {
//     const response = await this.api.get<ApiResponse<StudentProfileDTO>>(`/admin/students/${id}`);
//     return response.data;
//   }

//   // Public endpoints
//   async respondToOffer(token: string, response: 'ACCEPT' | 'DECLINE') {
//     const res = await this.api.post<ApiResponse<string>>(
//       `/public/offer/respond?token=${token}&response=${response}`
//     );
//     return res.data;
//   }

//   // Document viewing
//   getDocumentViewUrl(documentId: number): string {
//     return `${API_BASE_URL}/documents/${documentId}/view`;
//   }

//   getDocumentDownloadUrl(documentId: number): string {
//     return `${API_BASE_URL}/documents/${documentId}/download`;
//   }
// }

// // Type definitions
// export interface LoginResponse {
//   token: string;
//   type: string;
//   userId: number;
//   email: string;
//   fullName: string;
//   role: string;
// }

// export interface RegisterRequest {
//   email: string;
//   password: string;
//   fullName: string;
//   role: string;
// }

// export interface UserDTO {
//   id: number;
//   email: string;
//   fullName: string;
//   role: string;
//   isActive: boolean;
//   createdAt: string;
// }

// export interface StudentProfileDTO {
//   id: number;
//   userId: number;
//   applicationNumber: string;
//   email: string;
//   fullName: string;
//   phone?: string;
//   dateOfBirth?: string;
//   gender?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   stream?: string;
//   cutoffScore?: number;
//   verificationStatus: string;
//   verificationRemarks?: string;
//   registrationStatus: string;
//   studentGroupNumber?: number;
//   assignedMentorId?: number;
//   assignedMentorName?: string;
//   createdAt: string;
// }

// export interface UpdateStudentProfileRequest {
//   phone: string;
//   dateOfBirth: string;
//   gender: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   stream: string;
// }

// export interface StudentMarksDTO {
//   id: number;
//   studentProfileId: number;
//   physicsMarks: number;
//   chemistryMarks: number;
//   mathsMarks?: number;
//   computerScienceMarks?: number;
// }

// export interface UpdateMarksRequest {
//   physicsMarks: number;
//   chemistryMarks: number;
//   mathsMarks?: number;
//   computerScienceMarks?: number;
// }

// export interface DepartmentDTO {
//   id: number;
//   code: string;
//   name: string;
//   totalSeats: number;
//   availableSeats: number;
//   isActive: boolean;
//   createdAt: string;
// }

// export interface StudentPreferenceDTO {
//   id: number;
//   departmentId: number;
//   departmentCode: string;
//   departmentName: string;
//   preferenceOrder: number;
// }

// export interface UpdatePreferencesRequest {
//   preferences: Array<{
//     departmentId: number;
//     preferenceOrder: number;
//   }>;
// }

// export interface StudentDocumentDTO {
//   id: number;
//   studentProfileId: number;
//   documentType: string;
//   originalFilename: string;
//   storedFilename: string;
//   fileSize: number;
//   mimeType: string;
//   uploadedAt: string;
//   viewUrl: string;
// }

// export interface StudentDashboardDTO {
//   profile: StudentProfileDTO;
//   marks?: StudentMarksDTO;
//   preferences: StudentPreferenceDTO[];
//   documents: StudentDocumentDTO[];
//   admissionResult?: AdmissionResultDTO;
//   registrationWindowStatus: string;
// }

// export interface StaffDashboardDTO {
//   totalAssignedStudents: number;
//   pendingVerification: number;
//   verified: number;
//   correctionRequested: number;
//   assignedStudents: StudentProfileDTO[];
// }

// export interface AdminDashboardDTO {
//   totalStudents: number;
//   pendingVerification: number;
//   verified: number;
//   correctionRequested: number;
//   totalDepartments: number;
//   totalSeatsAvailable: number;
//   allottedStudents: number;
//   notAllottedStudents: number;
//   acceptedOffers: number;
//   declinedOffers: number;
//   registrationWindowStatus: string;
//   admissionProcessStatus: string;
// }

// export interface AdmissionResultDTO {
//   id: number;
//   studentProfileId: number;
//   studentName: string;
//   applicationNumber: string;
//   cutoffScore: number;
//   allocatedDepartmentId?: number;
//   allocatedDepartmentCode?: string;
//   allocatedDepartmentName?: string;
//   allocationStatus: string;
//   offerStatus: string;
//   notificationSent: boolean;
//   allocatedAt?: string;
//   offerResponseAt?: string;
// }

// export interface CreateStaffRequest {
//   email: string;
//   password: string;
//   fullName: string;
// }

// export interface CreateDepartmentRequest {
//   code: string;
//   name: string;
//   totalSeats: number;
// }

// export interface UpdateDepartmentRequest {
//   name: string;
//   totalSeats: number;
//   isActive?: boolean;
// }

// export interface AssignMentorRequest {
//   studentProfileId: number;
//   mentorId: number;
// }

// export default new ApiService();


// src/modules/admissions/services/api.ts
// ─────────────────────────────────────────────────────────────────
// ALL admission-module API calls go to /api/ad/**
// The integrated ERP backend runs on port 8080.
// ─────────────────────────────────────────────────────────────────
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";

export const API_BASE_URL = "http://localhost:8080/api/ad";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ── Request interceptor: attach JWT token ──
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ── Response interceptor: handle 401 ──
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Redirect to admissions login (with /admissions prefix since this
          // module is mounted at /admissions/* in the global router)
          window.location.href = "/admissions/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // ──────────────────────────────────────────────────────────────
  // AUTH  →  /api/ad/auth/**
  // ──────────────────────────────────────────────────────────────
  async login(email: string, password: string) {
    const response = await this.api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      { email, password }
    );
    return response.data;
  }

  async register(data: RegisterRequest) {
    const response = await this.api.post<ApiResponse<UserDTO>>(
      "/auth/register",
      data
    );
    return response.data;
  }

  async getRegistrationStatus() {
    const response = await this.api.get<ApiResponse<string>>(
      "/auth/registration-status"
    );
    return response.data;
  }

  // ──────────────────────────────────────────────────────────────
  // STUDENT  →  /api/ad/students/**
  // ──────────────────────────────────────────────────────────────
  async getStudentDashboard() {
    const response = await this.api.get<ApiResponse<StudentDashboardDTO>>(
      "/students/dashboard"
    );
    return response.data;
  }

  async getStudentProfile() {
    const response = await this.api.get<ApiResponse<StudentProfileDTO>>(
      "/students/profile"
    );
    return response.data;
  }

  async updateStudentProfile(data: UpdateStudentProfileRequest) {
    const response = await this.api.put<ApiResponse<StudentProfileDTO>>(
      "/students/profile",
      data
    );
    return response.data;
  }

  async updateMarks(data: UpdateMarksRequest) {
    const response = await this.api.put<ApiResponse<StudentMarksDTO>>(
      "/students/marks",
      data
    );
    return response.data;
  }

  async getActiveDepartments() {
    const response = await this.api.get<ApiResponse<DepartmentDTO[]>>(
      "/students/departments"
    );
    return response.data;
  }

  async updatePreferences(data: UpdatePreferencesRequest) {
    const response = await this.api.put<ApiResponse<StudentPreferenceDTO[]>>(
      "/students/preferences",
      data
    );
    return response.data;
  }

  async getMyDocuments() {
    const response = await this.api.get<ApiResponse<StudentDocumentDTO[]>>(
      "/students/documents"
    );
    return response.data;
  }

  async uploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const response = await this.api.post<ApiResponse<StudentDocumentDTO>>(
      "/students/documents/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  }

  async submitRegistration() {
    const response = await this.api.post<ApiResponse<void>>("/students/submit");
    return response.data;
  }

  // ──────────────────────────────────────────────────────────────
  // STAFF  →  /api/ad/staff/**
  // ──────────────────────────────────────────────────────────────
  async getStaffDashboard() {
    const response = await this.api.get<ApiResponse<StaffDashboardDTO>>(
      "/staff/dashboard"
    );
    return response.data;
  }

  async getAssignedStudents() {
    const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>(
      "/staff/students"
    );
    return response.data;
  }

  async getPendingVerifications() {
    const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>(
      "/staff/students/pending"
    );
    return response.data;
  }

  async verifyStudent(studentProfileId: number) {
    const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
      `/staff/verify/${studentProfileId}`
    );
    return response.data;
  }

  async requestCorrection(studentProfileId: number, remarks: string) {
    const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
      `/staff/request-correction/${studentProfileId}`,
      { action: "REQUEST_CORRECTION", remarks }
    );
    return response.data;
  }

  async getStudentDocuments(studentProfileId: number) {
    const response = await this.api.get<ApiResponse<StudentDocumentDTO[]>>(
      `/staff/students/${studentProfileId}/documents`
    );
    return response.data;
  }

  // ──────────────────────────────────────────────────────────────
  // ADMIN  →  /api/ad/admin/**
  // ──────────────────────────────────────────────────────────────
  async getAdminDashboard() {
    const response = await this.api.get<ApiResponse<AdminDashboardDTO>>(
      "/admin/dashboard"
    );
    return response.data;
  }

  async toggleRegistrationWindow() {
    const response = await this.api.post<ApiResponse<string>>(
      "/admin/registration/toggle"
    );
    return response.data;
  }

  async getAllStaff() {
    const response = await this.api.get<ApiResponse<UserDTO[]>>("/admin/staff");
    return response.data;
  }

  async createStaff(data: CreateStaffRequest) {
    const response = await this.api.post<ApiResponse<UserDTO>>(
      "/admin/staff",
      data
    );
    return response.data;
  }

  async deleteStaff(staffId: number) {
    const response = await this.api.delete<ApiResponse<void>>(
      `/admin/staff/${staffId}`
    );
    return response.data;
  }

  async getAllDepartments() {
    const response = await this.api.get<ApiResponse<DepartmentDTO[]>>(
      "/admin/departments"
    );
    return response.data;
  }

  async createDepartment(data: CreateDepartmentRequest) {
    const response = await this.api.post<ApiResponse<DepartmentDTO>>(
      "/admin/departments",
      data
    );
    return response.data;
  }

  async updateDepartment(id: number, data: UpdateDepartmentRequest) {
    const response = await this.api.put<ApiResponse<DepartmentDTO>>(
      `/admin/departments/${id}`,
      data
    );
    return response.data;
  }

  async deleteDepartment(id: number) {
    const response = await this.api.delete<ApiResponse<void>>(
      `/admin/departments/${id}`
    );
    return response.data;
  }

  async assignMentorsRandomly() {
    const response = await this.api.post<ApiResponse<void>>(
      "/admin/assign-mentors/random"
    );
    return response.data;
  }

  async reassignMentor(data: AssignMentorRequest) {
    const response = await this.api.post<ApiResponse<StudentProfileDTO>>(
      "/admin/assign-mentor",
      data
    );
    return response.data;
  }

  async runAdmissionProcess() {
    const response = await this.api.post<ApiResponse<string>>(
      "/admin/admissions/run"
    );
    return response.data;
  }

  async notifyStudents() {
    const response = await this.api.post<ApiResponse<string>>(
      "/admin/admissions/notify"
    );
    return response.data;
  }

  async getAdmissionResults() {
    const response = await this.api.get<ApiResponse<AdmissionResultDTO[]>>(
      "/admin/admissions/results"
    );
    return response.data;
  }

  async getAdmissionStatistics() {
    const response = await this.api.get<ApiResponse<Record<string, any>>>(
      "/admin/admissions/statistics"
    );
    return response.data;
  }

  async getAllStudents() {
    const response = await this.api.get<ApiResponse<StudentProfileDTO[]>>(
      "/admin/students"
    );
    return response.data;
  }

  async getStudentById(id: number) {
    const response = await this.api.get<ApiResponse<StudentProfileDTO>>(
      `/admin/students/${id}`
    );
    return response.data;
  }

  // ──────────────────────────────────────────────────────────────
  // PUBLIC  →  /api/ad/public/**   (no auth required)
  // ──────────────────────────────────────────────────────────────
  async respondToOffer(token: string, response: "ACCEPT" | "DECLINE") {
    const res = await this.api.post<ApiResponse<string>>(
      `/public/offer/respond?token=${token}&response=${response}`
    );
    return res.data;
  }

  // ──────────────────────────────────────────────────────────────
  // DOCUMENT URLS  →  /api/ad/documents/**
  // ──────────────────────────────────────────────────────────────
  getDocumentViewUrl(documentId: number): string {
    return `${API_BASE_URL}/documents/${documentId}/view`;
  }

  getDocumentDownloadUrl(documentId: number): string {
    return `${API_BASE_URL}/documents/${documentId}/download`;
  }
}

// ──────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentProfileDTO {
  id: number;
  userId: number;
  applicationNumber: string;
  email: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  stream?: string;
  cutoffScore?: number;
  verificationStatus: string;
  verificationRemarks?: string;
  registrationStatus: string;
  studentGroupNumber?: number;
  assignedMentorId?: number;
  assignedMentorName?: string;
  createdAt: string;
}

export interface UpdateStudentProfileRequest {
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  stream: string;
}

export interface StudentMarksDTO {
  id: number;
  studentProfileId: number;
  physicsMarks: number;
  chemistryMarks: number;
  mathsMarks?: number;
  computerScienceMarks?: number;
}

export interface UpdateMarksRequest {
  physicsMarks: number;
  chemistryMarks: number;
  mathsMarks?: number;
  computerScienceMarks?: number;
}

export interface DepartmentDTO {
  id: number;
  code: string;
  name: string;
  totalSeats: number;
  availableSeats: number;
  isActive: boolean;
  createdAt: string;
}

export interface StudentPreferenceDTO {
  id: number;
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  preferenceOrder: number;
}

export interface UpdatePreferencesRequest {
  preferences: Array<{
    departmentId: number;
    preferenceOrder: number;
  }>;
}

export interface StudentDocumentDTO {
  id: number;
  studentProfileId: number;
  documentType: string;
  originalFilename: string;
  storedFilename: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  viewUrl: string;
}

export interface StudentDashboardDTO {
  profile: StudentProfileDTO;
  marks?: StudentMarksDTO;
  preferences: StudentPreferenceDTO[];
  documents: StudentDocumentDTO[];
  admissionResult?: AdmissionResultDTO;
  registrationWindowStatus: string;
}

export interface StaffDashboardDTO {
  totalAssignedStudents: number;
  pendingVerification: number;
  verified: number;
  correctionRequested: number;
  assignedStudents: StudentProfileDTO[];
}

export interface AdminDashboardDTO {
  totalStudents: number;
  pendingVerification: number;
  verified: number;
  correctionRequested: number;
  totalDepartments: number;
  totalSeatsAvailable: number;
  allottedStudents: number;
  notAllottedStudents: number;
  acceptedOffers: number;
  declinedOffers: number;
  registrationWindowStatus: string;
  admissionProcessStatus: string;
}

export interface AdmissionResultDTO {
  id: number;
  studentProfileId: number;
  studentName: string;
  applicationNumber: string;
  cutoffScore: number;
  allocatedDepartmentId?: number;
  allocatedDepartmentCode?: string;
  allocatedDepartmentName?: string;
  allocationStatus: string;
  offerStatus: string;
  notificationSent: boolean;
  allocatedAt?: string;
  offerResponseAt?: string;
}

export interface CreateStaffRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  totalSeats: number;
}

export interface UpdateDepartmentRequest {
  name: string;
  totalSeats: number;
  isActive?: boolean;
}

export interface AssignMentorRequest {
  studentProfileId: number;
  mentorId: number;
}

export default new ApiService();
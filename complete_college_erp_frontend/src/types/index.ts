// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userType: 'STAFF' | 'STUDENT' | 'ADMIN' | 'HOD';
  userId: number;
  referenceId: number;
  name: string;
  email?: string;
  semesterId?: number;
  sectionId?: number;
  departmentId?: number;
}

export interface AuthUser {
  userId: number;
  username: string;
  userType: 'STAFF' | 'STUDENT' | 'ADMIN';
  referenceId: number;
  name: string;
  email?: string;
  semesterId?: number;
  sectionId?: number;
  departmentId?: number;
  token: string;
}

// Entity Types
export interface Student {
  studentId: number;
  registerNumber: string;
  studentName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  departmentId?: number;
  currentSemesterId?: number;
  sectionId?: number;
  admissionYear?: number;
  currentCgpa?: number;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface Staff {
  staffId: number;
  staffCode: string;
  staffName: string;
  email?: string;
  phoneNumber?: string;
  designation?: string;
  departmentId?: number;
  isActive?: boolean;
}

export interface Subject {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  semesterId?: number;
  credits?: number;
  subjectType?: string;
}

export interface Timetable {
  timetableId: number;
  sessionId: number;
  semesterId: number;
  sectionId: number;
  dayOfWeek: string;
  periodNumber: number;
  subjectId?: number;
  staffId?: number;
  roomNumber?: string;
  createdAt?: string;
}

// Attendance Types
export interface AttendanceSession {
  sessionId: number;
  timetableId: number;
  attendanceDate: string;
  semesterId: number;
  semesterName?: string;
  sectionId: number;
  sectionName?: string;
  subjectId: number;
  subjectCode?: string;
  subjectName?: string;
  staffId: number;
  staffName?: string;
  periodNumber: number;
  status: 'OPEN' | 'SUBMITTED' | 'LOCKED';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage?: number;
  createdAt?: string;
  submittedAt?: string;
}

export interface AttendanceRecord {
  recordId: number;
  sessionId: number;
  studentId: number;
  status: 'PRESENT' | 'ABSENT' | 'ON_DUTY' | 'MEDICAL_LEAVE';
  remarks?: string;
  markedAt: string;
  markedBy: number;
  modifiedAt?: string;
  modifiedBy?: number;
}

export interface SubjectAttendance {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  eligibilityStatus: string;
  classesNeededFor75: number;
}

export interface StudentAttendanceResponse {
  studentId: number;
  registerNumber: string;
  studentName: string;
  semesterId: number;
  semesterName?: string;
  subjectWiseAttendance: SubjectAttendance[];
  totalClassesConducted: number;
  totalClassesAttended: number;
  overallAttendancePercentage: number;
  eligibilityStatus: string;
}

// Notification Types
export interface Notification {
  notificationId: number;
  senderName: string;
  title: string;
  message: string;
  notificationType: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface SendNotificationRequest {
  senderId: number;
  recipientType: 'STUDENT' | 'ALL_STUDENTS' | 'SECTION' | 'SEMESTER';
  recipientId?: number;
  title: string;
  message: string;
  notificationType?: string;
  priority?: string;
}

// Performance Types
export interface SubjectAttendanceDetail {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  eligibilityStatus: string;
  classesNeededFor75: number;
}

export interface SubjectPerformanceDetail {
  subjectCode: string;
  subjectName: string;
  internal1: number;
  internal2: number;
  internal3: number;
  average: number;
  trend: string;
}

export interface AlertInfo {
  alertType: string;
  severity: string;
  message: string;
  createdAt: string;
}

export interface StudentDetailedPerformance {
  studentId: number;
  registerNumber: string;
  studentName: string;
  email?: string;
  semesterNo?: number;
  overallAttendance: number;
  attendanceTrend: string;
  subjectWiseAttendance: SubjectAttendanceDetail[];
  overallAverageMarks: number;
  performanceTrend: string;
  subjectWisePerformance: SubjectPerformanceDetail[];
  riskLevel: string;
  atRiskSubjects: number;
  recommendations: string[];
  actionRequired: boolean;
  predictedFinalAttendance: number;
  predictedFinalMarks: number;
  activeAlerts: AlertInfo[];
}

// Dashboard Types
export interface StaffStats {
  totalClasses: number;
  completedClasses: number;
  pendingClasses: number;
  averageAttendance: number;
}

export interface StudentStats {
  overallAttendance: number;
  averageMarks: number;
  totalSubjects: number;
  subjectsAtRisk: number;
  performanceCategory: string;
}

export interface TodaySchedule {
  periodNumber: number;
  subjectName: string;
  staffName: string;
  roomNumber: string;
  status: string;
  sessionId?: number;
}

export interface AtRiskStudent {
  studentId: number;
  studentName: string;
  registerNumber: string;
  attendance: number;
  averageMarks: number;
  riskLevel: string;
}

export interface DashboardStatsResponse {
  staffStats?: StaffStats;
  studentStats?: StudentStats;
  todaySchedule?: TodaySchedule[];
  atRiskStudents?: AtRiskStudent[];
}

export interface AtRiskStudentResponse {
  studentId: number;
  registerNumber: string;
  studentName: string;
  semesterNo?: number;
  avgAttendance: number;
  minSubjectAttendance?: number;
  subjectsAtRiskAttendance?: number;
  avgMarks: number;
  failingSubjects?: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendations?: string[];
}

// Request Types
export interface CreateSessionRequest {
  timetableId: number;
  attendanceDate: string;
  academicSessionId: number;
  createdBy: number;
}

export interface MarkAttendanceRequest {
  sessionId: number;
  studentId: number;
  status: 'PRESENT' | 'ABSENT' | 'ON_DUTY' | 'MEDICAL_LEAVE';
  remarks?: string;
  markedBy: number;
}

export interface StudentAttendanceData {
  studentId: number;
  status: 'PRESENT' | 'ABSENT' | 'ON_DUTY' | 'MEDICAL_LEAVE';
  remarks?: string;
}

export interface BulkAttendanceRequest {
  sessionId: number;
  attendanceList: StudentAttendanceData[];
  markedBy: number;
}
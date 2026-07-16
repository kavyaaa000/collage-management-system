// Class Types
export interface ClassInfo {
  classId: number;
  className: string;
  departmentId: number;
  semesterId: number;
  semesterNo?: number;
  sectionId: number;
  academicYear?: string;
  classTeacherId?: number;
  classTeacherName?: string;
  totalStudents: number;
  averageAttendance?: number;
  averageMarks?: number;
  studentsAbove75Attendance?: number;
  studentsBelow75Attendance?: number;
}

export interface SubjectAnalytics {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  avgAttendance: number;
  avgMarks: number;
  totalStudents: number;
  passingStudents: number;
  failingStudents: number;
}

export interface PerformanceDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface TopStudentSummary {
  studentId: number;
  studentName: string;
  registerNumber: string;
  rank: number;
  overallPercentage: number;
  attendancePercentage: number;
}

export interface ClassAnalytics {
  classId: number;
  className: string;
  totalStudents: number;
  avgClassAttendance: number;
  avgClassMarks: number;
  minAttendance: number;
  maxAttendance: number;
  studentsAbove75Attendance: number;
  studentsBelow75Attendance: number;
  studentsAbove60Marks: number;
  studentsBelow50Marks: number;
  subjectAnalytics: SubjectAnalytics[];
  performanceDistribution: PerformanceDistribution[];
  topPerformers: TopStudentSummary[];
}

// Semester Analytics
export interface SubjectDetail {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  attendancePercentage: number;
  averageMarks: number;
  rank: number;
  grade?: string;
}

export interface SemesterAnalytics {
  semesterId: number;
  semesterNo: number;
  totalClassesConducted: number;
  totalClassesAttended: number;
  overallAttendancePercentage: number;
  totalSubjects: number;
  averageMarks: number;
  subjectsPassed: number;
  subjectsFailed: number;
  sgpa: number;
  classRank?: number;
  sectionRank?: number;
  subjects?: SubjectDetail[];
}

// Comprehensive Student Analytics
export interface SubjectPerformance {
  subjectCode: string;
  subjectName: string;
  attendance: number;
  internal1: number;
  internal2: number;
  internal3: number;
  average: number;
  rank?: number;
  trend: string;
}

export interface SemesterAnalyticsDetail {
  semesterId: number;
  semesterNo: number;
  attendancePercentage: number;
  averageMarks: number;
  sgpa: number;
  classRank?: number;
  totalStudents?: number;
  subjects: SubjectPerformance[];
}

export interface SubjectComparison {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  semesterId: number;
  studentAttendance: number;
  studentMarks: number;
  studentRank: number;
  classAvgAttendance: number;
  classAvgMarks: number;
  classHighest: number;
  classLowest: number;
  aboveAverage: boolean;
  percentile: number;
  performanceCategory: string;
}

export interface SemesterTrend {
  semesterNo: number;
  attendance: number;
  marks: number;
  sgpa: number;
}

export interface TrendAnalysis {
  attendanceTrend: string;
  performanceTrend: string;
  semesterTrends: SemesterTrend[];
}

export interface Achievement {
  title: string;
  description: string;
  category: string;
  semesterId: number;
  rank: number;
}

export interface StudentComprehensiveAnalytics {
  studentId: number;
  registerNumber: string;
  studentName: string;
  email?: string;
  classId?: number;
  className?: string;
  overallAttendance: number;
  overallAverageMarks: number;
  currentSgpa: number;
  cgpa: number;
  semesterAnalytics: SemesterAnalyticsDetail[];
  subjectComparisons: SubjectComparison[];
  trendAnalysis: TrendAnalysis;
  achievements: Achievement[];
  recommendations: string[];
}

// Top Performers
export interface TopPerformer {
  performerId: number;
  studentId: number;
  studentName: string;
  registerNumber: string;
  rankPosition: number;
  overallPercentage: number;
  attendancePercentage: number;
  category: string;
  subjectName?: string;
  canViewProfile: boolean;
}
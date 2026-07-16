import api from "./api"
import type {
  AttendanceSession,
  CreateSessionRequest,
  MarkAttendanceRequest,
  BulkAttendanceRequest,
  StudentAttendanceResponse,
} from "@/types"

export const attendanceService = {
  // Create attendance session
  createSession: async (
    request: CreateSessionRequest
  ): Promise<AttendanceSession> => {
    const res = await api.post<AttendanceSession>(
      "/attendance/session/create",
      request
    )
    return res.data
  },

  // Mark attendance for single student
  markAttendance: async (request: MarkAttendanceRequest): Promise<void> => {
    await api.post("/attendance/mark", request)
  },

  // Bulk mark attendance
  bulkMarkAttendance: async (request: BulkAttendanceRequest): Promise<void> => {
    await api.post("/attendance/bulk-mark", request)
  },

  // Submit session
  submitSession: async (sessionId: number, staffId: number): Promise<void> => {
    await api.put(
      `/attendance/session/${sessionId}/submit?staffId=${staffId}`
    )
  },

  // Get staff sessions for a date
  getStaffSessions: async (
    staffId: number,
    date: string
  ): Promise<AttendanceSession[]> => {
    const res = await api.get<AttendanceSession[]>(
      `/attendance/staff/${staffId}/sessions?date=${date}`
    )
    return res.data
  },

  // Get student attendance
  getStudentAttendance: async (
    studentId: number,
    semesterId: number,
    academicSessionId: number
  ): Promise<StudentAttendanceResponse> => {
    const res = await api.get<StudentAttendanceResponse>(
      `/attendance/student/${studentId}?semesterId=${semesterId}&academicSessionId=${academicSessionId}`
    )
    return res.data
  },
}

export default attendanceService

// src/services/hodService.js
import api from './api';

const HOD_BASE = '/hod';

class HODService {
  // Dashboard Stats
  async getDashboardStats(deptId, sessionId) {
    const response = await api.get(`${HOD_BASE}/dashboard/stats`, {
      params: { deptId, sessionId }
    });
    return response.data;
  }

  // Subject-Staff Mapping
  async getSubjectOfferings(deptId, sessionId) {
    const response = await api.get(`${HOD_BASE}/subject-staff-mappings`, {
      params: { deptId, sessionId }
    });
    return response.data;
  }

  async saveSubjectStaffMapping(mapping) {
    const response = await api.post(`${HOD_BASE}/subject-staff-mappings`, mapping);
    return response.data;
  }

  async updateSubjectStaffMapping(configId, mapping) {
    const response = await api.put(`${HOD_BASE}/subject-staff-mappings/${configId}`, mapping);
    return response.data;
  }

  async deleteSubjectStaffMapping(configId) {
    const response = await api.delete(`${HOD_BASE}/subject-staff-mappings/${configId}`);
    return response.data;
  }

  // Staff Workload
  async getStaffWorkload(deptId, sessionId) {
    const response = await api.get(`${HOD_BASE}/staff-workload`, {
      params: { deptId, sessionId }
    });
    return response.data;
  }

  async updateStaffMaxHours(staffId, maxHours) {
    const response = await api.put(`${HOD_BASE}/staff/${staffId}/max-hours`, null, {
      params: { maxHours }
    });
    return response.data;
  }

  async getAvailableStaff(deptId) {
    const response = await api.get(`${HOD_BASE}/staff/available`, {
      params: { deptId }
    });
    return response.data;
  }

  async getStaffById(staffId) {
    const response = await api.get(`${HOD_BASE}/staff/${staffId}`);
    return response.data;
  }

  // Timetable Generation
  async generateTimetable(request) {
    const response = await api.post(`${HOD_BASE}/timetable/generate`, request);
    return response.data;
  }

  async getTimetables(deptId, sessionId = null) {
    const params = { deptId };
    if (sessionId) params.sessionId = sessionId;
    
    const response = await api.get(`${HOD_BASE}/timetables`, { params });
    return response.data;
  }

  async getTimetableById(timetableId) {
    const response = await api.get(`${HOD_BASE}/timetables/${timetableId}`);
    return response.data;
  }

  async updateTimetableStatus(timetableId, status) {
    const response = await api.put(`${HOD_BASE}/timetables/${timetableId}/status`, null, {
      params: { status }
    });
    return response.data;
  }

  async downloadTimetable(timetableId, format) {
    const response = await api.get(`${HOD_BASE}/timetables/${timetableId}/download/${format}`, {
      responseType: 'blob'
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `timetable_${timetableId}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Classroom Assignment
  async getAvailableRooms(deptId, roomType = null) {
    const params = { deptId };
    if (roomType) params.roomType = roomType;
    
    const response = await api.get(`${HOD_BASE}/classrooms/available`, { params });
    return response.data;
  }

  async getClassroomAssignments(sessionId, deptId) {
    const response = await api.get(`${HOD_BASE}/classroom-assignments`, {
      params: { sessionId, deptId }
    });
    return response.data;
  }

  async assignClassroom(assignment) {
    const response = await api.post(`${HOD_BASE}/classroom-assignments`, assignment);
    return response.data;
  }

  async updateClassroomAssignment(assignmentId, assignment) {
    const response = await api.put(`${HOD_BASE}/classroom-assignments/${assignmentId}`, assignment);
    return response.data;
  }

  async deleteClassroomAssignment(assignmentId) {
    const response = await api.delete(`${HOD_BASE}/classroom-assignments/${assignmentId}`);
    return response.data;
  }
}

export default new HODService();
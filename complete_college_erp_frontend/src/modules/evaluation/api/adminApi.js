import axiosInstance from './axiosConfig'

export const adminApi = {
  // Create or update exam control
  createOrUpdateExamControl: async (controlData) => {
    const response = await axiosInstance.post('/admin/exam-control', null, {
      params: controlData
    })
    return response.data
  },

  // Get exam control
  getExamControl: async (examId, subjectId, sessionId) => {
    const response = await axiosInstance.get('/admin/exam-control', {
      params: { examId, subjectId, sessionId }
    })
    return response.data
  },

  // Get all exam controls for an exam
  getExamControls: async (examId) => {
    const response = await axiosInstance.get(`/admin/exam-controls/${examId}`)
    return response.data
  }
}
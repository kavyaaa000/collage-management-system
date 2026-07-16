import axiosInstance from './axiosConfig'

export const statsApi = {
  // Get statistics
  getStats: async (examId, subjectId) => {
    const response = await axiosInstance.get('/stats', {
      params: { examId, subjectId }
    })
    return response.data
  },

  // Refresh statistics
  refreshStats: async (examId, subjectId) => {
    const response = await axiosInstance.post('/stats/refresh', null, {
      params: { examId, subjectId }
    })
    return response.data
  }
}
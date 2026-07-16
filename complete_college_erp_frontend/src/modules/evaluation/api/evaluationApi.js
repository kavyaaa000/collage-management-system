import axiosInstance from './axiosConfig'

export const evaluationApi = {
  // EXISTING: Upload answer sheet
  uploadAnswerSheet: async (formData) => {
    const response = await axiosInstance.post('/evaluation/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // EXISTING: Start AI evaluation
  startAIEvaluation: async (sheetId, sessionId) => {
    const response = await axiosInstance.post(
      `/evaluation/start-ai/${sheetId}`,
      null,
      { params: { sessionId } }
    )
    return response.data
  },

  // EXISTING: Get evaluation details
  getEvaluationDetails: async (sheetId) => {
    const response = await axiosInstance.get(`/evaluation/details/${sheetId}`)
    return response.data
  },

  // EXISTING: Save staff review
  saveStaffReview: async (reviewData) => {
    const response = await axiosInstance.post('/evaluation/staff-review', reviewData)
    return response.data
  },

  // EXISTING: Lock answer sheet
  lockAnswerSheet: async (sheetId, staffId) => {
    const response = await axiosInstance.post(
      `/evaluation/lock/${sheetId}`,
      null,
      { params: { staffId } }
    )
    return response.data
  },

  // NEW: Get all enrolled students for an exam and subject
  getEnrolledStudents: async (examId, subjectId) => {
    const response = await axiosInstance.get('/evaluation/enrolled-students', {
      params: { examId, subjectId }
    })
    return response.data
  },

  // NEW: Get sheet status for a specific student
  getStudentSheetStatus: async (examId, studentId, subjectId) => {
    const response = await axiosInstance.get('/evaluation/sheet-status', {
      params: { examId, studentId, subjectId }
    })
    return response.data
  }


}




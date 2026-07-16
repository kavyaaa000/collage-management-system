import axiosInstance from './axiosConfig'

export const answerKeyApi = {
  // Create answer key
  createAnswerKey: async (answerKeyData) => {
    const response = await axiosInstance.post('/answer-keys', answerKeyData)
    return response.data
  },

  // Get answer keys for exam and subject
  getAnswerKeys: async (examId, subjectId) => {
    const response = await axiosInstance.get('/answer-keys', {
      params: { examId, subjectId }
    })
    return response.data
  },

  // Get single answer key
  getAnswerKey: async (keyId) => {
    const response = await axiosInstance.get(`/answer-keys/${keyId}`)
    return response.data
  },

  // Update answer key
  updateAnswerKey: async (keyId, answerKeyData) => {
    const response = await axiosInstance.put(`/answer-keys/${keyId}`, answerKeyData)
    return response.data
  },

  // Delete answer key
  deleteAnswerKey: async (keyId, staffId) => {
    const response = await axiosInstance.delete(`/answer-keys/${keyId}`, {
      params: { staffId }
    })
    return response.data
  }
}
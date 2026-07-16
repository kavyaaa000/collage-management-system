import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluationApi } from '../api/evaluationApi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import PDFUpload from '../components/PDFUpload'
import { FaUpload, FaRobot, FaEye, FaLock, FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'

const EvaluationPage = () => {
  const navigate = useNavigate()
  
  // Form data
  const [examId, setExamId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [staffId] = useState(1) // Default staff ID
  
  // State
  const [loading, setLoading] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Students data
  const [students, setStudents] = useState([])
  const [studentsLoaded, setStudentsLoaded] = useState(false)
  
  // Upload/process tracking
  const [uploadingStudentId, setUploadingStudentId] = useState(null)
  const [processingStudentId, setProcessingStudentId] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState({}) // Map of studentId -> file

  // Load students when exam and subject are entered
  const handleLoadStudents = async () => {
    if (!examId || !subjectId) {
      toast.error('Please enter Exam ID and Subject ID')
      return
    }

    setLoadingStudents(true)
    setError(null)
    
    try {
      const result = await evaluationApi.getEnrolledStudents(examId, subjectId)
      setStudents(result)
      setStudentsLoaded(true)
      toast.success(`Loaded ${result.length} students`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students')
      toast.error('Failed to load students')
    } finally {
      setLoadingStudents(false)
    }
  }

  // Handle file selection for a student
  const handleFileSelect = (studentId, file) => {
    setSelectedFiles({
      ...selectedFiles,
      [studentId]: file
    })
  }

  // Upload answer sheet for specific student
  const handleUploadForStudent = async (studentId) => {
    const file = selectedFiles[studentId]
    
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (!sessionId) {
      toast.error('Please enter Session ID')
      return
    }

    setUploadingStudentId(studentId)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('examId', examId)
      formData.append('studentId', studentId)
      formData.append('subjectId', subjectId)
      formData.append('uploadedBy', staffId)
      formData.append('sessionId', sessionId)

      await evaluationApi.uploadAnswerSheet(formData)
      
      toast.success(`Answer sheet uploaded for student ${studentId}`)
      setSuccess(`Answer sheet uploaded successfully for student ${studentId}`)
      
      // Reload students to update status
      await handleLoadStudents()
      
      // Clear selected file
      const newFiles = { ...selectedFiles }
      delete newFiles[studentId]
      setSelectedFiles(newFiles)
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload answer sheet')
      toast.error('Failed to upload answer sheet')
    } finally {
      setUploadingStudentId(null)
    }
  }

  // Start AI evaluation for specific student
  const handleStartAI = async (student) => {
    if (!sessionId) {
      toast.error('Please enter Session ID')
      return
    }

    setProcessingStudentId(student.studentId)
    setError(null)
    setSuccess(null)

    try {
      const result = await evaluationApi.startAIEvaluation(student.sheetId, parseInt(sessionId))
      
      if (result.success) {
        toast.success(`AI evaluation completed for student ${student.studentId}`)
        setSuccess(`AI evaluation completed! Marks: ${result.total_marks}/${result.max_total_marks}`)
        
        // Reload students to update status
        await handleLoadStudents()
      } else {
        toast.error('AI evaluation failed')
        setError(result.error_message || 'AI evaluation failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start AI evaluation')
      toast.error('Failed to start AI evaluation')
    } finally {
      setProcessingStudentId(null)
    }
  }

  // View evaluation for student
  const handleViewEvaluation = (student) => {
    navigate(`/review/${student.sheetId}`)
  }

  // Get status badge for student
  const getStatusBadge = (student) => {
    if (!student.uploadStatus) {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center">
          <FaUpload className="mr-1" /> Not Uploaded
        </span>
      )
    }

    switch (student.uploadStatus) {
      case 'UPLOADED':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center">
            <FaExclamationTriangle className="mr-1" /> Ready for AI
          </span>
        )
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center">
            <FaSpinner className="mr-1 animate-spin" /> Processing...
          </span>
        )
      case 'OCR_COMPLETED':
      case 'EVALUATION_COMPLETED':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
            <FaCheckCircle className="mr-1" /> Evaluated
          </span>
        )
      case 'LOCKED':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center">
            <FaLock className="mr-1" /> Locked
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {student.uploadStatus}
          </span>
        )
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Answer Sheet Evaluation</h1>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

        {/* Step 1: Enter Exam Details */}
        {!studentsLoaded && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Exam Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam ID *
                </label>
                <input
                  type="number"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  placeholder="Enter Exam ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject ID *
                </label>
                <input
                  type="number"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  placeholder="Enter Subject ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session ID *
                </label>
                <input
                  type="number"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter Session ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleLoadStudents}
              disabled={loadingStudents || !examId || !subjectId}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loadingStudents ? 'Loading Students...' : 'Load Students'}
            </button>
          </div>
        )}

        {/* Step 2: Show All Students */}
        {studentsLoaded && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Enrolled Students ({students.length})
              </h2>
              <button
                onClick={() => {
                  setStudentsLoaded(false)
                  setStudents([])
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Change Exam/Subject
              </button>
            </div>

            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students enrolled in this exam/subject</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Student ID: {student.studentId} | Roll: {student.rollNumber}
                        </p>
                      </div>
                      {getStatusBadge(student)}
                    </div>

                    {/* Action Buttons Based on Status */}
                    <div className="space-y-2">
                      {/* Upload PDF */}
                      {!student.uploadStatus || student.uploadStatus === 'UPLOADED' ? (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => handleFileSelect(student.studentId, e.target.files[0])}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                              disabled={uploadingStudentId === student.studentId}
                            />
                          </div>
                          <button
                            onClick={() => handleUploadForStudent(student.studentId)}
                            disabled={uploadingStudentId === student.studentId || !selectedFiles[student.studentId]}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                          >
                            {uploadingStudentId === student.studentId ? (
                              <>
                                <FaSpinner className="mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <FaUpload className="mr-2" />
                                Upload
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}

                      {/* Start AI Evaluation */}
                      {student.uploadStatus === 'UPLOADED' && (
                        <button
                          onClick={() => handleStartAI(student)}
                          disabled={processingStudentId === student.studentId}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {processingStudentId === student.studentId ? (
                            <>
                              <FaSpinner className="mr-2 animate-spin" />
                              AI Processing...
                            </>
                          ) : (
                            <>
                              <FaRobot className="mr-2" />
                              Start AI Evaluation
                            </>
                          )}
                        </button>
                      )}

                      {/* View Evaluation */}
                      {(student.uploadStatus === 'EVALUATION_COMPLETED' || student.uploadStatus === 'LOCKED') && (
                        <button
                          onClick={() => handleViewEvaluation(student)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                        >
                          <FaEye className="mr-2" />
                          View Evaluation
                        </button>
                      )}

                      {/* Locked Status */}
                      {student.uploadStatus === 'LOCKED' && (
                        <p className="text-sm text-gray-500 text-center">
                          <FaLock className="inline-block mr-1" />
                          Evaluation locked and finalized
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EvaluationPage
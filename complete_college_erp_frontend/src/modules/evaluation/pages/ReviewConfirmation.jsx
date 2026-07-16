import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { evaluationApi } from '../api/evaluationApi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import ExtractedTextViewer from '../components/ExtractedTextViewer'
import KeywordMatchTable from '../components/KeywordMatchTable'
import MarkAdjustmentUI from '../components/MarkAdjustmentUI'
import ConfidenceIndicator from '../components/ConfidenceIndicator'
import { FaLock, FaSave, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { isWithinAdjustmentLimit } from '../utils/helpers'

const ReviewConfirmation = () => {
  const { sheetId } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [evaluations, setEvaluations] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [staffReviews, setStaffReviews] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [staffId, setStaffId] = useState(1) // Default staff ID
  const [saving, setSaving] = useState(false)
  const [locking, setLocking] = useState(false)

  useEffect(() => {
    fetchEvaluationDetails()
  }, [sheetId])

  const fetchEvaluationDetails = async () => {
    setLoading(true)
    setError(null)
    try {
const data = await evaluationApi.getEvaluationDetails(parseInt(sheetId))
setEvaluations(data)
console.log('Evaluation details:', data)

      
      // Initialize staff reviews with AI suggestions
      const initialReviews = {}
      data.forEach((evaluation, index) => {
        initialReviews[index] = {
          staffMarks: evaluation.ai_suggested_marks,
          remarks: '',
          adjustmentPercent: 0
        }
      })
      setStaffReviews(initialReviews)
      
      toast.success(`Loaded ${data.length} questions for review`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch evaluation details')
      toast.error('Failed to fetch evaluation details')
    } finally {
      setLoading(false)
    }
  }

  const handleMarksChange = (index, reviewData) => {
    setStaffReviews({
      ...staffReviews,
      [index]: reviewData
    })
  }

  const handleSaveReview = async (questionIndex) => {
    const evaluation = evaluations[questionIndex]
    const review = staffReviews[questionIndex]

    // Validation
    if (!isWithinAdjustmentLimit(evaluation.ai_suggested_marks, review.staffMarks)) {
      if (!review.remarks || review.remarks.trim() === '') {
        toast.error('Remarks are mandatory for adjustments beyond ±10%')
        return
      }
    }

    setSaving(true)
    setError(null)
    try {
      // Note: We need log_id which we don't have in the current structure
      // In a real implementation, the evaluation details should include log_id
      // For now, we'll assume log_id = evaluation index + 1 (this needs to be fixed in backend)
      
const reviewData = {
  logId: evaluation.logId,                 // ✅ CORRECT
  staffFinalMarks: parseFloat(review.staffMarks),
  staffRemarks: review.remarks,
  reviewedBy: parseInt(staffId)
}


      await evaluationApi.saveStaffReview(reviewData)
      toast.success(`Question ${evaluation.question_number} review saved`)
      setSuccess(`Question ${evaluation.question_number} review saved successfully`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review')
      toast.error('Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAllReviews = async () => {
    setSaving(true)
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < evaluations.length; i++) {
      const evaluation = evaluations[i]
      const review = staffReviews[i]

      // Validation
      if (!isWithinAdjustmentLimit(evaluation.ai_suggested_marks, review.staffMarks)) {
        if (!review.remarks || review.remarks.trim() === '') {
          toast.error(`Question ${evaluation.question_number}: Remarks required for adjustment > ±10%`)
          errorCount++
          continue
        }
      }

      try {
    const reviewData = {
  logId: evaluation.logId,                 // ✅ CORRECT
  staffFinalMarks: parseFloat(review.staffMarks),
  staffRemarks: review.remarks,
  reviewedBy: parseInt(staffId)
}


        await evaluationApi.saveStaffReview(reviewData)
        successCount++
      } catch (err) {
        errorCount++
      }
    }

    setSaving(false)

    if (errorCount === 0) {
      toast.success(`All ${successCount} reviews saved successfully`)
      setSuccess('All reviews saved successfully. You can now lock the marks.')
    } else {
      toast.warning(`Saved ${successCount} reviews, ${errorCount} failed`)
    }
  }

  const handleLockMarks = async () => {
    // Confirm lock
    if (!window.confirm('Are you sure you want to lock these marks? This action cannot be undone!')) {
      return
    }

    setLocking(true)
    setError(null)
    try {
      await evaluationApi.lockAnswerSheet(parseInt(sheetId), parseInt(staffId))
      toast.success('Marks locked successfully! No further edits are possible.')
      setSuccess('Marks locked successfully. This answer sheet evaluation is now complete.')
      
      // Redirect to stats page after 3 seconds
      setTimeout(() => {
        navigate('/stats')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to lock marks')
      toast.error('Failed to lock marks')
    } finally {
      setLocking(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < evaluations.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading evaluation details..." />
  }

  if (evaluations.length === 0) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <ErrorAlert message="No evaluation data found for this answer sheet" />
        </div>
      </div>
    )
  }

  const currentEvaluation = evaluations[currentQuestionIndex]
  const currentReview = staffReviews[currentQuestionIndex]

  // Calculate totals
  const totalAIMarks = evaluations.reduce((sum, e) => sum + parseFloat(e.ai_suggested_marks), 0)
  const totalStaffMarks = Object.values(staffReviews).reduce((sum, r) => sum + parseFloat(r.staffMarks), 0)
  const totalMaxMarks = evaluations.reduce((sum, e) => sum + parseFloat(e.max_marks), 0)

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Review & Confirmation</h1>
          <p className="text-gray-600">Sheet ID: {sheetId}</p>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

        {/* Summary Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-gray-800">{evaluations.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">AI Total Marks</p>
              <p className="text-2xl font-bold text-blue-600">{totalAIMarks.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Staff Total Marks</p>
              <p className="text-2xl font-bold text-green-600">{totalStaffMarks.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Maximum Marks</p>
              <p className="text-2xl font-bold text-gray-600">{totalMaxMarks.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                Question {currentEvaluation.question_number}
              </p>
              <p className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {evaluations.length}
              </p>
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === evaluations.length - 1}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>

          {/* Question Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {evaluations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* AI Confidence */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Confidence</h3>
              <ConfidenceIndicator confidence={currentEvaluation.ai_confidence_score} />
            </div>

            {/* Extracted Text */}
            <ExtractedTextViewer
              questionNumber={currentEvaluation.question_number}
              extractedText={currentEvaluation.extracted_text}
              ocrConfidence={currentEvaluation.ocr_confidence}
            />

            {/* Keyword Analysis */}
            <KeywordMatchTable
              keywordsFound={currentEvaluation.keywords_found}
              keywordsMissing={currentEvaluation.keywords_missing}
            />

            {/* AI Explanation */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Explanation</h3>
              <div className="bg-gray-50 rounded p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {currentEvaluation.ai_explanation}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Mark Adjustment */}
            <MarkAdjustmentUI
              aiSuggestedMarks={currentEvaluation.ai_suggested_marks}
              maxMarks={currentEvaluation.max_marks}
              onMarksChange={(data) => handleMarksChange(currentQuestionIndex, data)}
              disabled={saving || locking}
            />

            {/* Save Individual Question */}
            <button
              onClick={() => handleSaveReview(currentQuestionIndex)}
              disabled={saving || locking}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving...' : 'Save This Question Review'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleSaveAllReviews}
              disabled={saving || locking}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              {saving ? 'Saving All...' : 'Save All Reviews'}
            </button>

            <button
              onClick={handleLockMarks}
              disabled={saving || locking}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaLock className="mr-2" />
              {locking ? 'Locking...' : 'Lock Marks Permanently'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">⚠️ Important Warning</h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              <li>Once marks are locked, NO edits are possible by anyone (including admins)</li>
              <li>Please review all questions carefully before locking</li>
              <li>Save all reviews before attempting to lock</li>
              <li>This action is PERMANENT and IRREVERSIBLE</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewConfirmation
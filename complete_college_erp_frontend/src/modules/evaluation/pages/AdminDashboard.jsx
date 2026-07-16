import React, { useState, useEffect } from 'react'
import { adminApi } from '../api/adminApi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import { FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [marksEntryEnabled, setMarksEntryEnabled] = useState(true)
  const [aiEvaluationEnabled, setAiEvaluationEnabled] = useState(true)
  const [adminId, setAdminId] = useState(1) // Default admin ID
  const [currentControl, setCurrentControl] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleFetchControl = async () => {
    if (!examId || !subjectId || !sessionId) {
      toast.error('Please enter Exam ID, Subject ID, and Session ID')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const control = await adminApi.getExamControl(
        parseInt(examId),
        parseInt(subjectId),
        parseInt(sessionId)
      )
      setCurrentControl(control)
      setMarksEntryEnabled(control.marksEntryEnabled)
      setAiEvaluationEnabled(control.aiEvaluationEnabled)
      toast.success('Exam control loaded successfully')
    } catch (err) {
      if (err.response?.status === 404) {
        setCurrentControl(null)
        toast.info('No existing control found. You can create a new one.')
      } else {
        setError(err.response?.data?.message || 'Failed to fetch exam control')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveControl = async () => {
    if (!examId || !subjectId || !sessionId) {
      toast.error('Please enter Exam ID, Subject ID, and Session ID')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const control = await adminApi.createOrUpdateExamControl({
        examId: parseInt(examId),
        subjectId: parseInt(subjectId),
        sessionId: parseInt(sessionId),
        marksEntryEnabled,
        aiEvaluationEnabled,
        adminId: parseInt(adminId)
      })
      setCurrentControl(control)
      setSuccess('Exam control saved successfully')
      toast.success('Exam control saved successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save exam control')
      toast.error('Failed to save exam control')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Control Panel</h1>

          {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
          {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            onClick={handleFetchControl}
            disabled={loading}
            className="w-full mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load Exam Control'}
          </button>

          {/* Control Toggles */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Control Settings</h2>

            <div className="space-y-4">
              {/* Marks Entry Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Marks Entry Window</h3>
                  <p className="text-sm text-gray-600">
                    Allow staff to upload and evaluate answer sheets
                  </p>
                </div>
                <button
                  onClick={() => setMarksEntryEnabled(!marksEntryEnabled)}
                  className={`text-4xl transition ${
                    marksEntryEnabled ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {marksEntryEnabled ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>

              {/* AI Evaluation Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">AI Evaluation</h3>
                  <p className="text-sm text-gray-600">
                    Enable AI-assisted automatic evaluation
                  </p>
                </div>
                <button
                  onClick={() => setAiEvaluationEnabled(!aiEvaluationEnabled)}
                  className={`text-4xl transition ${
                    aiEvaluationEnabled ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {aiEvaluationEnabled ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveControl}
            disabled={loading || !examId || !subjectId || !sessionId}
            className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaSave className="mr-2" />
            {loading ? 'Saving...' : 'Save Control Settings'}
          </button>

          {/* Current Status */}
          {currentControl && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Current Status</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Control ID:</span>
                  <span className="ml-2 font-semibold">{currentControl.controlId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-semibold">
                    {new Date(currentControl.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Information Box */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Important Notes</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>Admin cannot edit marks - only enable/disable windows</li>
              <li>Disabling marks entry will prevent new uploads</li>
              <li>Disabling AI evaluation will prevent automatic evaluation</li>
              <li>Already locked marks cannot be modified</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
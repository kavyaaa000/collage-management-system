import React, { useState, useEffect } from 'react'
import { statsApi } from '../api/statsApi'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { FaChartBar, FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

const StatsPage = () => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [examId, setExamId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    if (!examId || !subjectId) {
      toast.error('Please enter Exam ID and Subject ID')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await statsApi.getStats(parseInt(examId), parseInt(subjectId))
      setStats(data)
      toast.success('Statistics loaded successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics')
      toast.error('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    if (!examId || !subjectId) {
      toast.error('Please enter Exam ID and Subject ID')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await statsApi.refreshStats(parseInt(examId), parseInt(subjectId))
      toast.success('Statistics refreshed')
      // Fetch updated stats
      await fetchStats()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh statistics')
      toast.error('Failed to refresh statistics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Evaluation Statistics</h1>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex items-end space-x-2">
              <button
                onClick={fetchStats}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center"
              >
                <FaChartBar className="mr-2" />
                {loading ? 'Loading...' : 'Load Stats'}
              </button>
              <button
                onClick={refreshStats}
                disabled={loading || !stats}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                <FaSync />
              </button>
            </div>
          </div>
        </div>

        {loading && <LoadingSpinner message="Loading statistics..." />}

        {/* Statistics Display */}
        {stats && !loading && (
          <div className="space-y-6 fade-in">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Uploaded</h3>
                  <FaChartBar className="text-blue-500 text-2xl" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total_sheets_uploaded || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Evaluated</h3>
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {stats.total_sheets_evaluated || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Locked</h3>
                  <FaCheckCircle className="text-purple-500 text-2xl" />
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.total_sheets_locked || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Completion</h3>
                  <FaChartBar className="text-orange-500 text-2xl" />
                </div>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.completion_percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Evaluation Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-all duration-500"
                  style={{ width: `${stats.completion_percentage || 0}%` }}
                >
                  {stats.completion_percentage?.toFixed(1)}%
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Uploaded</p>
                  <p className="font-semibold">{stats.total_sheets_uploaded || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Evaluated</p>
                  <p className="font-semibold">{stats.total_sheets_evaluated || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Locked</p>
                  <p className="font-semibold">{stats.total_sheets_locked || 0}</p>
                </div>
              </div>
            </div>

            {/* AI Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Confidence</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Average AI Confidence</span>
                      <span className="text-lg font-bold text-blue-600">
                        {stats.avg_ai_confidence?.toFixed(2) || 'N/A'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${stats.avg_ai_confidence || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">High Confidence (≥80%)</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.high_confidence_count || 0}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Low Confidence (&lt;60%)</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.low_confidence_count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Staff Adjustments</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Average Adjustment</span>
                      <span className="text-lg font-bold text-orange-600">
                        {stats.avg_staff_adjustment_percent?.toFixed(2) || 'N/A'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(stats.avg_staff_adjustment_percent || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Average Staff Adjustment
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          This metric shows how much staff adjusted AI suggestions on average.
                          Lower values indicate higher AI accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Info */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Evaluation Status</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pending Evaluation:</span>
                      <span className="font-semibold">
                        {(stats.total_sheets_uploaded || 0) - (stats.total_sheets_evaluated || 0)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pending Lock:</span>
                      <span className="font-semibold">
                        {(stats.total_sheets_evaluated || 0) - (stats.total_sheets_locked || 0)}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">
                        {stats.total_sheets_locked || 0}
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Quality Metrics</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Avg AI Confidence:</span>
                      <span className={`font-semibold ${
                        (stats.avg_ai_confidence || 0) >= 80 ? 'text-green-600' :
                        (stats.avg_ai_confidence || 0) >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stats.avg_ai_confidence?.toFixed(2) || 'N/A'}%
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Avg Adjustment:</span>
                      <span className="font-semibold">
                        {stats.avg_staff_adjustment_percent?.toFixed(2) || 'N/A'}%
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Completion Rate:</span>
                      <span className="font-semibold text-blue-600">
                        {stats.completion_percentage?.toFixed(1) || 0}%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!stats && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaChartBar className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Statistics Available</h3>
            <p className="text-gray-600">
              Enter Exam ID and Subject ID above to load evaluation statistics
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsPage
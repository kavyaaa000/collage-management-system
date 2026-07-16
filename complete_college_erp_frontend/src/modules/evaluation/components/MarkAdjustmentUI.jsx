import React, { useState, useEffect } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { calculateAdjustmentPercent, isWithinAdjustmentLimit } from '../utils/helpers'
import { toast } from 'react-toastify'

const MarkAdjustmentUI = ({ 
  aiSuggestedMarks, 
  maxMarks, 
  onMarksChange,
  disabled = false 
}) => {
  const [staffMarks, setStaffMarks] = useState(aiSuggestedMarks)
  const [remarks, setRemarks] = useState('')
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setStaffMarks(aiSuggestedMarks)
  }, [aiSuggestedMarks])

  const handleMarksChange = (value) => {
    const marks = parseFloat(value) || 0
    
    if (marks < 0) {
      toast.error('Marks cannot be negative')
      return
    }
    
    if (marks > maxMarks) {
      toast.error(`Marks cannot exceed maximum marks (${maxMarks})`)
      return
    }

    setStaffMarks(marks)
    
    const withinLimit = isWithinAdjustmentLimit(aiSuggestedMarks, marks)
    setShowWarning(!withinLimit)

    if (onMarksChange) {
      onMarksChange({
        staffMarks: marks,
        remarks: remarks,
        adjustmentPercent: calculateAdjustmentPercent(aiSuggestedMarks, marks)
      })
    }
  }

  const handleRemarksChange = (value) => {
    setRemarks(value)
    if (onMarksChange) {
      onMarksChange({
        staffMarks: staffMarks,
        remarks: value,
        adjustmentPercent: calculateAdjustmentPercent(aiSuggestedMarks, staffMarks)
      })
    }
  }

  const adjustmentPercent = calculateAdjustmentPercent(aiSuggestedMarks, staffMarks)

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Staff Review</h4>

      {/* Marks Display */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">AI Suggested</p>
          <p className="text-2xl font-bold text-blue-600">
            {parseFloat(aiSuggestedMarks).toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Staff Final</p>
          <p className="text-2xl font-bold text-green-600">
            {parseFloat(staffMarks).toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600 mb-1">Max Marks</p>
          <p className="text-2xl font-bold text-gray-600">
            {parseFloat(maxMarks).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Adjustment Info */}
      <div className={`mb-4 p-3 rounded ${
        Math.abs(adjustmentPercent) <= 5 ? 'bg-green-50' :
        Math.abs(adjustmentPercent) <= 10 ? 'bg-yellow-50' :
        'bg-red-50'
      }`}>
        <p className="text-sm font-medium text-gray-700">
          Adjustment: 
          <span className={`ml-2 font-bold ${
            Math.abs(adjustmentPercent) <= 5 ? 'text-green-600' :
            Math.abs(adjustmentPercent) <= 10 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {adjustmentPercent > 0 ? '+' : ''}{adjustmentPercent}%
          </span>
        </p>
      </div>

      {/* Warning for >10% adjustment */}
      {showWarning && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 fade-in">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-red-500 text-lg mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Adjustment exceeds ±10% limit
              </p>
              <p className="text-xs text-red-700 mt-1">
                Remarks are mandatory for adjustments beyond ±10%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Marks Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adjust Marks
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max={maxMarks}
          value={staffMarks}
          onChange={(e) => handleMarksChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can adjust marks within ±10% of AI suggestion
        </p>
      </div>

      {/* Remarks Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remarks {showWarning && <span className="text-red-600">*</span>}
        </label>
        <textarea
          value={remarks}
          onChange={(e) => handleRemarksChange(e.target.value)}
          disabled={disabled}
          rows={3}
          placeholder="Enter remarks (mandatory if adjustment > ±10%)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
      </div>
    </div>
  )
}

export default MarkAdjustmentUI
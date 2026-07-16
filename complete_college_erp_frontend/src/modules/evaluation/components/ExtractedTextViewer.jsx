import React, { useState } from 'react'
import { FaExpand, FaCompress } from 'react-icons/fa'

const ExtractedTextViewer = ({ questionNumber, extractedText, ocrConfidence }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-800">
          Question {questionNumber} - Extracted Answer
        </h4>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            OCR Confidence: <span className="font-semibold">{ocrConfidence}%</span>
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary hover:text-blue-700 transition"
          >
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      <div
        className={`bg-gray-50 rounded p-4 overflow-auto transition-all ${
          expanded ? 'max-h-96' : 'max-h-32'
        }`}
      >
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {extractedText || 'No text extracted'}
        </pre>
      </div>
    </div>
  )
}

export default ExtractedTextViewer
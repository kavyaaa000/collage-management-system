import React from 'react'
import { getConfidenceColor, getConfidenceLabel } from '../utils/helpers'

const ConfidenceIndicator = ({ confidence }) => {
  const confidenceNum = parseFloat(confidence)
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            confidenceNum >= 80 ? 'bg-green-500' :
            confidenceNum >= 60 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${confidenceNum}%` }}
        ></div>
      </div>
      <span className={`text-sm font-semibold ${getConfidenceColor(confidenceNum)}`}>
        {confidenceNum.toFixed(1)}%
      </span>
      <span className="text-xs text-gray-500">
        ({getConfidenceLabel(confidenceNum)})
      </span>
    </div>
  )
}

export default ConfidenceIndicator
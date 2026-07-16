import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md fade-in">
      <div className="flex items-start">
        <FaExclamationCircle className="text-red-500 text-xl mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorAlert
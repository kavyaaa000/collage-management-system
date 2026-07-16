import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

const SuccessAlert = ({ message, onClose }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-md fade-in">
      <div className="flex items-start">
        <FaCheckCircle className="text-green-500 text-xl mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800">Success</h3>
          <p className="text-sm text-green-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-500 hover:text-green-700 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SuccessAlert
import React, { useState } from 'react'
import { FaUpload, FaFilePdf } from 'react-icons/fa'
import { toast } from 'react-toastify'

const PDFUpload = ({ onFileSelect, disabled = false }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    validateAndSetFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const validateAndSetFile = (file) => {
    if (!file) return

    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size exceeds 50MB limit')
      return
    }

    setSelectedFile(file)
    if (onFileSelect) {
      onFileSelect(file)
    }
    toast.success(`File selected: ${file.name}`)
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <label
          htmlFor="pdf-upload"
          className={`flex flex-col items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {selectedFile ? (
            <FaFilePdf className="text-6xl text-red-500 mb-4" />
          ) : (
            <FaUpload className="text-6xl text-gray-400 mb-4" />
          )}
          
          {selectedFile ? (
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                Drop PDF file here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Maximum file size: 50MB
              </p>
            </div>
          )}
        </label>
      </div>

      {selectedFile && (
        <button
          onClick={() => {
            setSelectedFile(null)
            if (onFileSelect) onFileSelect(null)
          }}
          className="mt-3 text-sm text-red-600 hover:text-red-800 transition"
        >
          Remove file
        </button>
      )}
    </div>
  )
}

export default PDFUpload
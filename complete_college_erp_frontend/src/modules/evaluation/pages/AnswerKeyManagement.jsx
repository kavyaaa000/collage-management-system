import React, { useState } from 'react'
import { answerKeyApi } from '../api/answerKeyApi'
import { toast } from 'react-toastify'
import { FaPlus, FaTrash, FaSave, FaSearch } from 'react-icons/fa'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { KEYWORD_TYPES } from '../utils/constants'

const AnswerKeyManagement = () => {
  const [loading, setLoading] = useState(false)
  const [examId, setExamId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [questionNumber, setQuestionNumber] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [maxMarks, setMaxMarks] = useState('')
  const [markingScheme, setMarkingScheme] = useState('')
  const [staffId, setStaffId] = useState(1) // Default staff ID
  const [keywords, setKeywords] = useState([])
  const [error, setError] = useState(null)
  const [answerKeys, setAnswerKeys] = useState([])

  const addKeyword = () => {
    setKeywords([
      ...keywords,
      {
        keyword: '',
        keyword_type: KEYWORD_TYPES.CORE,
        weight: 1.0,
        synonyms: '',
        is_mandatory: false
      }
    ])
  }

  const updateKeyword = (index, field, value) => {
    const updated = [...keywords]
    updated[index][field] = value
    setKeywords(updated)
  }

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleCreateAnswerKey = async () => {
    // Validation
    if (!examId || !subjectId || !questionNumber || !maxMarks) {
      toast.error('Please fill all required fields')
      return
    }

    if (keywords.length === 0) {
      toast.error('Please add at least one keyword')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const answerKeyData = {
        exam_id: parseInt(examId),
        subject_id: parseInt(subjectId),
        question_number: parseInt(questionNumber),
        question_text: questionText,
        max_marks: parseFloat(maxMarks),
        marking_scheme: markingScheme,
        created_by: parseInt(staffId),
        keywords: keywords
      }

      await answerKeyApi.createAnswerKey(answerKeyData)
      toast.success('Answer key created successfully')
      
      // Reset form
      setQuestionNumber('')
      setQuestionText('')
      setMaxMarks('')
      setMarkingScheme('')
      setKeywords([])
      
      // Reload answer keys
      handleFetchAnswerKeys()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create answer key')
      toast.error('Failed to create answer key')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchAnswerKeys = async () => {
    if (!examId || !subjectId) {
      toast.error('Please enter Exam ID and Subject ID')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await answerKeyApi.getAnswerKeys(parseInt(examId), parseInt(subjectId))
      setAnswerKeys(data)
      toast.success(`Loaded ${data.length} answer keys`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch answer keys')
      toast.error('Failed to fetch answer keys')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Answer Key Management</h1>

        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Exam and Subject Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Exam & Subject</h2>
          
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

            <div className="flex items-end">
              <button
                onClick={handleFetchAnswerKeys}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Load Answer Keys
              </button>
            </div>
          </div>
        </div>

        {/* Create Answer Key Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Answer Key</h2>

          <div className="space-y-4">
            {/* Question Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Number *
                </label>
                <input
                  type="number"
                  value={questionNumber}
                  onChange={(e) => setQuestionNumber(e.target.value)}
                  placeholder="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Marks *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  placeholder="10.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text (Optional)
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={2}
                placeholder="Enter the question text for reference"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marking Scheme (Optional)
              </label>
              <textarea
                value={markingScheme}
                onChange={(e) => setMarkingScheme(e.target.value)}
                rows={3}
                placeholder="Detailed marking scheme or rubric"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Keywords Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Keywords</h3>
                <button
                  onClick={addKeyword}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add Keyword
                </button>
              </div>

              {keywords.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">
                  No keywords added. Click "Add Keyword" to start.
                </p>
              ) : (
                <div className="space-y-3">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={keyword.keyword}
                          onChange={(e) => updateKeyword(index, 'keyword', e.target.value)}
                          placeholder="Keyword"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <select
                          value={keyword.keyword_type}
                          onChange={(e) => updateKeyword(index, 'keyword_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value={KEYWORD_TYPES.CORE}>CORE</option>
                          <option value={KEYWORD_TYPES.SUPPORTING}>SUPPORTING</option>
                        </select>
                      </div>

                      <div className="col-span-1">
                        <input
                          type="number"
                          step="0.1"
                          value={keyword.weight}
                          onChange={(e) => updateKeyword(index, 'weight', parseFloat(e.target.value))}
                          placeholder="Weight"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="text"
                          value={keyword.synonyms}
                          onChange={(e) => updateKeyword(index, 'synonyms', e.target.value)}
                          placeholder="Synonyms (comma-separated)"
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>

                      <div className="col-span-2 flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={keyword.is_mandatory}
                            onChange={(e) => updateKeyword(index, 'is_mandatory', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Mandatory</span>
                        </label>
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeKeyword(index)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCreateAnswerKey}
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              {loading ? 'Creating...' : 'Create Answer Key'}
            </button>
          </div>
        </div>

        {/* Existing Answer Keys */}
        {answerKeys.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Existing Answer Keys ({answerKeys.length})
            </h2>

            <div className="space-y-4">
              {answerKeys.map((key) => (
                <div key={key.key_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Question {key.question_number}
                      </h3>
                      <p className="text-sm text-gray-600">Max Marks: {key.max_marks}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {key.keywords.length} Keywords
                    </span>
                  </div>

                  {key.question_text && (
                    <p className="text-sm text-gray-700 mb-2">{key.question_text}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {key.keywords.map((kw, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded ${
                          kw.keyword_type === 'CORE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {kw.keyword} ({kw.keyword_type}) - Weight: {kw.weight}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnswerKeyManagement
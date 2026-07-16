import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

const KeywordMatchTable = ({ keywordsFound, keywordsMissing }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h4 className="text-lg font-semibold text-gray-800">Keyword Analysis</h4>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Keywords Found */}
          <div>
            <h5 className="font-semibold text-green-700 mb-3 flex items-center">
              <FaCheck className="mr-2" />
              Keywords Found ({keywordsFound?.length || 0})
            </h5>
            <div className="space-y-1 max-h-60 overflow-auto">
              {keywordsFound && keywordsFound.length > 0 ? (
                keywordsFound.map((keyword, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-800"
                  >
                    ✓ {keyword}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No keywords found</p>
              )}
            </div>
          </div>

          {/* Keywords Missing */}
          <div>
            <h5 className="font-semibold text-red-700 mb-3 flex items-center">
              <FaTimes className="mr-2" />
              Keywords Missing ({keywordsMissing?.length || 0})
            </h5>
            <div className="space-y-1 max-h-60 overflow-auto">
              {keywordsMissing && keywordsMissing.length > 0 ? (
                keywordsMissing.map((keyword, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-800"
                  >
                    ✗ {keyword}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">All keywords found</p>
              )}
            </div>
          </div>
        </div>

        {/* Coverage Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Keyword Coverage:</span>
            <span className="text-lg font-bold text-primary">
              {keywordsFound && (keywordsFound.length + (keywordsMissing?.length || 0)) > 0
                ? ((keywordsFound.length / (keywordsFound.length + (keywordsMissing?.length || 0))) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeywordMatchTable
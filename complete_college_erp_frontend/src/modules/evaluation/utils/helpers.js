export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString()
}

export const calculateAdjustmentPercent = (aiMarks, staffMarks) => {
  if (aiMarks === 0) return 0
  return (((staffMarks - aiMarks) / aiMarks) * 100).toFixed(2)
}

export const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export const getConfidenceLabel = (confidence) => {
  if (confidence >= 80) return 'High Confidence'
  if (confidence >= 60) return 'Medium Confidence'
  return 'Low Confidence'
}

export const isWithinAdjustmentLimit = (aiMarks, staffMarks) => {
  const adjustmentPercent = Math.abs(calculateAdjustmentPercent(aiMarks, staffMarks))
  return adjustmentPercent <= 10
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
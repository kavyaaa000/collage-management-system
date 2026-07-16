export const KEYWORD_TYPES = {
  CORE: 'CORE',
  SUPPORTING: 'SUPPORTING'
}

export const UPLOAD_STATUS = {
  UPLOADED: 'UPLOADED',
  PROCESSING: 'PROCESSING',
  OCR_COMPLETED: 'OCR_COMPLETED',
  EVALUATION_COMPLETED: 'EVALUATION_COMPLETED',
  LOCKED: 'LOCKED',
  FAILED: 'FAILED'
}

export const CONFIDENCE_LEVELS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 0
}

export const MAX_ADJUSTMENT_PERCENT = 10

export const STATUS_COLORS = {
  UPLOADED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  OCR_COMPLETED: 'bg-purple-100 text-purple-800',
  EVALUATION_COMPLETED: 'bg-green-100 text-green-800',
  LOCKED: 'bg-gray-100 text-gray-800',
  FAILED: 'bg-red-100 text-red-800'
}
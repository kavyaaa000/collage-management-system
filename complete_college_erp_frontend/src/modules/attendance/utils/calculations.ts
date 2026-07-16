export const calculateAttendancePercentage = (
  attended: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100 * 100) / 100;
};

export const calculateClassesNeededFor75 = (
  attended: number,
  total: number
): number => {
  if (total === 0) return 0;
  
  const currentPercentage = (attended / total) * 100;
  if (currentPercentage >= 75) return 0;
  
  // Calculate: (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75 * (total + x)
  // attended + x >= 0.75 * total + 0.75 * x
  // x - 0.75x >= 0.75 * total - attended
  // 0.25x >= 0.75 * total - attended
  // x >= (0.75 * total - attended) / 0.25
  
  const needed = Math.ceil((0.75 * total - attended) / 0.25);
  return needed > 0 ? needed : 0;
};

export const getEligibilityStatus = (percentage: number): string => {
  if (percentage >= 75) return 'ELIGIBLE';
  if (percentage >= 65) return 'CONDITIONAL';
  if (percentage >= 60) return 'AT_RISK';
  return 'INELIGIBLE';
};

export const getRiskLevel = (
  attendance: number,
  marks: number
): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' => {
  if (attendance < 65 && marks < 50) return 'CRITICAL';
  if (attendance < 75 && marks < 60) return 'HIGH';
  if (attendance < 75 || marks < 60) return 'MEDIUM';
  return 'LOW';
};
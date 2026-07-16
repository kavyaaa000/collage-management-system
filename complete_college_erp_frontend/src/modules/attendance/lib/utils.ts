import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function getAttendanceColor(percentage: number): string {
  if (percentage >= 75) return 'text-green-600 bg-green-50';
  if (percentage >= 65) return 'text-yellow-600 bg-yellow-50';
  if (percentage >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

export function getPerformanceColor(marks: number): string {
  if (marks >= 75) return 'text-green-600';
  if (marks >= 60) return 'text-blue-600';
  if (marks >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-green-100 text-green-800 border-green-300';
  }
}

export function calculatePercentage(obtained: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100 * 100) / 100;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayOfWeek(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
}
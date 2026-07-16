import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy');
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'hh:mm a');
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy, hh:mm a');
};

export const getRelativeDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  
  return formatDate(d);
};

export const getDayOfWeek = (date?: Date): string => {
  const d = date || new Date();
  return format(d, 'EEEE').toUpperCase();
};

export const getTodayISO = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};
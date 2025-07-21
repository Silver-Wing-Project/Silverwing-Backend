export const parseDate = (dateString: string | Date): Date => {
  return new Date(dateString);
};

// Convert Date objects to 'YYYY-MM-DD' strings
export const formatDateToString = (date: Date | string): string => {
  return typeof date === 'string' ? date : date.toISOString().slice(0, 10);
};

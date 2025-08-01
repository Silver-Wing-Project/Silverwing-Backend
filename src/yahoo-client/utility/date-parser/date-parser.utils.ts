export const parseDate = (dateString: string | Date): Date => {
  return new Date(dateString);
};

// Standardize to ISO format (YYYY-MM-DD) for API consistency
export const formatDateToString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Handle both formats: YYYY/MM/DD and YYYY-MM-DD
    const normalized = date.replace(/\//g, '-');
    return normalized;
  }
  return date.toISOString().slice(0, 10);
};

// New utility for API date formatting
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().slice(0, 10); // Always YYYY-MM-DD for API
};

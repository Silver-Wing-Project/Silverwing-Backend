/**
 * Utility to normalize Python/yfinance error messages to user-friendly messages.
 * Ensures consistent frontend experience for all "not found" or "no data" cases.
 */
export function normalizePythonError(errorMsg: string, ticker?: string): string {
  if (!errorMsg) return 'No price data found for the given ticker.';

  const msg = errorMsg.toLowerCase();

  // Patterns that mean "not found" or "invalid ticker"
  if (
    msg.includes('http error 404') ||
    msg.includes('not found') ||
    msg.includes('no price data') ||
    msg.includes('possibly delisted') ||
    msg.includes('no data found') ||
    msg.includes('delisted')
  ) {
    return `No price data found for ticker '${ticker || ''}' in the given date range.`.replace("''", '');
  }

  // Fallback: return the original error message (cleaned up)
  return errorMsg
    .replace(/^Python script error:\s*/i, '')
    .replace(/^Unexpected error:\s*/i, '')
    .replace(/^HTTP Error 404:\s*/i, '')
    .trim();
}

import * as path from 'path';

export const DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'src', 'YahooClient', 'data');

console.log(`DATA_DIR: ${DATA_DIR}`);

export function getStockPricesCsv(ticker: string): string {
  return path.join(DATA_DIR, `${ticker}_stock_prices.csv`);
}

export function getDividendsCsv(ticker: string): string {
  return path.join(DATA_DIR, `${ticker}_dividends.csv`);
}

export function getFinancialReportJson(ticker: string): string {
  return path.join(DATA_DIR, `${ticker}_financial_report.json`);
}

export function getFinancialReportXlsx(ticker: string): string {
  return path.join(DATA_DIR, `${ticker}_financial_report.xlsx`);
}
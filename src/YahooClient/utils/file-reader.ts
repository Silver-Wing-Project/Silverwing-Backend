import * as fs from 'fs';
import * as csv from 'csv-parser';
import { StockPrice } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';
import { getStockPricesCsv, getFinancialReportJson } from './config';

export function readStockPricesFromCSV(ticker: string, startDate: string, endDate: string): Promise<StockPrice[]> {
  const csvPath = getStockPricesCsv(ticker);
  console.log(`Reading CSV: ${csvPath}`);
  const stockPrices: StockPrice[] = [];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file does not exist: ${csvPath}`);
      reject(new Error(`CSV file does not exist: ${csvPath}`));
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        const date = new Date(row.date);
        if (date >= new Date(startDate) && date <= new Date(endDate)) {
          stockPrices.push({
            ticker,
            date,
            open: parseFloat(row.open),
            close: parseFloat(row.close),
            high: parseFloat(row.high),
            low: parseFloat(row.low),
            volume: parseFloat(row.volume),
          });
        }
      })
      .on('end', () => {
        resolve(stockPrices);
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

export function readStockReportsFromJSON(ticker: string, reportType: string): Promise<StockReport[]> {
  const jsonPath = getFinancialReportJson(ticker);
  console.log(`Reading JSON: ${jsonPath}`);
  const stockReports: StockReport[] = [];

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(jsonPath)) {
      console.error(`JSON file does not exist: ${jsonPath}`);
      reject(new Error(`JSON file does not exist: ${jsonPath}`));
      return;
    }

    fs.readFile(jsonPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON:', err);
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        const reportData = jsonData.data;
        for (const [date, report] of Object.entries(reportData)) {
          stockReports.push({
            ticker: jsonData.ticker,
            date: new Date(date),
            reportType: jsonData.report_type,
            content: JSON.stringify(report),
          });
        }
        resolve(stockReports);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        reject(error);
      }
    });
  });
}
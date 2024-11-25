import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/stock-price.schema';
import { StockReport, StockReportDocument } from '../schemas/stock-report.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { PythonExecutorService } from '../python/python-executor.service';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(StockPrice.name) private stockPriceModel: Model<StockPriceDocument>,
    @InjectModel(StockReport.name) private stockReportModel: Model<StockReportDocument>,
    private readonly pythonExecutorService: PythonExecutorService,
  ) {}

  async fetchAndStoreStockPrices(ticker: string, startDate: string, endDate: string): Promise<StockPrice[]> {
    const existingPrices = await this.stockPriceModel.find({
      ticker,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).exec();

    if (existingPrices.length > 0) {
      return existingPrices;
    }

    // Fetch data using Python script if not found in the database
    const scriptPath = 'src/YahooClient/scripts/data_manager.py'
    await this.pythonExecutorService.runPythonScript(scriptPath, ['fetch_and_save_stock_prices', ticker, startDate, endDate]);

    // Read the data from the CSV file
    return this.readStockPricesFromCSV(ticker, startDate, endDate);

  }

  async fetchAndStoreStockReports(ticker: string, reportType: string): Promise<StockReport[]> {
    const existingReports = await this.stockReportModel.find({
      ticker,
      reportType
    }).exec();

    if (existingReports.length > 0) {
      return existingReports;
    }

    // Fetch data using Python script if not found in the database
    const scriptPath = 'src/YahooClient/scripts/data_manager.py'
    await this.pythonExecutorService.runPythonScript(scriptPath, ['fetch_and_save_financial_reports', ticker, reportType]);

    // Read the data from the JSON file
    return this.readStockReportsFromJSON(ticker, reportType);
  }

  private readStockPricesFromCSV(ticker: string, startDate: string, endDate: string): Promise<StockPrice[]> {
    const csvPath = path.join(__dirname, '..', '..', '..', 'src', 'YahooClient', 'data', `${ticker}_stock_prices.csv`);
    console.log(`Reading CSV: ${csvPath}`);
    const stockPrices = [];

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
        .on('end', async () => {
          try {
            await this.stockPriceModel.insertMany(stockPrices);
            resolve(stockPrices);
          } catch (error) {
            console.error('Error inserting stock prices:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  }

  private readStockReportsFromJSON(ticker: string, reportType: string): Promise<StockReport[]> {
    const jsonPath = path.join(__dirname, '..', '..', '..', 'src', 'YahooClient', 'data', `${ticker}_financial_report.json`);
    console.log(`Reading JSON: ${jsonPath}`);
    const stockReports = [];

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(jsonPath)) {
        console.error(`JSON file does not exist: ${jsonPath}`);
        reject(new Error(`JSON file does not exist: ${jsonPath}`));
        return;
      }

      fs.readFile(jsonPath, 'utf8', async (err, data) => {
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
          await this.stockReportModel.insertMany(stockReports);
          resolve(stockReports);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(error);
        }
      });
    });
  }
}
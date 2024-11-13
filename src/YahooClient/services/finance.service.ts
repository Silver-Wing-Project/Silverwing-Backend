import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/stock-price.schema';
import { StockReport, StockReportDocument } from '../schemas/stock-report.schema';
import { PythonExecutorService } from '../python/python-executor.service';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(StockPrice.name) private stockPriceModel: Model<StockPriceDocument>,
    @InjectModel(StockReport.name) private stockReportModel: Model<StockReportDocument>,
    private readonly pythonExecutorService: PythonExecutorService,
  ) {}

  async fetchAndStoreStockPrices(ticker: string, startDate: string, endDate: string): Promise<StockPrice> {
    const scriptPath = 'src/YahooClient/interfaces/data_fetcher.py';
    const result = await this.pythonExecutorService.runPythonScript(scriptPath, 'fetch_stock_prices', ticker, startDate, endDate);
    console.log('Raw output from Python script:', result);
    if (!result) {
      throw new Error('No output from Python script');
    }
    try {
      const stockPriceData = JSON.parse(result);
      if (stockPriceData.error) {
        throw new Error(stockPriceData.error);
      }
      const stockPrice = new this.stockPriceModel(stockPriceData);
      return stockPrice.save();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Failed to fetch and store stock prices');
    }
  }

  async fetchAndStoreStockReports(ticker: string, reportType: string): Promise<StockReport> {
    const scriptPath = 'src/YahooClient/interfaces/data_fetcher.py';
    const result = await this.pythonExecutorService.runPythonScript(scriptPath, 'fetch_stock_reports', ticker, reportType);
    console.log('Raw output from Python script:', result);
    if (!result) {
      throw new Error('No output from Python script');
    }
    try {
      const stockReportData = JSON.parse(result);
      if (stockReportData.error) {
        throw new Error(stockReportData.error);
      }
      const stockReport = new this.stockReportModel(stockReportData);
      return stockReport.save();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Failed to fetch and store stock reports');
    }
  }
}
import { Injectable } from '@nestjs/common';
import { StockPrice } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';
import { StockPriceRepository } from '../repositories/stock-price.repository';
import { StockReportRepository } from '../repositories/stock-report.repository';
import { PythonExecutorService } from '../python/python-executor.service';
import { readStockPricesFromCSV, readStockReportsFromJSON } from '../utils/file-reader';

@Injectable()
export class FinanceService {
  constructor(
    private readonly stockPriceRepository: StockPriceRepository,
    private readonly stockReportRepository: StockReportRepository,
    private readonly pythonExecutorService: PythonExecutorService,
  ) {}

  async fetchAndStoreStockPrices(ticker: string, startDate: string, endDate: string): Promise<StockPrice[]> {
    const existingPrices = await this.stockPriceRepository.findMany({
      ticker, date: {
        $gte: startDate, $lte: endDate 
      } 
    });
    if (existingPrices.length > 0) {
      return existingPrices;
    }

    const scriptPath = 'src/YahooClient/scripts/data_manager.py'
    await this.pythonExecutorService.runPythonScript(scriptPath, ['fetch_and_save_stock_prices', ticker, startDate, endDate]);

    const stockPrices = await readStockPricesFromCSV(ticker, startDate, endDate);
    await this.stockPriceRepository.createMany(stockPrices);
    return stockPrices;
  }

  async fetchAndStoreStockReports(ticker: string, reportType: string): Promise<StockReport[]> {
    const existingReports = await this.stockReportRepository.findMany({
       ticker, reportType 
      });
    if (existingReports.length > 0) {
      return existingReports;
    }

    const scriptPath = 'src/YahooClient/scripts/data_manager.py'
    await this.pythonExecutorService.runPythonScript(scriptPath, ['fetch_and_save_financial_reports', ticker, reportType]);

    const stockReports = await readStockReportsFromJSON(ticker, reportType);
    await this.stockReportRepository.createMany(stockReports);
    return stockReports;
  }
}
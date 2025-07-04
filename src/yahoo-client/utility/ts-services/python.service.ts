import { Injectable, NotFoundException } from '@nestjs/common';
import { PythonExecutorService } from '@python-executor/python-executor.service';
import * as path from 'path';

@Injectable()
export class PythonService {
  scriptPath: string;
  constructor(private pythonExecutorService: PythonExecutorService) {
    this.scriptPath = path.resolve(process.cwd(), 'src/yahoo-client/utility/python/scripts/data_manager.py');
  }

  async fetchStockData(ticker: string, startDate: Date, endDate: Date) {
    // Convert Date objects to 'YYYY-MM-DD' strings
    const start = typeof startDate === 'string' ? startDate : startDate.toISOString().slice(0, 10);
    const end = typeof endDate === 'string' ? endDate : endDate.toISOString().slice(0, 10);

    const stockPricesData = await this.pythonExecutorService.executePythonScript(this.scriptPath, [
      'fetch_stock_prices',
      ticker,
      start,
      end,
    ]);

    if (typeof stockPricesData === 'string') {
      try {
        const parsed = JSON.parse(stockPricesData);
        if (parsed && parsed.error) {
          throw new NotFoundException(`(pythonService)Python script error: ${parsed.error}`);
        }
      } catch (e) {
        // stdout is not JSON, continue
        console.log(`Python script output is not JSON. e.message: ${e.message}`);
      }
    }

    if (stockPricesData === '[]') {
      throw new NotFoundException(`No stock prices found for ${ticker}`);
    }
    return JSON.parse(stockPricesData);
  }

  async fetchStockReports(ticker: string, reportType: string) {
    const stockReportsData = await this.pythonExecutorService.executePythonScript(this.scriptPath, [
      'fetch_financial_reports',
      ticker,
      reportType,
    ]);
    return JSON.parse(stockReportsData);
  }
}

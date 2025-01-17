import { Injectable } from '@nestjs/common';
import { PythonExecutorService } from '../python-executor/python-executor.service';
import * as path from 'path';

@Injectable()
export class PythonService {
  scriptPath: string;
  constructor(private pythonExecutorService: PythonExecutorService) {
    this.scriptPath = path.resolve(process.cwd(), 'src/yahoo-client/utility/python/scripts/data_manager.py');
  }

  async fetchStockData(ticker: string, startDate: string, endDate: string) {
    
    const stockPricesData = await this.pythonExecutorService.executePythonScript(
      this.scriptPath,
      ['fetch_stock_prices', ticker, startDate, endDate],
    );
    return JSON.parse(stockPricesData);
  }

  async fetchStockReports(ticker: string, reportType: string) {
    const stockReportsData = await this.pythonExecutorService.executePythonScript(
      this.scriptPath,
      ['fetch_financial_reports', ticker, reportType],
    );
    return JSON.parse(stockReportsData);
  }
}

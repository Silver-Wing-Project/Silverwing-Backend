import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PythonExecutorService } from '@python-executor/python-executor.service';
import { formatDateToString } from '@utility/date-parser/date-parser.utils';
import * as path from 'path';

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);
  scriptPath: string;
  constructor(private pythonExecutorService: PythonExecutorService) {
    this.scriptPath = path.resolve(process.cwd(), 'src/yahoo-client/utility/python/scripts/data_manager.py');
  }

  async fetchStockData(ticker: string, startDate: Date, endDate: Date) {
    const start = formatDateToString(startDate);
    const end = formatDateToString(endDate);

    this.logger.log(`Fetching stock data for ${ticker} from ${start} to ${end}`);

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
        this.logger.debug(`Python script output is not JSON. e.message: ${e.message}`);
      }
    }

    if (stockPricesData === '[]') {
      throw new NotFoundException(`No stock prices found for ${ticker}`);
    }
    return JSON.parse(stockPricesData);
  }

  async fetchStockReports(ticker: string, reportType: string) {
    this.logger.log(`Fetching stock reports for ${ticker} of type ${reportType}`);

    const stockReportsData = await this.pythonExecutorService.executePythonScript(this.scriptPath, [
      'fetch_financial_reports',
      ticker,
      reportType,
    ]);

    // console.log(stockReportsData);
    const firstJsonObject = stockReportsData.split('\n')[0];

    try {
      const parsed = JSON.parse(firstJsonObject);
      if (parsed && parsed.error) {
        throw new NotFoundException(`(pythonService)Python script error: ${parsed.error}`);
      }
      return parsed;
    } catch (e) {
      this.logger.error(`Error parsing Python script output: ${e.message}`);
      throw new NotFoundException(`Error parsing Python script output: ${e.message}`);
    }
  }
}

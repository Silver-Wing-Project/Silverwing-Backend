import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { FinanceService } from '../services/finance.service';
import { StockPrice,  } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('fetch-stock-prices')
  async fetchStockPrices(
    @Query('ticker') ticker: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ):Promise<StockPrice[]> {
    if (!ticker || !startDate || !endDate) {
      throw new BadRequestException('Missing required query parameters: ticker, startDate, endDate');
    }
    return this.financeService.fetchAndStoreStockPrices(ticker, startDate, endDate);
  }

  @Get('fetch-stock-reports')
  async fetchStockReports(
    @Query('ticker') ticker: string,
    @Query('reportType') reportType: string,
  ): Promise<StockReport[]> {
    if (!ticker || !reportType) {
      throw new BadRequestException('Missing required query parameters: ticker, reportType');
    }
    return this.financeService.fetchAndStoreStockReports(ticker, reportType);
  }
}
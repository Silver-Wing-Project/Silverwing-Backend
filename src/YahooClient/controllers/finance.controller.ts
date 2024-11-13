import { Controller, Get, Query } from '@nestjs/common';
import { FinanceService } from '../services/finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('fetch-stock-prices')
  async fetchStockPrices(
    @Query('ticker') ticker: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.financeService.fetchAndStoreStockPrices(ticker, startDate, endDate);
  }

  @Get('fetch-stock-reports')
  async fetchStockReports(
    @Query('ticker') ticker: string,
    @Query('reportType') reportType: string,
  ) {
    return this.financeService.fetchAndStoreStockReports(ticker, reportType);
  }
}
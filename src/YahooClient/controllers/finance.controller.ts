import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
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
    if (!ticker || !startDate || !endDate) {
      throw new BadRequestException('Missing required query parameters: ticker, startDate, endDate');
    }
    return this.financeService.fetchAndStoreStockPrices(ticker, startDate, endDate);
  }

  @Get('fetch-stock-reports')
  async fetchStockReports(
    @Query('ticker') ticker: string,
    @Query('reportType') reportType: string,
  ) {
    if (!ticker || !reportType) {
      throw new BadRequestException('Missing required query parameters: ticker, reportType');
    }
    return this.financeService.fetchAndStoreStockReports(ticker, reportType);
  }
}
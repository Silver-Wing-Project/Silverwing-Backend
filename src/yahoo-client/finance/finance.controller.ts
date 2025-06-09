import { Controller, Get, InternalServerErrorException, Query, Param } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';

// import { AllExceptionsFilter } from '../utility/filters/all-exceptions.filter';
// import { HttpExceptionFilter } from '../utility/filters/http-exception.filter';
import { PythonService } from '../utility/ts-services/python.service';
import { StockReportService } from '../stock/stock-report/stock-report.service';
import { StockPriceService } from './../stock/stock-price/stock-price.service';
import { StockPrice } from '../stock/stock-price/entities/stock-price.schema';
import { StockReport } from '../stock/stock-report/entities/stock-report.schema';
import { parseStockPricesData, parseStockReportsData } from '../utility/data-parsers/data-parser.utils';

@ApiTags('Finance')
@Controller('finance')
export class FinanceController {
  constructor(
    private readonly pythonService: PythonService,
    private readonly stockPriceService: StockPriceService,
    private readonly stockReportService: StockReportService,
  ) {}

  @Get('fetch-stock-prices/:ticker')
  @ApiOperation({
    summary: 'Fetch stock prices for a given ticker and date range',
  })
  @ApiParam({
    name: 'ticker',
    type: String,
    description: 'Stock Ticker',
    example: 'AAPL',
    required: true,
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    description: 'Start Date',
    example: '2024-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    description: 'End Date',
    example: '2024-01-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The stock prices have been successfully fetched.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Stock prices not found or invalid stock ticker' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async fetchStockPrices(
    @Param('ticker') ticker: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StockPrice[]> {
    const existingPrices = await this.stockPriceService.findManyStockPrices(ticker, startDate, endDate);
    if (existingPrices.length > 0) {
      return existingPrices;
    }

    const stockPricesData = await this.pythonService.fetchStockData(ticker, startDate, endDate);

    if (!Array.isArray(stockPricesData)) {
      throw new InternalServerErrorException('Invalid data format received from Python service');
    }

    const parsedStockPricesData = parseStockPricesData(stockPricesData);
    const stockPrices = await this.stockPriceService.createManyStockPrices(parsedStockPricesData);
    return stockPrices;
  }

  @Get('fetch-stock-reports/:ticker')
  @ApiOperation({
    summary: 'Fetch stock reports for a given ticker and report type',
  })
  @ApiParam({
    name: 'ticker',
    type: String,
    description: 'Stock Ticker',
    example: 'AAPL',
    required: true,
  })
  @ApiQuery({
    name: 'reportType',
    type: String,
    description: 'Report Type',
    example: 'financials',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The stock reports have been successfully fetched.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async fetchStockReports(
    @Param('ticker') ticker: string,
    @Query('reportType') reportType: string,
  ): Promise<StockReport[]> {
    const existingReports = await this.stockReportService.findManyStockReports(ticker, reportType);
    if (existingReports.length > 0) {
      return existingReports;
    }

    const stockReportsData = await this.pythonService.fetchStockReports(ticker, reportType);

    const parsedStockReportsData = parseStockReportsData(stockReportsData);
    const stockReports = await this.stockReportService.createManyStockReports(parsedStockReportsData);
    return stockReports;
  }
}

import { Controller, Get, Post, Body, Query, Patch, Delete, UseFilters } from '@nestjs/common';
import { StockReportService } from './stock-report.service';
import { CreateStockReportDto } from './dto/create-stock-report.dto';
import { UpdateStockReportDto } from './dto/update-stock-report.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AllExceptionsFilter } from '@utility/filters/all-exceptions.filter';

@ApiTags('stock-reports')
@Controller('stock-reports')
@UseFilters(AllExceptionsFilter)
export class StockReportController {
  constructor(private readonly stockReportService: StockReportService) {}

  @Post('report')
  @ApiOperation({ summary: 'Create a new stock report' })
  @ApiBody({ type: CreateStockReportDto, description: 'Stock Report Data', required: true })
  @ApiResponse({ status: 201, description: 'The stock report has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createStockReport(@Body() createStockReportDto: CreateStockReportDto) {
    return await this.stockReportService.createStockReport(createStockReportDto);
  }

  @Post('reports')
  @ApiOperation({ summary: 'Create multiple stock reports' })
  @ApiBody({ type: [CreateStockReportDto], description: 'Stock Report Data', required: true })
  @ApiResponse({ status: 201, description: 'The stock reports have been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createManyStockReports(@Body() createStockReportDtos: CreateStockReportDto[]) {
    return await this.stockReportService.createManyStockReports(createStockReportDtos);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all stock reports' })
  @ApiResponse({ status: 200, description: 'The stock reports have been successfully fetched.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllStockReports() {
    return await this.stockReportService.findAllStockReports();
  }

  @Get('reports/:ticker/:reportType')
  @ApiOperation({ summary: 'Get multiple stock reports by ticker and report type' })
  @ApiParam({ name: 'ticker', type: String, description: 'Stock Ticker', required: true })
  @ApiParam({ name: 'reportType', type: String, description: 'Report Type', required: true })
  @ApiResponse({ status: 200, description: 'The stock reports have been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock reports not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findManyStockReports(@Query('ticker') ticker: string, @Query('reportType') reportType: string) {
    return await this.stockReportService.findManyStockReports(ticker, reportType);
  }

  @Get('report/:_id')
  @ApiOperation({ summary: 'Get a stock report by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID', required: true })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findStockReportById(@Query('_id') _id: string) {
    return await this.stockReportService.findStockReportById(_id);
  }

  @Patch('report/:_id')
  @ApiOperation({ summary: 'Update a stock report by ID' })
  @ApiBody({ type: UpdateStockReportDto })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID', required: true })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateStockReport(@Query('_id') _id: string, @Body() updateStockReportDto: UpdateStockReportDto) {
    return await this.stockReportService.updateStockReport(_id, updateStockReportDto);
  }

  @Delete('report/:_id')
  @ApiOperation({ summary: 'Delete a stock report by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID', required: true })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteStockReport(@Query('_id') _id: string) {
    return await this.stockReportService.deleteStockReport(_id);
  }

  @Delete('reports/:ids')
  @ApiOperation({ summary: 'Delete multiple stock reports by ID' })
  @ApiParam({ name: 'ids', type: String, description: 'Stock Report IDs', required: true })
  @ApiResponse({ status: 200, description: 'The stock reports have been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Stock reports not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteManyStockReports(@Query('ids') ids: string[]) {
    return await this.stockReportService.deleteManyStockReports(ids);
  }
}

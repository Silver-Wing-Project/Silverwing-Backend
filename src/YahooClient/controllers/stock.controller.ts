import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { CreateStockPriceDto } from '../dto/create-stock-price.dto';
import { CreateStockReportDto } from '../dto/create-stock-report.dto';
import { UpdateStockPriceDto } from '../dto/update-stock-price.dto';
import { UpdateStockReportDto } from '../dto/update-stock-report.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({ summary: 'Create a new stock price' })
  @ApiBody({ type: CreateStockPriceDto })
  @ApiResponse({ status: 201, description: 'The stock price has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Post('price')
  async createStockPrice(@Body() createStockPriceDto: CreateStockPriceDto) {
    return await this.stockService.createStockPrice(createStockPriceDto);
  }

  @Get('prices')
  @ApiOperation({ summary: 'Get all stock prices' })
  @ApiResponse({ status: 200, description: 'The stock prices have been successfully fetched.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllStockPrices() {
    return await this.stockService.findAllStockPrices();
  }

  @Get('price/:_id')
  @ApiOperation({ summary: 'Get a stock price by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Price ID' })
  @ApiResponse({ status: 200, description: 'The stock price has been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock price not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findStockPriceById(@Param('_id') _id: string) {
    return await this.stockService.findStockPriceById(_id);
  }

  @Put('price/:_id')
  @ApiOperation({ summary: 'Update a stock price by ID' })
  @ApiBody({ type: UpdateStockPriceDto })
  @ApiParam({ name: '_id', type: String, description: 'Stock Price ID' })
  @ApiResponse({ status: 200, description: 'The stock price has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Stock price not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateStockPrice(@Param('_id') _id: string, @Body() updateStockPriceDto: UpdateStockPriceDto) {
    return await this.stockService.updateStockPrice(_id, updateStockPriceDto);
  }

  @Delete('price/:_id')
  @ApiOperation({ summary: 'Delete a stock price by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Price ID' })
  @ApiResponse({ status: 200, description: 'The stock price has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Stock price not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteStockPrice(@Param('_id') _id: string) {
    return await this.stockService.deleteStockPrice(_id);
  }


  @Post('report')
  @ApiOperation({ summary: 'Create a new stock report' })
  @ApiBody({ type: CreateStockReportDto })
  @ApiResponse({ status: 201, description: 'The stock report has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createStockReport(@Body() createStockReportDto: CreateStockReportDto) {
    return await this.stockService.createStockReport(createStockReportDto);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get all stock reports' })
  @ApiResponse({ status: 200, description: 'The stock reports have been successfully fetched.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllStockReports() {
    return await this.stockService.findAllStockReports();
  }

  @Get('report/:_id')
  @ApiOperation({ summary: 'Get a stock report by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID' })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findStockReportById(@Param('_id') _id: string) {
    return await this.stockService.findStockReportById(_id);
  }

  @Put('report/:_id')
  @ApiOperation({ summary: 'Update a stock report by ID' })
  @ApiBody({ type: UpdateStockReportDto })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID' })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async updateStockReport(@Param('_id') _id: string, @Body() updateStockReportDto: UpdateStockReportDto) {
    return await this.stockService.updateStockReport(_id, updateStockReportDto);
  }

  @Delete('report/:_id')
  @ApiOperation({ summary: 'Delete a stock report by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Report ID' })
  @ApiResponse({ status: 200, description: 'The stock report has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Stock report not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async deleteStockReport(@Param('_id') _id: string) {
    return await this.stockService.deleteStockReport(_id);
  }
}
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StockPriceService } from './stock-price.service';
import { CreateStockPriceDto } from './dto/create-stock-price.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '@utility/pipes/object-validation.pipe';
import { DateValidationPipe } from '@/yahoo-client/utility/pipes/date-validation.pipe';

@ApiTags('stock-prices')
@Controller('stock-prices')
export class StockPriceController {
  constructor(private readonly stockPriceService: StockPriceService) {}

  @Post('price')
  @ApiOperation({ summary: 'Create a new stock price' })
  @ApiBody({ type: CreateStockPriceDto, description: 'Stock Price Data', required: true })
  @ApiResponse({ status: 201, description: 'The stock price has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createStockPrice(@Body() createStockPriceDto: CreateStockPriceDto) {
    return await this.stockPriceService.createStockPrice(createStockPriceDto);
  }

  @Post('prices')
  @ApiOperation({ summary: 'Create multiple stock prices' })
  @ApiBody({ type: [CreateStockPriceDto], description: 'Stock Price Data', required: true })
  @ApiResponse({ status: 201, description: 'The stock prices have been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createManyStockPrices(@Body() createStockPriceDtos: CreateStockPriceDto[]) {
    return await this.stockPriceService.createManyStockPrices(createStockPriceDtos);
  }

  @Get('prices')
  @ApiOperation({ summary: 'Get all stock prices' })
  @ApiResponse({ status: 200, description: 'The stock prices have been successfully fetched.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllStockPrices() {
    return await this.stockPriceService.findAllStockPrices();
  }

  @Get('prices/:ticker/:startDate/:endDate')
  @ApiOperation({ summary: 'Get multiple stock prices by ticker, start date, and end date' })
  @ApiParam({ name: 'ticker', type: String, description: 'Stock Ticker', example: 'AAPL', required: true })
  @ApiParam({ name: 'startDate', type: String, description: 'Start Date', example: '2024-01-01', required: true })
  @ApiParam({ name: 'endDate', type: String, description: 'End Date', example: '2024-01-31', required: true })
  @ApiResponse({ status: 200, description: 'The stock prices have been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock prices not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findManyStockPrices(
    @Param('ticker') ticker: string,
    @Param('startDate', DateValidationPipe) startDate: Date,
    @Param('endDate', DateValidationPipe) endDate: Date,
  ) {
    return await this.stockPriceService.findManyStockPrices(ticker, startDate, endDate);
  }

  @Get('price/:_id')
  @ApiOperation({ summary: 'Get a stock price by ID' })
  @ApiParam({ name: '_id', type: String, description: 'Stock Price ID', required: true })
  @ApiResponse({ status: 200, description: 'The stock price has been successfully fetched.' })
  @ApiResponse({ status: 404, description: 'Stock price not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findStockPriceById(@Param('_id', ObjectIdValidationPipe) _id: string) {
    return await this.stockPriceService.findStockPriceById(_id);
  }
}

import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { CreateStockPriceDto } from '../dto/create-stock-price.dto';
import { CreateStockReportDto } from '../dto/create-stock-report.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('price') //Create
  async createStockPrice(@Body() createStockPriceDto: CreateStockPriceDto) {
    return this.stockService.createStockPrice(createStockPriceDto);
  }

  @Get('prices') //Read
  async findAllStockPrices() {
    return this.stockService.findAllStockPrices();
  }

  @Get('price/:id') //Read
  async findStockPriceById(@Param('id') id: string) {
    return this.stockService.findStockPriceById(id);
  }

  @Put('price/:id') //Update
  async updateStockPrice(@Param('id') id: string, @Body() createStockPriceDto: CreateStockPriceDto) {
    return this.stockService.updateStockPrice(id, createStockPriceDto);
  }

  @Delete('price/:id') //Delete
  async deleteStockPrice(@Param('id') id: string) {
    return this.stockService.deleteStockPrice(id);
  }


  @Post('report') //Create
  async createStockReport(@Body() createStockReportDto: CreateStockReportDto) {
    return this.stockService.createStockReport(createStockReportDto);
  }

  @Get('reports') //Read
  async findAllStockReports() {
    return this.stockService.findAllStockReports();
  }

  @Get('report/:id') //Read
  async findStockReportById(@Param('id') id: string) {
    return this.stockService.findStockReportById(id);
  }

  @Put('report/:id') //Update
  async updateStockReport(@Param('id') id: string, @Body() createStockReportDto: CreateStockReportDto) {
    return this.stockService.updateStockReport(id, createStockReportDto);
  }

  @Delete('report/:id') //Delete
  async deleteStockReport(@Param('id') id: string) {
    return this.stockService.deleteStockReport(id);
  }
}
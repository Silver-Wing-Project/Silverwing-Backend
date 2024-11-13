import { Controller, Get } from '@nestjs/common';
import { TestStockService } from '../services/test-stock.service';

@Controller('test-stock')
export class TestStockController {
  constructor(private readonly testStockService: TestStockService) {}

  @Get('create-stock-price')
  async createStockPrice() {
    return this.testStockService.createTestStockPrice();
  }

  @Get('create-stock-report')
  async createStockReport() {
    return this.testStockService.createTestStockReport();
  }
}
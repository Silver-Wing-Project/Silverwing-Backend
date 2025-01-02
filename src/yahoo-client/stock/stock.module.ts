import { Module } from '@nestjs/common';
import { StockPriceModule } from './stock-price/stock-price.module';
import { StockReportModule } from './stock-report/stock-report.module';
import { StockController } from './stock.controller';

@Module({
  imports: [StockPriceModule, StockReportModule],
  controllers: [StockController],
  providers: [],
})
export class StockModule {}

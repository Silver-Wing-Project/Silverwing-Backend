import { Module } from '@nestjs/common';
import { StockReportModule } from './stock-report/stock-report.module';
import { StockController } from './stock.controller';

@Module({
  imports: [StockReportModule],
  controllers: [StockController],
  providers: [],
})
export class StockModule {}

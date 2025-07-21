import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { StockPriceModule } from '@stock-price/stock-price.module';
import { StockReportModule } from '@stock-report/stock-report.module';
import { UtilityModule } from '@utility/utility.module';

@Module({
  imports: [StockPriceModule, StockReportModule, UtilityModule],
  controllers: [FinanceController],
})
export class FinanceModule {}

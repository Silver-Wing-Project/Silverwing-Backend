import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { StockReportModule } from '@stock-report/stock-report.module';
import { UtilityModule } from '@utility/utility.module';

@Module({
  imports: [StockReportModule, UtilityModule],
  controllers: [FinanceController],
})
export class FinanceModule {}

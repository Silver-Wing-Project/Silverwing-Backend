import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { StockPriceModule } from '../stock/stock-price/stock-price.module';
import { StockReportModule } from '../stock/stock-report/stock-report.module';
import { UtilityModule } from '../utility/utility.module';
import { StockPriceService } from '../stock/stock-price/stock-price.service';
import { StockReportService } from '../stock/stock-report/stock-report.service';
import { PythonService } from '../utility/ts-services/python.service';

@Module({
  imports: [StockPriceModule, StockReportModule, UtilityModule],
  controllers: [FinanceController],
  providers: [StockPriceService, StockReportService, PythonService],
})
export class FinanceModule {}

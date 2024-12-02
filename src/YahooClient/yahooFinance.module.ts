import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockPrice, StockPriceSchema } from './schemas/stock-price.schema';
import { StockReport, StockReportSchema } from './schemas/stock-report.schema';
import { PythonExecutorService } from './python/python-executor.service';
import { FinanceService } from './services/finance.service';
import { FinanceController } from './controllers/finance.controller';
import { StockPriceRepository } from './repositories/stock-price.repository';
import { StockReportRepository } from './repositories/stock-report.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockPrice.name, schema: StockPriceSchema },
      { name: StockReport.name, schema: StockReportSchema },
    ]),
  ],
  controllers: [FinanceController],
  providers: [
    PythonExecutorService,
    FinanceService,
    StockPriceRepository,
    StockReportRepository,
  ],
})
export class YahooFinanceModule {}
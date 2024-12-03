import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PythonExecutorService } from './python/python-executor.service';
import { FinanceService } from './services/finance.service';
import { FinanceController } from './controllers/finance.controller';
import { StockPrice, StockPriceSchema } from './schemas/stock-price.schema';
import { StockReport, StockReportSchema } from './schemas/stock-report.schema';
import { StockPriceRepository } from './repositories/stock-price.repository';
import { StockReportRepository } from './repositories/stock-report.repository';
import { StockController } from './controllers/stock.controller';
import { StockService } from './services/stock.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockPrice.name, schema: StockPriceSchema },
      { name: StockReport.name, schema: StockReportSchema },
    ]),
  ],
  controllers: [FinanceController, StockController],
  providers: [
    PythonExecutorService,
    FinanceService,
    StockPriceRepository,
    StockReportRepository,
    StockService,
  ],
})
export class YahooFinanceModule {}
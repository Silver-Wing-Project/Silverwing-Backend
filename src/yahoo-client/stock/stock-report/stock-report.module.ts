import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockReportController } from './stock-report.controller';
import { StockReportService } from './stock-report.service';
import { StockReportRepository } from './repositories/stock-report.repository';
import { StockReport, StockReportSchema } from './entities/stock-report.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: StockReport.name, schema: StockReportSchema }])],
  controllers: [StockReportController],
  providers: [StockReportService, StockReportRepository],
  exports: [StockReportService, StockReportRepository],
})
export class StockReportModule {}

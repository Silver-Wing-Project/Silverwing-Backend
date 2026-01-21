import { Module } from '@nestjs/common';
import { BigFiveAnalysisService } from './application/big-five-analysis.service';
import { BigFiveAnalysisController } from './api/big-five-analysis.controller';
import { RoicCalculator } from './domain/calculators/roic.calculator';
import { BVPSGrowthCalculator } from './domain/calculators/bvps-growth.calculator';
import { EPSGrowthCalculator } from './domain/calculators/eps-growth.calculator';
import { FCFGrowthCalculator } from './domain/calculators/fcf-growth.calculator';
import { SalesGrowthCalculator } from './domain/calculators/sales-growth.calculator';
import { StockReportModule } from '@/yahoo-client/stock/stock-report/stock-report.module';
import { PythonModule } from '@/yahoo-client/utility/ts-services/python.module';

@Module({
  imports: [StockReportModule, PythonModule],
  providers: [
    BigFiveAnalysisService,
    RoicCalculator,
    BVPSGrowthCalculator,
    SalesGrowthCalculator,
    EPSGrowthCalculator,
    FCFGrowthCalculator,
  ],
  exports: [StockReportModule],
  controllers: [BigFiveAnalysisController],
})
export class BigFiveAnalysisModule {}

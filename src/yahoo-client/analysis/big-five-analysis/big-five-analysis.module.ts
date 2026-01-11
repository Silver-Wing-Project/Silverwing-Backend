import { Module } from '@nestjs/common';
import { BigFiveAnalysisService } from './big-five-analysis.service';
import { BigFiveAnalysisController } from './big-five-analysis.controller';
import { RoicCalculator } from './calculators/roic.calculator';
import { BVPSGrowthCalculator } from './calculators/bvps-growth.calculator';
import { EPSGrowthCalculator } from './calculators/eps-growth.calculator';
import { FCFGrowthCalculator } from './calculators/fcf-growth.calculator';
import { SalesGrowthCalculator } from './calculators/sales-growth.calculator';
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

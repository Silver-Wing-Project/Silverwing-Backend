import { Module } from '@nestjs/common';
import { BigFiveAnalysisService } from './big-five-analysis.service';
import { BigFiveAnalysisController } from './big-five-analysis.controller';

@Module({
  providers: [BigFiveAnalysisService],
  controllers: [BigFiveAnalysisController],
})
export class BigFiveAnalysisModule {}

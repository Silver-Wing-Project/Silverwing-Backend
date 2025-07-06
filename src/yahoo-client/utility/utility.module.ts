import { Module } from '@nestjs/common';
import { PythonExecutorService } from '@python-executor/python-executor.service';
import { PythonService } from '@ts-services/python.service';
import { DateRangeService } from './ts-services/date-range/date-range.service';

@Module({
  providers: [PythonExecutorService, PythonService, DateRangeService],
  exports: [PythonExecutorService, PythonService, DateRangeService],
})
export class UtilityModule {}

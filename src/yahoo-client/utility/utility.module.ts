import { Module } from '@nestjs/common';
import { PythonExecutorService } from './python-executor/python-executor.service';
import { PythonService } from '@ts-services/python.service';
import { DateRangeService } from '@ts-services/date-range/date-range.service';
import { DataCompletenessService } from '@ts-services/data-completeness/data-completeness.service';
import { StockDataOrchestrationService } from '@ts-services/stock-data-orchestration/stock-data-orchestration.service';

@Module({
  providers: [
    PythonExecutorService,
    PythonService,
    DateRangeService,
    DataCompletenessService,
    StockDataOrchestrationService,
    {
      provide: 'IDateRangeService',
      useExisting: DateRangeService,
    },
    {
      provide: 'IDataCompletenessService',
      useExisting: DataCompletenessService,
    },
    {
      provide: 'IStockDataOrchestrationService',
      useExisting: StockDataOrchestrationService,
    },
  ],
  exports: [
    PythonExecutorService,
    PythonService,
    DateRangeService,
    DataCompletenessService,
    StockDataOrchestrationService,
    // 'IDateRangeService',
    // 'IDataCompletenessService',
    // 'IStockDataOrchestrationService',
  ],
})
export class UtilityModule {}

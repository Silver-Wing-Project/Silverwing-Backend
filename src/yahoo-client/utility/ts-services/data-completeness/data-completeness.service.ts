import { Injectable, Logger } from '@nestjs/common';
import { StockPrice } from '@/future/stock-price/entities/stock-price.schema';
import { IDataCompletenessService, DataCompletenessResult } from './interfaces/data-completeness.interface';
// import { IDateRangeService } from '../date-range/interfaces/date-range.interface';
import { DateRangeService } from '@date-range/date-range.service';
// import { formatDateToString } from '@date-parser/date-parser.utils';

@Injectable()
export class DataCompletenessService implements IDataCompletenessService {
  private readonly logger = new Logger(DataCompletenessService.name);

  constructor(private readonly dateRangeService: DateRangeService) {}

  analyzeDataCompleteness(
    ticker: string,
    startDate: Date,
    endDate: Date,
    existingData: StockPrice[],
  ): DataCompletenessResult {
    // this.logger.debug(
    //   `Analyzing data completeness for ${ticker} from ${formatDateToString(startDate)} to ${formatDateToString(endDate)}`,
    // );

    const expectedDates = this.dateRangeService.generateBusinessDays(startDate, endDate);
    const existingDates = existingData.map((price) => new Date(price.date));
    const missingDates = this.dateRangeService.findMissingDates(expectedDates, existingDates);
    const missingRanges = this.dateRangeService.groupConsecutiveDates(missingDates);

    const result: DataCompletenessResult = {
      isComplete: missingRanges.length === 0,
      missingRanges,
      totalExpectedDays: expectedDates.length,
      totalExistingDays: existingDates.length,
    };

    this.logger.log(
      `Data completeness for ${ticker}: ${result.isComplete ? 'Complete' : 'Incomplete'} ` +
        `(${result.totalExistingDays}/${result.totalExpectedDays} days, ${missingRanges.length} missing ranges)`,
    );

    return result;
  }
}

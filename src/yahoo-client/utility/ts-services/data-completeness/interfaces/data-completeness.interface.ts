import { StockPrice } from '@/future/stock-price/entities/stock-price.schema';

export interface DataCompletenessResult {
  isComplete: boolean;
  missingRanges: Array<{ startDate: Date; endDate: Date }>;
  totalExpectedDays: number;
  totalExistingDays: number;
}

export interface IDataCompletenessService {
  analyzeDataCompleteness(
    ticker: string,
    startDate: Date,
    endDate: Date,
    existingData: StockPrice[],
  ): DataCompletenessResult;
}

import { StockPrice } from '@/future/stock-price/entities/stock-price.schema';

export interface StockDataRequest {
  ticker: string;
  startDate: Date;
  endDate: Date;
}

export interface StockDataResult {
  data: StockPrice[];
  wasDataCompleted: boolean;
  fetchedNewData: boolean;
  summary: {
    totalRecords: number;
    newRecords: number;
    missingRangesFetched: number;
  };
}

export interface IStockDataOrchestrationService {
  orchestrateStockDataRetrieval(
    request: StockDataRequest,
    existingData: StockPrice[],
    fetchCallback: (ticker: string, startDate: Date, endDate: Date) => Promise<StockPrice[]>,
    saveCallback: (data: StockPrice[]) => Promise<StockPrice[]>,
  ): Promise<StockDataResult>;
}

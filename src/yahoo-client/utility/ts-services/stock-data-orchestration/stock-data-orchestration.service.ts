import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StockPrice } from '@/future/stock-price/entities/stock-price.schema';
import {
  IStockDataOrchestrationService,
  StockDataRequest,
  StockDataResult,
} from './interfaces/stock-data-orchestration.interface';
import { DataCompletenessService } from '@data-completeness/data-completeness.service';
import { formatDateToString } from '@date-parser/date-parser.utils';
import { TickerValidator } from '@validators/ticker.validator';

@Injectable()
export class StockDataOrchestrationService implements IStockDataOrchestrationService {
  private readonly logger = new Logger(StockDataOrchestrationService.name);

  constructor(private readonly dataCompletenessService: DataCompletenessService) {}

  async orchestrateStockDataRetrieval(
    request: StockDataRequest,
    existingData: StockPrice[],
    fetchCallback: (ticker: string, startDate: Date, endDate: Date) => Promise<StockPrice[]>,
    saveCallback: (data: StockPrice[]) => Promise<StockPrice[]>,
  ): Promise<StockDataResult> {
    this.validateRequest(request);

    const { ticker, startDate, endDate } = request;
    this.logger.log(
      `Orchestrating stock data retrieval for ${ticker} from ${formatDateToString(startDate)} to ${formatDateToString(endDate)}`,
    );
    const completenessResult = this.dataCompletenessService.analyzeDataCompleteness(
      ticker,
      startDate,
      endDate,
      existingData,
    );

    if (completenessResult.isComplete) {
      return this.createCompleteResult(existingData);
    }

    const newData = await this.fetchMissingDataRanges(
      ticker,
      completenessResult.missingRanges,
      fetchCallback,
      saveCallback,
    );

    return this.createResultWithNewData(existingData, newData, completenessResult.missingRanges.length);
  }

  private validateRequest(request: StockDataRequest): void {
    const { ticker, startDate, endDate } = request;

    TickerValidator.validate(ticker);

    if (!startDate || !endDate) {
      throw new BadRequestException('Both startDate and endDate are required');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    if (endDate > new Date()) {
      throw new BadRequestException('End date cannot be in the future');
    }
  }

  private async fetchMissingDataRanges(
    ticker: string,
    missingRanges: Array<{ startDate: Date; endDate: Date }>,
    fetchCallback: (ticker: string, startDate: Date, endDate: Date) => Promise<StockPrice[]>,
    saveCallback: (data: StockPrice[]) => Promise<StockPrice[]>,
  ): Promise<StockPrice[]> {
    const allNewData: StockPrice[] = [];

    for (const range of missingRanges) {
      try {
        this.logger.log(
          `Fetching missing data for ${ticker}: ${formatDateToString(range.startDate)} to ${formatDateToString(range.endDate)}`,
        );

        const fetchedData = await fetchCallback(ticker, range.startDate, range.endDate);

        if (fetchedData?.length > 0) {
          const savedData = await saveCallback(fetchedData);
          allNewData.push(...savedData);
        } else {
          this.logger.warn(
            `No data returned for ${ticker} in range ${formatDateToString(range.startDate)} to ${formatDateToString(range.endDate)}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to fetch data for ${ticker} in range ${formatDateToString(range.startDate)} to ${formatDateToString(range.endDate)}`,
          error.stack,
        );
        // Continue with other ranges
      }
    }

    return allNewData;
  }

  private createCompleteResult(existingData: StockPrice[]): StockDataResult {
    return {
      data: existingData,
      wasDataCompleted: false,
      fetchedNewData: false,
      summary: {
        totalRecords: existingData.length,
        newRecords: 0,
        missingRangesFetched: 0,
      },
    };
  }

  private createResultWithNewData(
    existingData: StockPrice[],
    newData: StockPrice[],
    missingRangesFetched: number,
  ): StockDataResult {
    const allData = [...existingData, ...newData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return {
      data: allData,
      wasDataCompleted: true,
      fetchedNewData: newData.length > 0,
      summary: {
        totalRecords: allData.length,
        newRecords: newData.length,
        missingRangesFetched,
      },
    };
  }
}

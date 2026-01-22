import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { StockPriceRepository } from './repositories/stock-price.repository';
import { CreateStockPriceDto } from './dto/create-stock-price.dto';
import { StockPrice } from './entities/stock-price.schema';
import { plainToClass } from 'class-transformer';
import { formatDateToString, parseDate } from '@utility/date-parser/date-parser.utils';
import { errorMessages } from '@utility/constants/constants';
import { ServiceErrorHandler } from '../../yahoo-client/stock/utils/service-error.handler';

@Injectable()
export class StockPriceService {
  private readonly logger = new Logger(StockPriceService.name);
  private readonly serviceErrorHandler: ServiceErrorHandler;

  constructor(private readonly stockPriceRepository: StockPriceRepository) {
    this.serviceErrorHandler = new ServiceErrorHandler(this.logger);
  }

  /**
   * Creates a new stock price entry in the repository.
   *
   * @param {CreateStockPriceDto} createStockPriceDto - The data transfer object containing the details of the stock price to be created.
   * @returns {Promise<StockPrice>} - A promise that resolves to the created stock price.
   *
   * @throws {BadRequestException} - If the createStockPriceDto is not provided.
   * @throws {InternalServerErrorException} - If there is an error while creating the stock price.
   */
  async createStockPrice(createStockPriceDto: CreateStockPriceDto): Promise<StockPrice> {
    try {
      if (!createStockPriceDto)
        return this.serviceErrorHandler.handleBusinessError(
          new BadRequestException(errorMessages.MISSING_CREATE_STOCK_PRICE_DTO),
          'createStockPrice',
          errorMessages.FAILED_TO_CREATE_STOCK_PRICE,
        );

      const stockPrice = plainToClass(StockPrice, createStockPriceDto);
      this.logger.log('Creating a new stock price', JSON.stringify(stockPrice));
      return await this.stockPriceRepository.create(stockPrice);
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'createStockPrice',
        errorMessages.FAILED_TO_CREATE_STOCK_PRICE,
      );
    }
  }

  /**
   * Creates multiple stock prices in the repository.
   *
   * @param {CreateStockPriceDto[]} createStockPriceDtos - An array of DTOs containing the stock price data to be created.
   * @returns {Promise<StockPrice[]>} A promise that resolves to an array of created StockPrice entities.
   *
   * @throws {InternalServerErrorException} If there is an error during the creation of stock prices.
   */
  async createManyStockPrices(createStockPriceDtos: CreateStockPriceDto[]): Promise<StockPrice[]> {
    try {
      const stockPrices = createStockPriceDtos.map((dto) => {
        const stockPrice = plainToClass(StockPrice, dto);
        return stockPrice;
      });
      return await this.stockPriceRepository.createMany(stockPrices);
    } catch (error) {
      return this.serviceErrorHandler.handleRepositoryError(
        error,
        'createManyStockPrices',
        errorMessages.FAILED_TO_CREATE_MANY_STOCK_PRICES,
      );
    }
  }

  /**
   * Retrieves all stock prices from the repository.
   *
   * @returns {Promise<StockPrice[]>} A promise that resolves to an array of StockPrice objects.
   * @throws {InternalServerErrorException} If an error occurs while retrieving the stock prices.
   */
  async findAllStockPrices(): Promise<StockPrice[]> {
    try {
      this.logger.log('Finding all stock prices');

      const stockPrices = await this.stockPriceRepository.findAll();

      return stockPrices;
    } catch (error) {
      return this.serviceErrorHandler.handleRepositoryError(
        error,
        'findAllStockPrices',
        errorMessages.FAILED_TO_GET_ALL_STOCK_PRICES,
      );
    }
  }

  /**
   * Finds multiple stock prices for a given ticker within a specified date range.
   *
   * @param {string} ticker - The stock ticker symbol.
   * @param {string} startDate - The start date of the date range in YYYY-MM-DD format.
   * @param {string} endDate - The end date of the date range in YYYY-MM-DD format.
   * @returns {Promise<StockPrice[]>} - A promise that resolves to an array of StockPrice objects.
   * @throws {BadRequestException} - If any of the required query parameters (ticker, startDate, endDate) are missing.
   * @throws {NotFoundException} - If no stock prices are found for the given ticker and date range.
   * @throws {InternalServerErrorException} - If an error occurs while finding the stock prices.
   */
  async findManyStockPrices(ticker: string, startDate: Date, endDate: Date): Promise<StockPrice[]> {
    try {
      if (!ticker || !startDate || !endDate) {
        throw new BadRequestException(errorMessages.MISSING_QUERY_PARAMS_PRICE);
      }

      this.logger.log(
        `Finding multiple stock prices with ticker: ${ticker}, startDate: ${formatDateToString(startDate)}, endDate: ${formatDateToString(endDate)}`,
      );

      const existingPrices = await this.stockPriceRepository.findMany({
        ticker,
        date: {
          $gte: parseDate(startDate),
          $lte: parseDate(endDate),
        },
      });

      // Return empty array instead of throwing error - let orchestration service handle completeness
      if (!existingPrices || existingPrices.length === 0) {
        this.logger.log(`No existing stock prices found for ${ticker}`);
        return [];
      }

      this.logger.log(
        `Found ${existingPrices.length} stock prices for ticker ${ticker} between ${startDate} and ${endDate}`,
      );

      // if (!existingPrices) {
      //   throw new NotFoundException(errorMessages.FAILED_TO_GET_MANY_STOCK_PRICES);
      // }
      return existingPrices;
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'findManyStockPrices',
        errorMessages.FAILED_TO_GET_MANY_STOCK_PRICES,
      );
    }
  }

  /**
   * Finds the stock price by its ID.
   *
   * @param _id - The ID of the stock price to find.
   * @returns A promise that resolves to the found StockPrice object.
   * @throws {BadRequestException} If the _id parameter is missing.
   * @throws {NotFoundException} If no stock price is found with the given ID.
   * @throws {InternalServerErrorException} If an error occurs while finding the stock price.
   */
  async findStockPriceById(_id: string): Promise<StockPrice> {
    try {
      if (!_id) throw new BadRequestException(errorMessages.MISSING_ID_PARAM);

      this.logger.log(`Finding stock price by ID: ${_id}`);
      const stockPrice = await this.stockPriceRepository.findOne(_id);
      if (!stockPrice) {
        throw new NotFoundException(errorMessages.FAILED_TO_GET_STOCK_PRICE_BY_ID);
      }
      return stockPrice;
    } catch (error) {
      this.logger.error(`Error finding stock price by ID ${_id}`, error.stack);
      switch (true) {
        case error instanceof BadRequestException:
          throw error;
        case error instanceof NotFoundException:
          throw error;
        default:
          throw new InternalServerErrorException(errorMessages.FAILED_TO_GET_STOCK_PRICE_BY_ID);
      }
    }
  }
}

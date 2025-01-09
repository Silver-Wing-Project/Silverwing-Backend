import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { StockPriceRepository } from './repositories/stock-price.repository';
import { CreateStockPriceDto } from './dto/create-stock-price.dto';
import { UpdateStockPriceDto } from './dto/update-stock-price.dto';
import { StockPrice } from './entities/stock-price.schema';
import { plainToClass } from 'class-transformer';
import { parseDate } from '../../utility/date-parser/date-parser.utils';

@Injectable()
export class StockPriceService {
  private readonly logger = new Logger(StockPriceService.name);

  constructor(private readonly stockPriceRepository: StockPriceRepository) {}

  /**
   * Creates a new stock price entry in the repository.
   * 
   * @param {CreateStockPriceDto} createStockPriceDto - The data transfer object containing the details of the stock price to be created.
   * @returns {Promise<StockPrice>} - A promise that resolves to the created stock price.
   * 
   * @throws {BadRequestException} - If the createStockPriceDto is not provided.
   * @throws {InternalServerErrorException} - If there is an error while creating the stock price.
   */
  async createStockPrice(
    createStockPriceDto: CreateStockPriceDto,
  ): Promise<StockPrice> {
    try {
      if (!createStockPriceDto) {
        throw new BadRequestException(
          'Missing required body parameter: createStockPriceDto',
        );
      }

      const stockPrice = plainToClass(StockPrice, createStockPriceDto);
      stockPrice.date = parseDate(stockPrice.date);
      this.logger.log(
        'Creating a new stock price', 
        JSON.stringify(stockPrice)
      );
      return await this.stockPriceRepository.create(stockPrice);
    } catch (error) {
      this.logger.error('Error creating stock price', error.stack);
      throw new InternalServerErrorException('Error creating stock price');
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
  async createManyStockPrices(
    createStockPriceDtos: CreateStockPriceDto[],
  ): Promise<StockPrice[]> {
    try {
      if(!Array.isArray(createStockPriceDtos)) {
        createStockPriceDtos = [createStockPriceDtos];
      }
  
      const stockPrices = createStockPriceDtos.map((dto) => {
        const stockPrice = plainToClass(StockPrice, dto);
        stockPrice.date = parseDate(stockPrice.date);
        return stockPrice;
      });
      return await this.stockPriceRepository.createMany(stockPrices);
    } catch (error) {
      this.logger.error('Error creating multiple stock prices', error.stack);
      throw new InternalServerErrorException(
        'Error creating multiple stock prices',
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
      stockPrices.forEach((stockPrice) => (stockPrice.date = parseDate(stockPrice.date)));

      return stockPrices;
    } catch (error) {
      this.logger.error('Error finding all stock prices', error.stack);
      throw new InternalServerErrorException('Error finding all stock prices');
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
  async findManyStockPrices(
    ticker: string,
    startDate: string,
    endDate: string,
  ): Promise<StockPrice[]> {
    try {
      if (!ticker || !startDate || !endDate) {
        throw new BadRequestException(
          'Missing required query parameters: ticker, startDate, endDate',
        );
      }

      this.logger.log(
        `Finding multiple stock prices with ticker: ${ticker}, startDate: ${startDate}, endDate: ${endDate}`,
      );
      const existingPrices = await this.stockPriceRepository.findMany({
        ticker,
        date: {
          $gte: parseDate(startDate),
          $lte: parseDate(endDate),
        },
      });
      if (!existingPrices) {
        throw new NotFoundException(
          `Stock prices with ticker: ${ticker}, startDate: ${startDate}, endDate: ${endDate} not found`,
        );
      }
      return existingPrices;
    } catch (error) {
      this.logger.error('Error finding multiple stock prices', error.stack);
      throw new InternalServerErrorException(
        'Error finding multiple stock prices',
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
      if (!_id) 
        throw new BadRequestException('Missing required path parameter: _id ');

      this.logger.log(`Finding stock price by ID: ${_id}`);
      const stockPrice = await this.stockPriceRepository.findOne(_id);
      if (!stockPrice) {
        throw new NotFoundException(`Stock price with ID: ${_id} not found`);
      }
      stockPrice.date = parseDate(stockPrice.date);
      return stockPrice;
    } catch (error) {
      this.logger.error(`Error finding stock price by ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error finding stock price by ID');
    }
  }

  /**
   * Updates the stock price for a given stock ID.
   *
   * @param _id - The ID of the stock to update.
   * @param updateStockPriceDto - The data transfer object containing the updated stock price information.
   * @returns A promise that resolves to the updated StockPrice object.
   * @throws {BadRequestException} If the _id or updateStockPriceDto is missing.
   * @throws {InternalServerErrorException} If an error occurs while updating the stock price.
   */
  async updateStockPrice(
    _id: string,
    updateStockPriceDto: UpdateStockPriceDto,
  ): Promise<StockPrice> {
    try {
      if (!_id || !updateStockPriceDto)
        throw new BadRequestException(
          'Missing required path parameter: _id or body parameter: updateStockPriceDto'
      );

      const stockPrice = plainToClass(StockPrice, updateStockPriceDto);
      stockPrice.date = parseDate(stockPrice.date);
      this.logger.log(
        `Updating stock price with ID ${_id}`,
        JSON.stringify(stockPrice),
      );
      return await this.stockPriceRepository.update(_id, stockPrice);
    } catch (error) {
      this.logger.error(
        `Error updating stock price with ID ${_id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error updating stock price');
    }
  }

  /**
   * Deletes a stock price entry from the repository by its ID.
   *
   * @param _id - The ID of the stock price to delete.
   * @returns A promise that resolves to the deleted StockPrice object.
   * @throws {BadRequestException} If the _id parameter is missing.
   * @throws {InternalServerErrorException} If an error occurs during deletion.
   */
  async deleteStockPrice(_id: string): Promise<StockPrice> {
    try {
      if(!_id)
        throw new BadRequestException('Missing required path parameter: _id');


      this.logger.log(`Deleting stock price with ID ${_id}`);
      return await this.stockPriceRepository.delete(_id);
    } catch (error) {
      this.logger.error(
        `Error deleting stock price with ID ${_id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error deleting stock price');
    }
  }

  /**
   * Deletes multiple stock prices based on the provided IDs.
   *
   * @param {string[]} ids - An array of stock price IDs to be deleted.
   * @returns {Promise<any>} A promise that resolves when the deletion is complete.
   * @throws {BadRequestException} If the `ids` parameter is missing or empty.
   * @throws {InternalServerErrorException} If an error occurs during the deletion process.
   */
  async deleteManyStockPrices(ids: string[]): Promise<any> {
    try {
      if (!ids || ids.length === 0) 
        throw new BadRequestException('Missing required path parameter: ids');
      
      this.logger.log(`Deleting stock prices with IDs ${ids}`);
      return await this.stockPriceRepository.deleteMany(ids);
    } catch (error) {
      this.logger.error(
        `Error deleting stock prices with IDs ${ids}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error deleting stock prices');
    }
  }
}

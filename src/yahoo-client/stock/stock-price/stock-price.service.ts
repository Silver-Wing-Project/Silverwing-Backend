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

@Injectable()
export class StockPriceService {
  private readonly logger = new Logger(StockPriceService.name);

  constructor(private readonly stockPriceRepository: StockPriceRepository) {}

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

  async createManyStockPrices(
    createStockPriceDtos: CreateStockPriceDto[],
  ): Promise<StockPrice[]> {
    try {
      if(!Array.isArray(createStockPriceDtos)) {
        createStockPriceDtos = [createStockPriceDtos];
      }
  
      const stockPrices = createStockPriceDtos.map((dto) =>
        plainToClass(StockPrice, dto),
      );
      // this.logger.log(
      //   'Creating multiple stock prices',
      //   JSON.stringify(stockPrices),
      // );
      return await this.stockPriceRepository.createMany(stockPrices);
    } catch (error) {
      this.logger.error('Error creating multiple stock prices', error.stack);
      throw new InternalServerErrorException(
        'Error creating multiple stock prices',
      );
    }
  }

  async findAllStockPrices(): Promise<StockPrice[]> {
    try {
      this.logger.log('Finding all stock prices');
      return await this.stockPriceRepository.findAll();
    } catch (error) {
      this.logger.error('Error finding all stock prices', error.stack);
      throw new InternalServerErrorException('Error finding all stock prices');
    }
  }

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
          $gte: startDate,
          $lte: endDate,
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

  async findStockPriceById(_id: string): Promise<StockPrice> {
    try {
      if (!_id) 
        throw new BadRequestException('Missing required path parameter: _id ');

      this.logger.log(`Finding stock price by ID: ${_id}`);
      const stockPrice = await this.stockPriceRepository.findOne(_id);
      if (!stockPrice) {
        throw new NotFoundException(`Stock price with ID: ${_id} not found`);
      }
      return stockPrice;
    } catch (error) {
      this.logger.error(`Error finding stock price by ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error finding stock price by ID');
    }
  }

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

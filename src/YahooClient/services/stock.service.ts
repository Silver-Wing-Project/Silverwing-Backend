import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { StockPriceRepository } from '../repositories/stock-price.repository';
import { StockReportRepository } from '../repositories/stock-report.repository';
import { CreateStockPriceDto } from '../dto/create-stock-price.dto';
import { CreateStockReportDto } from '../dto/create-stock-report.dto';
import { UpdateStockPriceDto } from '../dto/update-stock-price.dto';
import { UpdateStockReportDto } from '../dto/update-stock-report.dto';
import { plainToClass } from 'class-transformer';
import { StockPrice } from '../schemas/stock-price.schema';
import { StockReport } from '../schemas/stock-report.schema';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    private readonly stockPriceRepository: StockPriceRepository,
    private readonly stockReportRepository: StockReportRepository,
  ) {}

  async createStockPrice(createStockPriceDto: CreateStockPriceDto): Promise<StockPrice> {
    try{
      const stockPrice = plainToClass(StockPrice, createStockPriceDto);
      this.logger.log('Creating a new stock price', JSON.stringify(stockPrice));
      return await this.stockPriceRepository.create(stockPrice);
    } catch (error) {
      this.logger.error('Error creating stock price', error.stack);
      throw new InternalServerErrorException('Error creating stock price');
    }
  }

  async createStockReport(createStockReportDto: CreateStockReportDto): Promise<StockReport> {
    try{
      const stockReport = plainToClass(StockReport, createStockReportDto);
      this.logger.log('Creating a new stock report', JSON.stringify(stockReport));
      return await this.stockReportRepository.create(stockReport);
    } catch (error) {
      this.logger.error('Error creating stock report', error.stack);
      throw new InternalServerErrorException('Error creating stock report');
    }
  }

  async findAllStockPrices(): Promise<StockPrice[]> {
    try{
      this.logger.log('Finding all stock prices');
      return await this.stockPriceRepository.findAll();
    } catch (error) {
      this.logger.error('Error finding all stock prices', error.stack);
      throw new InternalServerErrorException('Error finding all stock prices');
    }
  }

  async findAllStockReports(): Promise<StockReport[]> {
    try{
      this.logger.log('Finding all stock reports');
      return await this.stockReportRepository.findAll();
    } catch (error) {
      this.logger.error('Error finding all stock reports', error.stack);
      throw new InternalServerErrorException('Error finding all stock reports');
    }
  }

  async findStockPriceById(_id: string): Promise<StockPrice> {
    try{
      this.logger.log(`Finding stock price by ID: ${_id}`);
      const stockPrice = await this.stockPriceRepository.findOne(_id);
      if(!stockPrice) {
        throw new NotFoundException(`Stock price with ID: ${_id} not found`);
      }
      return stockPrice;
    } catch (error) {
      this.logger.error(`Error finding stock price by ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error finding stock price by ID');
    }
  }

  async findStockReportById(_id: string): Promise<StockReport> {
    try{
      this.logger.log(`Fetching stock report with ID ${_id}`);
      const stockReport = await this.stockReportRepository.findOne(_id);
      if(!stockReport) {
        throw new NotFoundException(`Stock report with ID: ${_id} not found`);
      }
      return stockReport;
    } catch (error) {
      this.logger.error(`Error finding stock report by ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error finding stock report by ID');
    }
  }

  async updateStockPrice(_id: string, updateStockPriceDto: UpdateStockPriceDto): Promise<StockPrice> {
    try{
      const stockPrice = plainToClass(StockPrice, updateStockPriceDto);
      this.logger.log(`Updating stock price with ID ${_id}`, JSON.stringify(stockPrice));
      return await this.stockPriceRepository.update(_id, stockPrice);
    } catch (error) {
      this.logger.error(`Error updating stock price with ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error updating stock price');
    }
  }

  async updateStockReport(_id: string, updateStockReportDto: UpdateStockReportDto): Promise<StockReport> {
    try{
      const stockReport = plainToClass(StockReport, updateStockReportDto);
      this.logger.log(`Updating stock report with ID ${_id}`, JSON.stringify(stockReport));
      return await this.stockReportRepository.update(_id, stockReport);
    } catch (error) {
      this.logger.error(`Error updating stock report with ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error updating stock report');
    }
  }

  async deleteStockPrice(_id: string): Promise<StockPrice> {
    try{
      this.logger.log(`Deleting stock price with ID ${_id}`);
      return await this.stockPriceRepository.delete(_id);
    } catch (error) {
      this.logger.error(`Error deleting stock price with ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error deleting stock price');
    }
  }

  async deleteStockReport(_id: string): Promise<StockReport> {
    try{
      this.logger.log(`Deleting stock report with ID ${_id}`);
      return await this.stockReportRepository.delete(_id);
    } catch (error) {
      this.logger.error(`Error deleting stock report with ID ${_id}`, error.stack);
      throw new InternalServerErrorException('Error deleting stock report');
    }
  }
}
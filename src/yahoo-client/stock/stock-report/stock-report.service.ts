import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { StockReportRepository } from './repositories/stock-report.repository';
import { CreateStockReportDto } from './dto/create-stock-report.dto';
import { UpdateStockReportDto } from './dto/update-stock-report.dto';
import { StockReport } from './entities/stock-report.schema';
import { plainToClass } from 'class-transformer';

@Injectable()
export class StockReportService {
  private readonly logger = new Logger(StockReportService.name);

  constructor(private readonly stockReportRepository: StockReportRepository) {}

  async createStockReport(
    createStockReportDto: CreateStockReportDto,
  ): Promise<StockReport> {
    try {
      if (!createStockReportDto) 
        throw new BadRequestException(
          'Missing required body parameter: createStockReportDto',
        );
        
      const stockReport = plainToClass(StockReport, createStockReportDto);
      this.logger.log(
        'Creating a new stock report',
        JSON.stringify(stockReport),
      );
      return await this.stockReportRepository.create(stockReport);
    } catch (error) {
      this.logger.error('Error creating stock report', error.stack);
      throw new InternalServerErrorException('Error creating stock report');
    }
  }

  async createManyStockReports(
    createStockReportDtos: CreateStockReportDto[],
  ): Promise<StockReport[]> {
    try {
      if (!Array.isArray(createStockReportDtos)) {
        createStockReportDtos = [createStockReportDtos];
      }

      const stockReports = createStockReportDtos.map((dto) =>
        plainToClass(StockReport, dto),
      );
      // this.logger.log(
      //   'Creating multiple stock reports',
      //   JSON.stringify(stockReports),
      // );
      return await this.stockReportRepository.createMany(stockReports);
    } catch (error) {
      this.logger.error('Error creating multiple stock reports', error.stack);
      throw new InternalServerErrorException(
        'Error creating multiple stock reports',
      );
    }
  }

  async findAllStockReports(): Promise<StockReport[]> {
    try {
      this.logger.log('Finding all stock reports');
      return await this.stockReportRepository.findAll();
    } catch (error) {
      this.logger.error('Error finding all stock reports', error.stack);
      throw new InternalServerErrorException('Error finding all stock reports');
    }
  }

  async findManyStockReports(
    ticker: string,
    reportType: string,
  ): Promise<StockReport[]> {
    try {
      if (!ticker || !reportType) {
        throw new BadRequestException(
          'Missing required query parameters: ticker, reportType',
        );
      }
      this.logger.log(
        `Finding multiple stock reports with ticker: ${ticker}, reportType: ${reportType}`,
      );
      const existingReports = await this.stockReportRepository.findMany({
        ticker,
        reportType,
      });
      if (!existingReports) {
        throw new NotFoundException(
          `Stock reports with ticker: ${ticker}, reportType: ${reportType} not found`,
        );
      }
      return existingReports;
    } catch (error) {
      this.logger.error('Error finding multiple stock reports', error.stack);
      throw new InternalServerErrorException(
        'Error finding multiple stock reports',
      );
    }
  }

  async findStockReportById(_id: string): Promise<StockReport> {
    try {
      if (!_id) 
        throw new BadRequestException('Missing required query parameter: _id');
      
      this.logger.log(`Fetching stock report with ID ${_id}`);
      const stockReport = await this.stockReportRepository.findOne(_id);
      if (!stockReport) {
        throw new NotFoundException(`Stock report with ID: ${_id} not found`);
      }
      return stockReport;
    } catch (error) {
      this.logger.error(`Error finding stock report by ID ${_id}`, error.stack);
      throw new InternalServerErrorException(
        'Error finding stock report by ID',
      );
    }
  }

  async updateStockReport(
    _id: string,
    updateStockReportDto: UpdateStockReportDto,
  ): Promise<StockReport> {
    try {
      if (!_id || !updateStockReportDto) {
        throw new BadRequestException(
          'Missing required path parameter: _id or body parameter: updateStockReportDto',
        );
      }

      const stockReport = plainToClass(StockReport, updateStockReportDto);
      this.logger.log(
        `Updating stock report with ID ${_id}`,
        JSON.stringify(stockReport),
      );
      return await this.stockReportRepository.update(_id, stockReport);
    } catch (error) {
      this.logger.error(
        `Error updating stock report with ID ${_id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error updating stock report');
    }
  }

  async deleteStockReport(_id: string): Promise<any> {
    try {
      if (!_id) 
        throw new BadRequestException('Missing required path parameter: _id');

      this.logger.log(`Deleting stock report with ID ${_id}`);
      return await this.stockReportRepository.delete(_id);
    } catch (error) {
      this.logger.error(
        `Error deleting stock report with ID ${_id}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error deleting stock report');
    }
  }

  async deleteManyStockReports(ids: string[]): Promise<any> {
    try {
      if (!ids || ids.length === 0)
        throw new BadRequestException('Missing required path parameter: ids');

      this.logger.log(`Deleting multiple stock reports with IDs ${ids}`);
      return await this.stockReportRepository.deleteMany(ids);
    } catch (error) {
      this.logger.error(
        `Error deleting multiple stock reports with IDs ${ids}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Error deleting multiple stock reports',
      );
    }
  }
}

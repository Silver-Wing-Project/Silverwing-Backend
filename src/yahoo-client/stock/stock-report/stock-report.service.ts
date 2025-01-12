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
import { parseDate } from '../../utility/date-parser/date-parser.utils';
import { errorMessages } from '../../utility/constants/constants';
import { ServiceErrorHandler } from '../utils/service-error.handler';

@Injectable()
export class StockReportService {
  private readonly logger = new Logger(StockReportService.name);
  private readonly serviceErrorHandler: ServiceErrorHandler;

  constructor(
    private readonly stockReportRepository: StockReportRepository
  ) {
    this.serviceErrorHandler = new ServiceErrorHandler(this.logger);
  }

  /**
   * Creates a new stock report.
   * 
   * @param {CreateStockReportDto} createStockReportDto - The data transfer object containing the details of the stock report to be created.
   * @returns {Promise<StockReport>} A promise that resolves to the created stock report.
   * 
   * @throws {BadRequestException} If the createStockReportDto is not provided.
   * @throws {InternalServerErrorException} If there is an error creating the stock report.
   */
  async createStockReport(
    createStockReportDto: CreateStockReportDto,
  ): Promise<StockReport> {
    try {
      if (!createStockReportDto) 
        return this.serviceErrorHandler.handleBusinessError(
      new BadRequestException(errorMessages.MISSING_CREATE_STOCK_REPORT_DTO),
      'createStockReport',
      errorMessages.FAILED_TO_CREATE_STOCK_REPORT
    );
        
      const stockReport = plainToClass(StockReport, createStockReportDto);
      this.logger.log(
        'Creating a new stock report',
        JSON.stringify(stockReport),
      );
      return await this.stockReportRepository.create(stockReport);
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'createStockReport',
        errorMessages.FAILED_TO_CREATE_STOCK_REPORT
      );
    }
  }

  /**
   * Creates multiple stock reports.
   *
   * @param {CreateStockReportDto[]} createStockReportDtos - An array of DTOs for creating stock reports.
   * @returns {Promise<StockReport[]>} A promise that resolves to an array of created stock reports.
   * 
   * @throws {InternalServerErrorException} If there is an error during the creation of stock reports.
   */
  async createManyStockReports(
    createStockReportDtos: CreateStockReportDto[],
  ): Promise<StockReport[]> {
    try {
      if (!Array.isArray(createStockReportDtos)) {
        createStockReportDtos = [createStockReportDtos];
      }

      const stockReports = createStockReportDtos.map((dto) => {
        const stockReport = plainToClass(StockReport, dto);
        stockReport.date = parseDate(stockReport.date);
        return stockReport;
      });
      return await this.stockReportRepository.createMany(stockReports);
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'createManyStockReports',
        errorMessages.FAILED_TO_CREATE_MANY_STOCK_REPORTS
      );
    }
  }

  /**
   * Retrieves all stock reports from the repository.
   *
   * @returns {Promise<StockReport[]>} A promise that resolves to an array of StockReport objects.
   * @throws {InternalServerErrorException} If an error occurs while retrieving the stock reports.
   */
  async findAllStockReports(): Promise<StockReport[]> {
    try {
      this.logger.log('Retrieving all stock reports');

      const stockReports = await this.stockReportRepository.findAll();
      stockReports.forEach((report) => (report.date = parseDate(report.date)));
      
      return stockReports;
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'findAllStockReports',
        errorMessages.FAILED_TO_GET_ALL_STOCK_REPORTS
      );
    }
  }

  /**
   * Finds multiple stock reports based on the provided ticker and report type.
   *
   * @param {string} ticker - The stock ticker symbol.
   * @param {string} reportType - The type of the stock report.
   * @returns {Promise<StockReport[]>} A promise that resolves to an array of StockReport objects.
   * @throws {BadRequestException} If the ticker or reportType is missing.
   * @throws {NotFoundException} If no stock reports are found for the given ticker and reportType.
   * @throws {InternalServerErrorException} If an error occurs while finding the stock reports.
   */
  async findManyStockReports(
    ticker: string,
    reportType: string,
  ): Promise<StockReport[]> {
    try {
      if (!ticker || !reportType) {
        throw new BadRequestException(errorMessages.MISSING_QUERY_PARAMS_REPORT);
      }

      this.logger.log(
        `Finding multiple stock reports with ticker: ${ticker}, reportType: ${reportType}`,
      );

      const existingReports = await this.stockReportRepository.findMany({
        ticker,
        reportType,
      });

      if (!existingReports) {
        throw new NotFoundException(errorMessages.FAILED_TO_GET_MANY_STOCK_REPORTS);
      }

      existingReports.forEach((report) => (report.date = parseDate(report.date)));
      return existingReports;
    } catch (error) {
      return this.serviceErrorHandler.handleBusinessError(
        error,
        'findManyStockReports',
        errorMessages.FAILED_TO_GET_MANY_STOCK_REPORTS
      );
    }
  }

  /**
   * Finds a stock report by its ID.
   *
   * @param _id - The ID of the stock report to find.
   * @returns A promise that resolves to the found StockReport.
   * @throws {BadRequestException} If the _id parameter is missing.
   * @throws {NotFoundException} If no stock report is found with the given ID.
   * @throws {InternalServerErrorException} If an error occurs while finding the stock report.
   */
  async findStockReportById(_id: string): Promise<StockReport> {
    try {
      if (!_id) 
        throw new BadRequestException(errorMessages.MISSING_ID_PARAM);
      
      this.logger.log(`Fetching stock report with ID ${_id}`);
      const stockReport = await this.stockReportRepository.findOne(_id);
      if (!stockReport) {
        throw new NotFoundException(errorMessages.FAILED_TO_GET_STOCK_REPORT_BY_ID);
      }
      stockReport.date = parseDate(stockReport.date);
      return stockReport;
    } catch (error) {
      this.logger.error(`Error finding stock report by ID ${_id}`, error.stack);
      switch (true) {
        case error instanceof BadRequestException:
          throw error;
        case error instanceof NotFoundException:
          throw error;
        default:
          throw new InternalServerErrorException(errorMessages.FAILED_TO_GET_STOCK_REPORT_BY_ID);
      }
    }
  }

  /**
   * Updates an existing stock report with the provided data.
   *
   * @param _id - The unique identifier of the stock report to update.
   * @param updateStockReportDto - The data transfer object containing the updated stock report information.
   * @returns A promise that resolves to the updated stock report.
   * @throws {BadRequestException} If the _id or updateStockReportDto is missing.
   * @throws {InternalServerErrorException} If an error occurs while updating the stock report.
   */
  async updateStockReport(
    _id: string,
    updateStockReportDto: UpdateStockReportDto,
  ): Promise<StockReport> {
    try {
      if (!_id || !updateStockReportDto) {
        throw new BadRequestException(
          errorMessages.MISSING_UPDATE_STOCK_REPORT_DTO,
        );
      }

      const stockReport = plainToClass(StockReport, updateStockReportDto);
      stockReport.date = parseDate(stockReport.date);
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(errorMessages.FAILED_TO_UPDATE_STOCK_REPORT);
    }
  }

  /**
   * Deletes a stock report by its ID.
   *
   * @param _id - The ID of the stock report to delete.
   * @returns A promise that resolves to the result of the delete operation.
   * @throws {BadRequestException} If the _id parameter is missing.
   * @throws {InternalServerErrorException} If an error occurs during the delete operation.
   */
  async deleteStockReport(_id: string): Promise<any> {
    try {
      if (!_id) 
        throw new BadRequestException(errorMessages.MISSING_ID_PARAM);

      this.logger.log(`Deleting stock report with ID ${_id}`);
      return await this.stockReportRepository.delete(_id);
    } catch (error) {
      this.logger.error(
        `Error deleting stock report with ID ${_id}`,
        error.stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(errorMessages.FAILED_TO_DELETE_STOCK_REPORT);
    }
  }

  /**
   * Deletes multiple stock reports based on the provided IDs.
   *
   * @param {string[]} ids - An array of stock report IDs to be deleted.
   * @returns {Promise<any>} A promise that resolves when the deletion is complete.
   * @throws {BadRequestException} If the `ids` array is missing or empty.
   * @throws {InternalServerErrorException} If an error occurs during the deletion process.
   */
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(errorMessages.FAILED_TO_DELETE_MANY_STOCK_REPORTS);
    }
  }
}

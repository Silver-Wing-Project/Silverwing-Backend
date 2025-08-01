import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockReport, StockReportDocument } from '../entities/stock-report.schema';
import { parseDate } from '@utility/date-parser/date-parser.utils';

@Injectable()
export class StockReportRepository {
  /**
   * Creates an instance of StockReportRepository.
   *
   * @param stockReportModel - The injected Mongoose model for StockReportDocument.
   */
  constructor(
    @InjectModel(StockReport.name)
    private stockReportModel: Model<StockReportDocument>,
  ) {}

  /**
   * Creates a new stock report.
   *
   * @param {StockReport} stockReport - The stock report to create.
   * @returns {Promise<StockReport>} A promise that resolves to the created stock report.
   */
  async create(stockReport: StockReport): Promise<StockReport> {
    stockReport.date = parseDate(stockReport.date);
    const createdStockReport = new this.stockReportModel(stockReport);
    return createdStockReport.save();
  }

  /**
   * Inserts multiple stock reports into the database.
   *
   * @param {StockReport[]} stockReports - An array of stock reports to be inserted.
   * @returns {Promise<StockReport[]>} A promise that resolves to the inserted stock reports.
   */
  async createMany(stockReports: StockReport[]): Promise<StockReport[]> {
    stockReports.forEach((stockReport) => {
      stockReport.date = parseDate(stockReport.date);
    });
    return this.stockReportModel.insertMany(stockReports);
  }

  /**
   * Retrieves all stock reports from the database.
   *
   * @returns {Promise<StockReport[]>} A promise that resolves to an array of StockReport objects.
   */
  async findAll(): Promise<StockReport[]> {
    return this.stockReportModel.find().exec();
  }

  /**
   * Finds and returns multiple stock reports based on the provided query.
   *
   * @param query - The query object used to filter the stock reports.
   * @returns A promise that resolves to an array of StockReport objects.
   */
  async findMany(query: any): Promise<StockReport[]> {
    return this.stockReportModel.find(query).exec();
  }

  /**
   * Finds a single stock report by its ID.
   *
   * @param {string} id - The ID of the stock report to find.
   * @returns {Promise<StockReport>} A promise that resolves to the found stock report.
   */
  async findOne(id: string): Promise<StockReport> {
    return this.stockReportModel.findById(id).exec();
  }
}

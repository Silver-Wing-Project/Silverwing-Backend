import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StockReport,
  StockReportDocument,
} from '../entities/stock-report.schema';

@Injectable()
export class StockReportRepository {
  constructor(
    @InjectModel(StockReport.name)
    private stockReportModel: Model<StockReportDocument>,
  ) {}

  async create(stockReport: StockReport): Promise<StockReport> {
    const createdStockReport = new this.stockReportModel(stockReport);
    return createdStockReport.save();
  }

  async createMany(stockReports: StockReport[]): Promise<StockReport[]> {
    return this.stockReportModel.insertMany(stockReports);
  }

  async findAll(): Promise<StockReport[]> {
    return this.stockReportModel.find().exec();
  }

  async findMany(query: any): Promise<StockReport[]> {
    return this.stockReportModel.find(query).exec();
  }

  async findOne(id: string): Promise<StockReport> {
    return this.stockReportModel.findById(id).exec();
  }

  async update(id: string, stockReport: StockReport): Promise<StockReport> {
    return this.stockReportModel
      .findByIdAndUpdate(id, stockReport, { new: true })
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.stockReportModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(ids: string[]): Promise<any> {
    return this.stockReportModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockReport, StockReportDocument } from '../schemas/stock-report.schema';

@Injectable()
export class StockReportRepository {
  constructor(@InjectModel(StockReport.name) private stockReportModel: Model<StockReportDocument>) {}

  async create(stockReport: StockReport): Promise<StockReport> {
    const createdStockReport = new this.stockReportModel(stockReport);
    return createdStockReport.save();
  }

  async findAll(): Promise<StockReport[]> {
    return this.stockReportModel.find().exec();
  }

  async findOne(id: string): Promise<StockReport> {
    return this.stockReportModel.findById(id).exec();
  }

  async update(id: string, stockReport: StockReport): Promise<StockReport> {
    return this.stockReportModel.findByIdAndUpdate(id, stockReport, { new: true }).exec();
  }

  async delete(id: string): Promise<StockReport> {
    return this.stockReportModel.findByIdAndDelete(id).exec();
  }
}
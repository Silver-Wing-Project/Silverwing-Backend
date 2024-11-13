import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/stock-price.schema';
import { StockReport, StockReportDocument } from '../schemas/stock-report.schema';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(StockPrice.name) private stockPriceModel: Model<StockPriceDocument>,
    @InjectModel(StockReport.name) private stockReportModel: Model<StockReportDocument>,
  ) {}

  async createStockPrice(stockPrice: StockPrice): Promise<StockPrice> {
    const createdStockPrice = new this.stockPriceModel(stockPrice);
    return createdStockPrice.save();
  }

  async createStockReport(stockReport: StockReport): Promise<StockReport> {
    const createdStockReport = new this.stockReportModel(stockReport);
    return createdStockReport.save();
  }

  // Add more methods to interact with the database as needed
}
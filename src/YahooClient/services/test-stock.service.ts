import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/stock-price.schema';
import { StockReport, StockReportDocument } from '../schemas/stock-report.schema';

@Injectable()
export class TestStockService {
  constructor(
    @InjectModel(StockPrice.name) private stockPriceModel: Model<StockPriceDocument>,
    @InjectModel(StockReport.name) private stockReportModel: Model<StockReportDocument>,
  ) {}

  async createTestStockPrice(): Promise<StockPrice> {
    const stockPrice = new this.stockPriceModel({
      ticker: 'AAPL',
      date: new Date(),
      open: 150,
      close: 155,
      high: 157,
      low: 149,
      volume: 1000000,
    });
    return stockPrice.save();
  }

  async createTestStockReport(): Promise<StockReport> {
    const stockReport = new this.stockReportModel({
      ticker: 'AAPL',
      date: new Date(),
      reportType: 'financials',
      content: 'This is a test financial report.',
    });
    return stockReport.save();
  }
}
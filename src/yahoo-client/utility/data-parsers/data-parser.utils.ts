import { CreateStockPriceDto } from '../../stock/stock-price/dto/create-stock-price.dto';
import { CreateStockReportDto } from '../../stock/stock-report/dto/create-stock-report.dto';
import mongoose from 'mongoose';

export function parseStockPricesData(stockPricesData: any[]): CreateStockPriceDto[] {
  return stockPricesData.map((data: any) => ({
    _id: new mongoose.Types.ObjectId().toString(),
    ticker: data.ticker,
    date: new Date(data.date),
    open: data.open,
    close: data.close,
    high: data.high,
    low: data.low,
    volume: data.volume,
  }));
}

export function parseStockReportsData(stockReportsData: any): CreateStockReportDto[] {
  return [{
        _id: new mongoose.Types.ObjectId().toString(),
        ticker: stockReportsData.ticker,
        date: new Date(stockReportsData.date),
        reportType: stockReportsData.report_type,
        content: stockReportsData.content,
    }];
}
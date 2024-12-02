import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '../schemas/stock-price.schema';

@Injectable()
export class StockPriceRepository {
  constructor(@InjectModel(StockPrice.name) private stockPriceModel: Model<StockPriceDocument>) {}

  async create(stockPrice: StockPrice): Promise<StockPrice> {
    const createdStockPrice = new this.stockPriceModel(stockPrice);
    return createdStockPrice.save();
  }

  async createMany(stockPrices: StockPrice[]): Promise<StockPrice[]> {
    return this.stockPriceModel.insertMany(stockPrices);
  }

  async findAll(): Promise<StockPrice[]> {
    return this.stockPriceModel.find().exec();
  }

  async findMany(query: any): Promise<StockPrice[]> {
    return this.stockPriceModel.find(query).exec();
  }

  async findOne(id: string): Promise<StockPrice> {
    return this.stockPriceModel.findById(id).exec();
  }

  async update(id: string, stockPrice: StockPrice): Promise<StockPrice> {
    return this.stockPriceModel.findByIdAndUpdate(id, stockPrice, { new: true }).exec();
  }

  async delete(id: string): Promise<StockPrice> {
    return this.stockPriceModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(stockPrices: StockPrice[]): Promise<any> {
    return this.stockPriceModel.deleteMany(stockPrices).exec();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockPrice, StockPriceDocument } from '@/future/stock-price/entities/stock-price.schema';
import { parseDate } from '@utility/date-parser/date-parser.utils';

@Injectable()
export class StockPriceRepository {
  /**
   * Creates an instance of StockPriceRepository.
   *
   * @param stockPriceModel - The injected Mongoose model for StockPrice documents.
   */
  constructor(
    @InjectModel(StockPrice.name)
    private stockPriceModel: Model<StockPriceDocument>,
  ) {}

  /**
   * Creates a new stock price entry in the database.
   *
   * @param {StockPrice} stockPrice - The stock price data to be created.
   * @returns {Promise<StockPrice>} A promise that resolves to the created stock price.
   */
  async create(stockPrice: StockPrice): Promise<StockPrice> {
    stockPrice.date = parseDate(stockPrice.date);
    const createdStockPrice = new this.stockPriceModel(stockPrice);
    return createdStockPrice.save();
  }

  /**
   * Inserts multiple stock price records into the database.
   *
   * @param {StockPrice[]} stockPrices - An array of stock price objects to be inserted.
   * @returns {Promise<StockPrice[]>} A promise that resolves to the inserted stock price objects.
   */
  async createMany(stockPrices: StockPrice[]): Promise<StockPrice[]> {
    stockPrices.forEach((stockPrice) => {
      stockPrice.date = parseDate(stockPrice.date);
    });
    return this.stockPriceModel.insertMany(stockPrices);
  }

  /**
   * Retrieves all stock prices from the database.
   *
   * @returns {Promise<StockPrice[]>} A promise that resolves to an array of StockPrice objects.
   */
  async findAll(): Promise<StockPrice[]> {
    return this.stockPriceModel.find().exec();
  }

  /**
   * Finds multiple stock prices based on the provided query.
   *
   * @param query - The query object to filter the stock prices.
   * @returns A promise that resolves to an array of StockPrice objects.
   */
  async findMany(query: any): Promise<StockPrice[]> {
    return this.stockPriceModel.find(query).exec();
  }

  /**
   * Finds a single stock price by its ID.
   *
   * @param {string} id - The ID of the stock price to find.
   * @returns {Promise<StockPrice>} A promise that resolves to the found stock price.
   */
  async findOne(id: string): Promise<StockPrice> {
    return this.stockPriceModel.findById(id).exec();
  }
}

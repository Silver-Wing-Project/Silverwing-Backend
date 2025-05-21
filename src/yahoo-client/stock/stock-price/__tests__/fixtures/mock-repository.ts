import { Model } from 'mongoose';
import { StockPriceRepository } from '../../repositories/stock-price.repository';
import { StockPrice, StockPriceDocument } from '../../entities/stock-price.schema';

export type MockStockPriceRepository = {
  [K in keyof StockPriceRepository]: jest.Mock;
} & {
  stockPriceModel: Model<StockPriceDocument>;
};

export const createMockRepository = (): MockStockPriceRepository => ({
  stockPriceModel: {} as Model<StockPriceDocument>,
  create: jest.fn(),
  createMany: jest.fn(),
  findAll: jest.fn(),
  findMany: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
});

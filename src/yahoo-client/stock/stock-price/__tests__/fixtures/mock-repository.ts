import { Model } from 'mongoose';
import { StockPriceRepository } from '@stock-price/repositories/stock-price.repository';
import { StockPriceDocument } from '@stock-price/entities/stock-price.schema';

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

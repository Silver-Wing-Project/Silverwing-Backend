import { Model } from 'mongoose';
import { StockReportRepository } from '@stock-report/repositories/stock-report.repository';
import { StockReportDocument } from '@stock-report/entities/stock-report.schema';

export type MockStockReportRepository = {
  [K in keyof StockReportRepository]: jest.Mock;
} & {
  stockReportModel: Model<StockReportDocument>;
};

export const createMockRepository = (): MockStockReportRepository => ({
  stockReportModel: {} as Model<StockReportDocument>,
  create: jest.fn(),
  createMany: jest.fn(),
  findAll: jest.fn(),
  findMany: jest.fn(),
  findOne: jest.fn(),
});

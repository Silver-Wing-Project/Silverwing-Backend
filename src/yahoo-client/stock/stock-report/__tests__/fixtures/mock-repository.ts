import { Model } from 'mongoose';
import { StockReportRepository } from '../../repositories/stock-report.repository';
import { StockReport, StockReportDocument } from '../../entities/stock-report.schema';

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
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
});

import { Test, TestingModule } from '@nestjs/testing';
import { StockReportRepository } from '../stock-report/repositories/stock-report.repository';
import { StockReport } from '../stock-report/entities/stock-report.schema';
import { parseDate } from '../../utility/date-parser/date-parser.utils';

describe('StockReportRepository', () => {
  let stockReportRepository: StockReportRepository;

  const mockStockReport: StockReport = {
    _id: '507f1f77bcf86cd799439011',
    ticker: 'AAPL',
    date: parseDate('2021-01-01'),
    reportType: 'Annual',
    content: { summary: 'Annual report content' },
  };

  const mockStockReports: StockReport[] = [
    mockStockReport,
    { ...mockStockReport, _id: '507f1f77bcf86cd799439012' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StockReportRepository,
          useValue: {
            create: jest.fn(),
            createMany: jest.fn(),
            findAll: jest.fn(),
            findMany: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    stockReportRepository = module.get<StockReportRepository>(
      StockReportRepository,
    );
  });

  it('should be defined', () => {
    expect(stockReportRepository).toBeDefined();
  });

  it('should create stock report object successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'create')
      .mockResolvedValueOnce(mockStockReport);

    const result = await stockReportRepository.create(mockStockReport);
    expect(result).toEqual(mockStockReport);
    expect(stockReportRepository.create).toHaveBeenCalledWith(mockStockReport);
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should create multiple stock report objects successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'createMany')
      .mockResolvedValueOnce(mockStockReports);

    const result = await stockReportRepository.createMany(mockStockReports);
    expect(result).toEqual(mockStockReports);
    expect(stockReportRepository.createMany).toHaveBeenCalledWith(
      mockStockReports,
    );
  });

  it('should find all stock report objects successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'findAll')
      .mockResolvedValueOnce(mockStockReports);

    const result = await stockReportRepository.findAll();
    expect(result).toEqual(mockStockReports);
    expect(stockReportRepository.findAll).toHaveBeenCalled();
  });

  it('should find stock report objects by query successfully', async () => {
    const query = { ticker: 'AAPL' };
    jest
      .spyOn(stockReportRepository, 'findMany')
      .mockResolvedValueOnce(mockStockReports);

    const result = await stockReportRepository.findMany(query);
    expect(result).toEqual(mockStockReports);
    expect(stockReportRepository.findMany).toHaveBeenCalledWith(query);
  });

  it('should find stock report object successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'create')
      .mockResolvedValueOnce(mockStockReport);
    jest
      .spyOn(stockReportRepository, 'findOne')
      .mockResolvedValueOnce(mockStockReport);
    await stockReportRepository.create(mockStockReport);
    const mockStockReportId = mockStockReport._id;
    const result = await stockReportRepository.findOne(mockStockReportId);
    expect(result).toEqual(mockStockReport);
    expect(stockReportRepository.findOne).toHaveBeenCalledWith(
      mockStockReportId,
    );
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should update stock report object successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'create')
      .mockResolvedValueOnce(mockStockReport);
    jest
      .spyOn(stockReportRepository, 'update')
      .mockResolvedValueOnce(mockStockReport);
    await stockReportRepository.create(mockStockReport);
    const mockStockReportId = mockStockReport._id;
    const result = await stockReportRepository.update(
      mockStockReportId,
      mockStockReport,
    );
    expect(result).toEqual(mockStockReport);
    expect(stockReportRepository.update).toHaveBeenCalledWith(
      mockStockReportId,
      mockStockReport,
    );
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should delete stock report object successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'create')
      .mockResolvedValueOnce(mockStockReport);
    jest
      .spyOn(stockReportRepository, 'delete')
      .mockResolvedValueOnce(mockStockReport);
    await stockReportRepository.create(mockStockReport);
    const mockStockReportId = mockStockReport._id;
    const result = await stockReportRepository.delete(mockStockReportId);
    expect(result).toEqual(mockStockReport);
    expect(stockReportRepository.delete).toHaveBeenCalledWith(
      mockStockReportId,
    );
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should delete multiple stock report objects successfully', async () => {
    jest
      .spyOn(stockReportRepository, 'deleteMany')
      .mockResolvedValueOnce({ deletedCount: 2 });

    const ids = mockStockReports.map((report) => report._id);
    const result = await stockReportRepository.deleteMany(ids);
    expect(result).toEqual({ deletedCount: 2 });
    expect(stockReportRepository.deleteMany).toHaveBeenCalledWith(ids);
  });
});

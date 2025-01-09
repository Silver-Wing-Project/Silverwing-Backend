import { Test, TestingModule } from '@nestjs/testing';
import { StockPriceRepository } from '../stock-price/repositories/stock-price.repository';
import { StockPrice } from '../stock-price/entities/stock-price.schema';

describe('StockPriceRepository', () => {
  let stockPriceRepository: StockPriceRepository;

  const mockStockPrice: StockPrice = {
    _id: '507f1f77bcf86cd799439011',
    ticker: 'AAPL',
    date: new Date('2021-01-01'),
    open: 100,
    high: 110,
    low: 90,
    close: 105,
    volume: 1000000,
  };

  const mockStockPrices: StockPrice[] = [
    mockStockPrice,
    { ...mockStockPrice, _id: '507f1f77bcf86cd799439012' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: StockPriceRepository,
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

    stockPriceRepository =
      module.get<StockPriceRepository>(StockPriceRepository);
  });

  it('should be defined', () => {
    expect(stockPriceRepository).toBeDefined();
  });

  it('should create stock price object successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'create')
      .mockResolvedValueOnce(mockStockPrice);

    const result = await stockPriceRepository.create(mockStockPrice);
    expect(result).toEqual(mockStockPrice);
    expect(stockPriceRepository.create).toHaveBeenCalledWith(mockStockPrice);
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should create multiple stock price objects successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'createMany')
      .mockResolvedValueOnce(mockStockPrices);

    const result = await stockPriceRepository.createMany(mockStockPrices);
    expect(result).toEqual(mockStockPrices);
    expect(stockPriceRepository.createMany).toHaveBeenCalledWith(
      mockStockPrices,
    );
  });

  it('should find all stock price objects successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'findAll')
      .mockResolvedValueOnce(mockStockPrices);

    const result = await stockPriceRepository.findAll();
    expect(result).toEqual(mockStockPrices);
    expect(stockPriceRepository.findAll).toHaveBeenCalled();
  });

  it('should find stock price objects by query successfully', async () => {
    const query = { ticker: 'AAPL' };
    jest
      .spyOn(stockPriceRepository, 'findMany')
      .mockResolvedValueOnce(mockStockPrices);

    const result = await stockPriceRepository.findMany(query);
    expect(result).toEqual(mockStockPrices);
    expect(stockPriceRepository.findMany).toHaveBeenCalledWith(query);
  });

  it('should find stock price object successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'create')
      .mockResolvedValueOnce(mockStockPrice);
    jest
      .spyOn(stockPriceRepository, 'findOne')
      .mockResolvedValueOnce(mockStockPrice);
    await stockPriceRepository.create(mockStockPrice);
    const mockStockPriceId = mockStockPrice._id;
    const result = await stockPriceRepository.findOne(mockStockPriceId);
    expect(result).toEqual(mockStockPrice);
    expect(stockPriceRepository.findOne).toHaveBeenCalledWith(mockStockPriceId);
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should update stock price object successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'create')
      .mockResolvedValueOnce(mockStockPrice);
    jest
      .spyOn(stockPriceRepository, 'update')
      .mockResolvedValueOnce(mockStockPrice);
    await stockPriceRepository.create(mockStockPrice);
    const mockStockPriceId = mockStockPrice._id;
    const result = await stockPriceRepository.update(
      mockStockPriceId,
      mockStockPrice,
    );
    expect(result).toEqual(mockStockPrice);
    expect(stockPriceRepository.update).toHaveBeenCalledWith(
      mockStockPriceId,
      mockStockPrice,
    );
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should delete stock price object successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'create')
      .mockResolvedValueOnce(mockStockPrice);
    jest
      .spyOn(stockPriceRepository, 'delete')
      .mockResolvedValueOnce(mockStockPrice);
    await stockPriceRepository.create(mockStockPrice);
    const mockStockPriceId = mockStockPrice._id;
    const result = await stockPriceRepository.delete(mockStockPriceId);
    expect(result).toEqual(mockStockPrice);
    expect(stockPriceRepository.delete).toHaveBeenCalledWith(mockStockPriceId);
    expect(result).toHaveProperty('ticker', 'AAPL');
    expect(result).toHaveProperty('date', new Date('2021-01-01'));
  });

  it('should delete multiple stock price objects successfully', async () => {
    jest
      .spyOn(stockPriceRepository, 'deleteMany')
      .mockResolvedValueOnce({ deletedCount: 2 });

    const ids = mockStockPrices.map((stockPrice) => stockPrice._id);
    const result = await stockPriceRepository.deleteMany(ids);
    expect(result).toEqual({ deletedCount: 2 });
    expect(stockPriceRepository.deleteMany).toHaveBeenCalledWith(ids);
  });
});

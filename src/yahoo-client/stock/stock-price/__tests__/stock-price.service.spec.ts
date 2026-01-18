import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StockPriceService } from '../stock-price.service';
import { StockPriceRepository } from '../repositories/stock-price.repository';
import { StockPrice } from '../entities/stock-price.schema';
import { parseDate } from '@utility/date-parser/date-parser.utils';
import { errorMessages } from '@utility/constants/constants';
import { createMockRepository } from './fixtures/mock-repository';
import { assertStockPrice, assertStockPrices } from './helpers/assertions';
import { testErrorHandling } from './helpers/error-handlers';
import { baseMockStockPrice, generateMockStockPrices } from './fixtures/mock-stock-prices';

describe('StockPriceService Tests', () => {
  let service: StockPriceService;
  let repository: ReturnType<typeof createMockRepository>;

  const mockStockPrices: StockPrice[] = generateMockStockPrices(5);

  beforeEach(async () => {
    repository = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockPriceService, { provide: StockPriceRepository, useValue: repository }],
    }).compile();

    service = module.get<StockPriceService>(StockPriceService);

    // Mock logger methods to suppress logs during tests
    // jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
    // jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('Test Create Methods (C)', () => {
    it('should create a stock price', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(baseMockStockPrice);

      const result = await service.createStockPrice(baseMockStockPrice);
      assertStockPrice(result, baseMockStockPrice);
      expect(repository.create).toHaveBeenCalledWith(baseMockStockPrice);
    });

    it('should throw an error if the stock price is not created', async () => {
      jest.spyOn(repository, 'create').mockRejectedValue(new Error(errorMessages.FAILED_TO_CREATE_STOCK_PRICE));

      await expect(service.createStockPrice(baseMockStockPrice)).rejects.toThrow(
        errorMessages.FAILED_TO_CREATE_STOCK_PRICE,
      );
      expect(repository.create).toHaveBeenCalledWith(baseMockStockPrice);
    });

    it('should throw an error if createStockPriceDto is missing', async () => {
      await testErrorHandling(
        () => service.createStockPrice(null),
        BadRequestException,
        errorMessages.MISSING_CREATE_STOCK_PRICE_DTO,
        jest.spyOn(repository, 'create'),
      );
    });

    it('should create multiple stock prices', async () => {
      jest.spyOn(repository, 'createMany').mockResolvedValue(mockStockPrices);

      const result = await service.createManyStockPrices(mockStockPrices);
      assertStockPrices(result, mockStockPrices);
      expect(result).toEqual(mockStockPrices);
      expect(repository.createMany).toHaveBeenCalledWith(mockStockPrices);
    });

    it('should throw an error if the stock prices are not created', async () => {
      jest
        .spyOn(repository, 'createMany')
        .mockRejectedValue(new Error(errorMessages.FAILED_TO_CREATE_MANY_STOCK_PRICES));

      await expect(service.createManyStockPrices(mockStockPrices)).rejects.toThrow(
        errorMessages.FAILED_TO_CREATE_MANY_STOCK_PRICES,
      );
      expect(repository.createMany).toHaveBeenCalledWith(mockStockPrices);
    });
  });

  describe('Test Read Methods (R)', () => {
    describe('findAllStockPrices()', () => {
      it('should find all stock prices', async () => {
        jest.spyOn(repository, 'findAll').mockResolvedValue(mockStockPrices);

        const result = await service.findAllStockPrices();
        assertStockPrices(result, mockStockPrices);
        expect(result).toEqual(mockStockPrices);
        expect(repository.findAll).toHaveBeenCalled();
      });

      it('should throw an error if no stock prices are found with "findAll()"', async () => {
        jest.spyOn(repository, 'findAll').mockRejectedValue(new Error(errorMessages.FAILED_TO_GET_ALL_STOCK_PRICES));

        await expect(service.findAllStockPrices()).rejects.toThrow(errorMessages.FAILED_TO_GET_ALL_STOCK_PRICES);
        expect(repository.findAll).toHaveBeenCalled();
      });
    });

    describe('findManyStockPrices()', () => {
      const startDate = parseDate('2025-01-01');
      const endDate = parseDate('2025-01-10');
      const mockQuery = {
        ticker: 'AAPL',
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
      };

      it('should find many stock prices', async () => {
        jest.spyOn(repository, 'findMany').mockResolvedValue(mockStockPrices);

        const result = await service.findManyStockPrices(mockQuery.ticker, startDate, endDate);
        assertStockPrices(result, mockStockPrices);
        expect(result).toEqual(mockStockPrices);
        expect(repository.findMany).toHaveBeenCalledWith({
          ticker: mockQuery.ticker,
          date: {
            $gte: parseDate(startDate),
            $lte: parseDate(endDate),
          },
        });
      });

      it('should throw BadRequestException if query parameters are missing', async () => {
        await testErrorHandling(
          () => service.findManyStockPrices(mockQuery.ticker, null, endDate),
          BadRequestException,
          errorMessages.MISSING_QUERY_PARAMS_PRICE,
          repository.findMany,
        );
      });

      it('should throw NotFoundException if no prices found', async () => {
        jest.spyOn(repository, 'findMany').mockResolvedValue(null);
        await testErrorHandling(
          () => service.findManyStockPrices(mockQuery.ticker, startDate, endDate),
          NotFoundException,
          errorMessages.FAILED_TO_GET_MANY_STOCK_PRICES,
          null,
        );
      });

      it('should throw InternalServerErrorException for repository errors', async () => {
        const dbError = new Error('Database connection failed');
        jest.spyOn(repository, 'findMany').mockRejectedValue(dbError);
        await testErrorHandling(
          () => service.findManyStockPrices(mockQuery.ticker, startDate, endDate),
          InternalServerErrorException,
          errorMessages.FAILED_TO_GET_MANY_STOCK_PRICES,
          null,
        );
      });
    });

    describe('findStockPriceById()', () => {
      it('should find a stock price by id', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(baseMockStockPrice);

        const result = await service.findStockPriceById(baseMockStockPrice._id);
        assertStockPrice(result, baseMockStockPrice);
        expect(result).toEqual(baseMockStockPrice);
        expect(repository.findOne).toHaveBeenCalledWith(baseMockStockPrice._id);
      });

      it('should throw an error if no stock price is found with "findOne()"', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.findStockPriceById(baseMockStockPrice._id)).rejects.toThrow(
          errorMessages.FAILED_TO_GET_STOCK_PRICE_BY_ID,
        );
        expect(repository.findOne).toHaveBeenCalledWith(baseMockStockPrice._id);
      });

      it('should throw an error if stock price id is missing in findStockPriceById()', async () => {
        await expect(service.findStockPriceById(null)).rejects.toThrow(errorMessages.MISSING_ID_PARAM);
        expect(repository.findOne).not.toHaveBeenCalled();
      });
    });
  });
});

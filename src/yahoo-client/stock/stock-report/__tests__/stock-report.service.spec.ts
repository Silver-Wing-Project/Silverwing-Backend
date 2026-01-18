import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StockReportService } from '../stock-report.service';
import { StockReportRepository } from '../repositories/stock-report.repository';
import { StockReport } from '../entities/stock-report.schema';
import { errorMessages } from '@utility/constants/constants';
import { createMockRepository } from './fixtures/mock-repository';
import { assertStockReport, assertStockReports } from './helpers/assertions';
import { testErrorHandling } from './helpers/error-handlers';
import { baseMockStockReport, generateMockStockReports } from './fixtures/mock-stock-reports';

describe('StockReportService Tests', () => {
  let service: StockReportService;
  let repository: ReturnType<typeof createMockRepository>;

  const mockStockReports: StockReport[] = generateMockStockReports(5);

  beforeEach(async () => {
    repository = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockReportService, { provide: StockReportRepository, useValue: repository }],
    }).compile();

    service = module.get<StockReportService>(StockReportService);

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
    it('should create a stock report', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(baseMockStockReport);

      const result = await service.createStockReport(baseMockStockReport);
      assertStockReport(result, baseMockStockReport);
      expect(repository.create).toHaveBeenCalledWith(baseMockStockReport);
    });

    it('should throw an error if the stock report is not created', async () => {
      jest.spyOn(repository, 'create').mockRejectedValue(new Error(errorMessages.FAILED_TO_CREATE_STOCK_REPORT));

      await expect(service.createStockReport(baseMockStockReport)).rejects.toThrow(
        errorMessages.FAILED_TO_CREATE_STOCK_REPORT,
      );
      expect(repository.create).toHaveBeenCalledWith(baseMockStockReport);
    });

    it('should throw an error if createStockReportDto is missing', async () => {
      await testErrorHandling(
        () => service.createStockReport(null),
        BadRequestException,
        errorMessages.MISSING_CREATE_STOCK_REPORT_DTO,
        jest.spyOn(repository, 'create'),
      );
    });

    it('should create multiple stock reports', async () => {
      jest.spyOn(repository, 'createMany').mockResolvedValue(mockStockReports);

      const result = await service.createManyStockReports(mockStockReports);
      assertStockReports(result, mockStockReports);
      expect(result).toEqual(mockStockReports);
      expect(repository.createMany).toHaveBeenCalledWith(mockStockReports);
    });

    it('should throw an error if the stock reports are not created', async () => {
      jest
        .spyOn(repository, 'createMany')
        .mockRejectedValue(new Error(errorMessages.FAILED_TO_CREATE_MANY_STOCK_REPORTS));

      await expect(service.createManyStockReports(mockStockReports)).rejects.toThrow(
        errorMessages.FAILED_TO_CREATE_MANY_STOCK_REPORTS,
      );
      expect(repository.createMany).toHaveBeenCalledWith(mockStockReports);
    });
  });

  describe('Test Read Methods (R)', () => {
    describe('findAllStockReports()', () => {
      it('should find all stock reports', async () => {
        jest.spyOn(repository, 'findAll').mockResolvedValue(mockStockReports);

        const result = await service.findAllStockReports();
        assertStockReports(result, mockStockReports);
        expect(result).toEqual(mockStockReports);
        expect(repository.findAll).toHaveBeenCalled();
      });

      it('should throw an error if no stock reports are found with "findAll()"', async () => {
        jest.spyOn(repository, 'findAll').mockRejectedValue(new Error(errorMessages.FAILED_TO_GET_ALL_STOCK_REPORTS));

        await expect(service.findAllStockReports()).rejects.toThrow(errorMessages.FAILED_TO_GET_ALL_STOCK_REPORTS);
        expect(repository.findAll).toHaveBeenCalled();
      });
    });

    describe('findManyStockReports()', () => {
      const mockQuery = {
        ticker: 'AAPL',
        reportType: 'financials',
      };

      it('should find many stock reports', async () => {
        jest.spyOn(repository, 'findMany').mockResolvedValue(mockStockReports);

        const result = await service.findManyStockReports(mockQuery.ticker, mockQuery.reportType);
        assertStockReports(result, mockStockReports);
        expect(result).toEqual(mockStockReports);
        expect(repository.findMany).toHaveBeenCalledWith({
          ticker: mockQuery.ticker,
          reportType: mockQuery.reportType,
        });
      });

      it('should throw BadRequestException if query parameters are missing', async () => {
        await testErrorHandling(
          () => service.findManyStockReports(mockQuery.ticker, null),
          BadRequestException,
          errorMessages.MISSING_QUERY_PARAMS_REPORT,
          repository.findMany,
        );
      });

      it('should throw NotFoundException if no reports found', async () => {
        jest.spyOn(repository, 'findMany').mockResolvedValue(null);
        await testErrorHandling(
          () => service.findManyStockReports(mockQuery.ticker, mockQuery.reportType),
          NotFoundException,
          errorMessages.FAILED_TO_GET_MANY_STOCK_REPORTS,
          null,
        );
      });

      it('should throw InternalServerErrorException for repository errors', async () => {
        const dbError = new Error('Database connection failed');
        jest.spyOn(repository, 'findMany').mockRejectedValue(dbError);
        await testErrorHandling(
          () => service.findManyStockReports(mockQuery.ticker, mockQuery.reportType),
          InternalServerErrorException,
          errorMessages.FAILED_TO_GET_MANY_STOCK_REPORTS,
          null,
        );
      });
    });

    describe('findStockReportById()', () => {
      it('should find a stock report by id', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(baseMockStockReport);

        const result = await service.findStockReportById(baseMockStockReport._id);
        assertStockReport(result, baseMockStockReport);
        expect(result).toEqual(baseMockStockReport);
        expect(repository.findOne).toHaveBeenCalledWith(baseMockStockReport._id);
      });

      it('should throw an error if no stock report is found with "findOne()"', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.findStockReportById(baseMockStockReport._id)).rejects.toThrow(
          errorMessages.FAILED_TO_GET_STOCK_REPORT_BY_ID,
        );
        expect(repository.findOne).toHaveBeenCalledWith(baseMockStockReport._id);
      });

      it('should throw an error if stock report id is missing in findStockReportById()', async () => {
        await expect(service.findStockReportById(null)).rejects.toThrow(errorMessages.MISSING_ID_PARAM);
        expect(repository.findOne).not.toHaveBeenCalled();
      });
    });
  });
});

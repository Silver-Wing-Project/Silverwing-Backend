import { Test, TestingModule } from '@nestjs/testing';
import { BigFiveAnalysisService } from './big-five-analysis.service';
import { RoicCalculator } from '../domain/calculators/roic.calculator';
import { BVPSGrowthCalculator } from '../domain/calculators/bvps-growth.calculator';
import { SalesGrowthCalculator } from '../domain/calculators/sales-growth.calculator';
import { EPSGrowthCalculator } from '../domain/calculators/eps-growth.calculator';
import { FCFGrowthCalculator } from '../domain/calculators/fcf-growth.calculator';
import { StockReportService } from '@/yahoo-client/stock/stock-report/stock-report.service';
import { PythonService } from '@/yahoo-client/utility/ts-services/python.service';

describe('BigFiveAnalysisService', () => {
  let service: BigFiveAnalysisService;
  let stockReportService: StockReportService;
  let pythonService: PythonService;

  const mockCalculators = {
    roic: { calculateMostRecent: jest.fn().mockReturnValue(15) },
    growth: { calculate: jest.fn().mockReturnValue({ average: 12, tenYear: 10, fiveYear: 11, oneYear: 15 }) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BigFiveAnalysisService,
        { provide: RoicCalculator, useValue: mockCalculators.roic },
        { provide: BVPSGrowthCalculator, useValue: mockCalculators.growth },
        { provide: SalesGrowthCalculator, useValue: mockCalculators.growth },
        { provide: EPSGrowthCalculator, useValue: mockCalculators.growth },
        { provide: FCFGrowthCalculator, useValue: mockCalculators.growth },
        {
          provide: StockReportService,
          useValue: {
            createManyStockReports: jest.fn().mockResolvedValue([]),
            findManyStockReports: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: PythonService,
          useValue: {
            fetchStockReports: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<BigFiveAnalysisService>(BigFiveAnalysisService);
    stockReportService = module.get<StockReportService>(StockReportService);
    pythonService = module.get<PythonService>(PythonService);
  });

  describe('calculateBigFive', () => {
    it('should correctly identify the most recent year from keys', async () => {
      const mockData: any = {
        incomeStmt: {
          '2023-01-01': {},
          '2025-01-01': {},
          '2024-01-01': {},
        },
        balanceSheet: {},
        cashFlow: {},
      };

      const result = await service.calculateBigFive('AAPL', mockData);

      expect(result.mostRecentYear).toBe(2025);
    });

    it('should give a STRONG_BUY if all metrics are above 10%', async () => {
      const mockData: any = {
        incomeStmt: { '2025-01-01': {} },
        balanceSheet: {},
        cashFlow: {},
      };

      const result = await service.calculateBigFive('AAPL', mockData);

      expect(result.recommendation.status).toBe('STRONG_BUY');
      expect(result.recommendation.metricsPassingThreshold).toBe(5);
    });
  });

  describe('calculateBigFive - Edge Cases', () => {
    it('should return 0 as mostRecentYear if incomeStmt is empty', async () => {
      const mockData: any = {
        incomeStmt: {},
        balanceSheet: {},
        cashFlow: {},
      };

      const result = await service.calculateBigFive('AAPL', mockData);

      expect(result.mostRecentYear).toBe(0);
      expect(result.ticker).toBe('AAPL');
    });
  });

  describe('syncAndCalculate', () => {
    it('should fetch from Python, save to DB, and then call fetchAndCalculate', async () => {
      const ticker = 'GOOG';

      const fetchSpy = jest.spyOn(service, 'fetchAndCalculate').mockResolvedValue({ ticker } as any);

      await service.syncAndCalculate(ticker);

      expect(pythonService.fetchStockReports).toHaveBeenCalledTimes(3);
      expect(pythonService.fetchStockReports).toHaveBeenCalledWith(ticker, 'financials');
      expect(pythonService.fetchStockReports).toHaveBeenCalledWith(ticker, 'balance_sheet');
      expect(pythonService.fetchStockReports).toHaveBeenCalledWith(ticker, 'cash_flow');

      expect(stockReportService.createManyStockReports).toHaveBeenCalledTimes(3);

      expect(fetchSpy).toHaveBeenCalledWith(ticker);
    });
  });

  describe('fetchAndCalculate - Error States', () => {
    it('should throw an error if one of the reports is missing in DB', async () => {
      jest.spyOn(stockReportService, 'findManyStockReports').mockImplementation(async (ticker, type) => {
        if (type === 'financials') return [{ date: new Date(), content: {} }] as any;
        return [];
      });

      await expect(service.fetchAndCalculate('MSFT')).rejects.toThrow(
        /Missing reports for MSFT: Balance Sheet, Cash Flow/,
      );
    });
  });

  describe('Boundary testing', () => {
    it('should return CONSIDER status if only 3 metrics pass', async () => {
      mockCalculators.roic.calculateMostRecent.mockReturnValue(15); // PASS (1)
      mockCalculators.growth.calculate.mockReturnValueOnce({ average: 12 }); // PASS (2)
      mockCalculators.growth.calculate.mockReturnValueOnce({ average: 12 }); // PASS (3)
      mockCalculators.growth.calculate.mockReturnValueOnce({ average: 5 }); // FAIL (4)
      mockCalculators.growth.calculate.mockReturnValueOnce({ average: 5 }); // FAIL (5)

      const mockData: any = {
        incomeStmt: { '2025-01-01': {} },
        balanceSheet: {},
        cashFlow: {},
      };

      const result = await service.calculateBigFive('AAPL', mockData);

      expect(result.recommendation.status).toBe('CONSIDER');
      expect(result.recommendation.metricsPassingThreshold).toBe(3);
    });
  });

  describe('Sorting logic', () => {
    it('should pick the absolute latest report based on date', async () => {
      const olderDate = new Date('2024-01-01');
      const newerDate = new Date('2025-01-01');

      jest.spyOn(stockReportService, 'findManyStockReports').mockResolvedValue([
        { date: olderDate, content: { '2024-01-01': {} } },
        { date: newerDate, content: { '2025-01-01': {} } },
      ] as any);
      const result = await service.fetchAndCalculate('AAPL');

      expect(result.mostRecentYear).toBe(2025);
    });

    it('should always pick the most recent report regardless of DB order', async () => {
      const dates = [
        { date: new Date('2022-01-01'), content: { '2022-01-01': {} } },
        { date: new Date('2024-01-01'), content: { '2024-01-01': {} } }, // הכי חדש
        { date: new Date('2023-01-01'), content: { '2023-01-01': {} } },
      ];

      jest.spyOn(stockReportService, 'findManyStockReports').mockResolvedValue(dates as any);

      const result = await service.fetchAndCalculate('AAPL');

      expect(result.mostRecentYear).toBe(2024);
    });
  });
});

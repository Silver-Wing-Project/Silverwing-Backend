import { Test, TestingModule } from '@nestjs/testing';
import { BigFiveAnalysisService } from './big-five-analysis.service';
import { RoicCalculator } from './calculators/roic.calculator';
import { BVPSGrowthCalculator } from './calculators/bvps-growth.calculator';
import { SalesGrowthCalculator } from './calculators/sales-growth.calculator';
import { EPSGrowthCalculator } from './calculators/eps-growth.calculator';
import { FCFGrowthCalculator } from './calculators/fcf-growth.calculator';
import { CombinedFinancialData } from './interfaces/big-five.interface';
import { StockReportService } from '@/yahoo-client/stock/stock-report/stock-report.service';
import { PythonService } from '@/yahoo-client/utility/ts-services/python.service';

describe('BigFiveAnalysisService (Integration)', () => {
  let service: BigFiveAnalysisService;
  let stockReportService: StockReportService;

  // Use the realistic mock data we built earlier
  const mockMsftData: CombinedFinancialData = {
    incomeStmt: {
      '2025-06-30': {
        TotalRevenue: 250000000000,
        EBIT: 100000000000,
        DilutedEPS: 12.5,
        TaxRateForCalcs: 0.21,
        DilutedAverageShares: 74000000000,
      },
      '2024-06-30': {
        TotalRevenue: 210000000000,
        EBIT: 85000000000,
        DilutedEPS: 10.2,
        TaxRateForCalcs: 0.19,
        DilutedAverageShares: 75000000000,
      },
      '2023-06-30': {
        TotalRevenue: 180000000000,
        EBIT: 70000000000,
        DilutedEPS: 8.5,
        TaxRateForCalcs: 0.18,
        DilutedAverageShares: 76000000000,
      },
    },
    balanceSheet: {
      '2025-06-30': { StockholdersEquity: 343000000000, TotalDebt: 60000000000 },
      '2024-06-30': { StockholdersEquity: 280000000000, TotalDebt: 55000000000 },
      '2023-06-30': { StockholdersEquity: 220000000000, TotalDebt: 50000000000 },
    },
    cashFlow: {
      '2025-06-30': { FreeCashFlow: 80000000000 },
      '2024-06-30': { FreeCashFlow: 65000000000 },
      '2023-06-30': { FreeCashFlow: 55000000000 },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BigFiveAnalysisService,
        // We provide the REAL classes here, not mocks!
        RoicCalculator,
        BVPSGrowthCalculator,
        SalesGrowthCalculator,
        EPSGrowthCalculator,
        FCFGrowthCalculator,
        // ADD THESE MOCKS to handle the DB/External calls
        {
          provide: StockReportService,
          useValue: {
            findManyStockReports: jest.fn(),
            createManyStockReports: jest.fn(),
          },
        },
        {
          provide: PythonService,
          useValue: { fetchStockReports: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BigFiveAnalysisService>(BigFiveAnalysisService);
    stockReportService = module.get<StockReportService>(StockReportService);
  });

  it('should calculate realistic Big Five numbers for MSFT mock data', async () => {
    const result = await service.calculateBigFive('MSFT', mockMsftData);

    // Verify Ticker and Year
    expect(result.ticker).toBe('MSFT');
    expect(result.mostRecentYear).toBe(2025);

    // Verify ROIC (EBIT * (1-Tax) / (Equity + Debt))
    // Math: (100 * 0.79) / (343 + 60) = 79 / 403 = ~19.6%
    expect(result.roic).toBeGreaterThan(10);

    // Verify Sales Growth (250B vs 180B over 2 years)
    expect(result.salesGrowth.average).toBeGreaterThan(10);

    // Verify final recommendation
    expect(result.recommendation.status).toBe('STRONG_BUY');
    expect(result.recommendation.metricsPassingThreshold).toBe(5);
  });

  it('should return PASS status if growth rates are below the 10% threshold', async () => {
    const badStockData: CombinedFinancialData = {
      incomeStmt: {
        '2025-06-30': {
          TotalRevenue: 100e6,
          EBIT: 10e6,
          DilutedEPS: 1.0,
          TaxRateForCalcs: 0.21,
          DilutedAverageShares: 1e6,
        },
        '2024-06-30': {
          TotalRevenue: 105e6,
          EBIT: 11e6,
          DilutedEPS: 1.1,
          TaxRateForCalcs: 0.21,
          DilutedAverageShares: 1e6,
        },
      },
      balanceSheet: {
        '2025-06-30': { StockholdersEquity: 50e6, TotalDebt: 100e6 },
        '2024-06-30': { StockholdersEquity: 45e6, TotalDebt: 90e6 },
      },
      cashFlow: {
        '2025-06-30': { FreeCashFlow: 1e6 },
      },
    };

    const result = await service.calculateBigFive('BAD', badStockData);

    expect(result.recommendation.status).toBe('PASS');
    expect(result.recommendation.metricsPassingThreshold).toBeLessThan(3);
  });

  it('should throw an error if any financial reports are missing from the database', async () => {
    const ticker = 'TSLA';

    // Mock the DB returning income reports but NO balance sheet or cash flow
    jest.spyOn(stockReportService, 'findManyStockReports').mockImplementation(async (t, type) => {
      if (type === 'financials') return [{ content: {}, date: new Date() }] as any;
      return []; // Return empty for others
    });

    await expect(service.fetchAndCalculate(ticker)).rejects.toThrow(
      /Missing reports for TSLA: Balance Sheet, Cash Flow/,
    );
  });
});

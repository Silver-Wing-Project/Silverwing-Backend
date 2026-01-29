import { Test, TestingModule } from '@nestjs/testing';
import { IncomeStmtData } from './../interfaces/big-five.interface';
import { SalesGrowthCalculator } from '../calculators/sales-growth.calculator';

describe('SalesCalculator', () => {
  let salesCalculator: SalesGrowthCalculator;

  // Mock Data mimicking MSFT Structure (Partial)
  // 2024 Revenue: 245,122
  // 2019 Revenue: 125,843 (For 5Y calculation check)
  // 2014 Revenue: 86,833
  const mockMsftIncomeStmt: IncomeStmtData = {
    '2024-06-30': { TotalRevenue: 245122, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 },
    '2023-06-30': { TotalRevenue: 211915, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 },
    '2019-06-30': { TotalRevenue: 125843, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 },
    '2014-06-30': { TotalRevenue: 86833, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesGrowthCalculator],
    }).compile();

    salesCalculator = module.get<SalesGrowthCalculator>(SalesGrowthCalculator);
  });

  it('should be defined', () => {
    expect(salesCalculator).toBeDefined();
  });

  it('should correctly extract TotalRevenue and calculate 10-year growth matching MSFT Excel', () => {
    const rates = salesCalculator.calculate(mockMsftIncomeStmt);

    // 2024 vs 2014: (245122 / 86833)^(0.1) - 1 = ~10.935%
    expect(rates.tenYear).toBeCloseTo(10.935, 2);
  });

  it('should calculate 5-year growth correctly', () => {
    const rates = salesCalculator.calculate(mockMsftIncomeStmt);

    // 2024 vs 2019: (245122 / 125843)^(0.2) - 1 = ~14.26%
    const expected5Y = (Math.pow(245122 / 125843, 1 / 5) - 1) * 100;
    expect(rates.fiveYear).toBeCloseTo(14.26, 2);
    expect(rates.fiveYear).toBeCloseTo(expected5Y, 2);
  });

  it('should return 0s if input data is empty', () => {
    const rates = salesCalculator.calculate({});
    expect(rates.tenYear).toBe(0);
    expect(rates.average).toBe(0);
  });

  it('should ignore years with missing TotalRevenue', () => {
    const badData: IncomeStmtData = {
      '2024-06-30': { TotalRevenue: 100, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 },
      '2014-06-30': { TotalRevenue: 0, EBIT: 0, DilutedEPS: 0, TaxRateForCalcs: 0, DilutedAverageShares: 0 }, // Revenue 0
    };

    const rates = salesCalculator.calculate(badData);
    // Should verify it doesn't try to divide by zero or crash
    expect(rates.tenYear).toBe(0);
  });
});

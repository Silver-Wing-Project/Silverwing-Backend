import { Test, TestingModule } from '@nestjs/testing';
import { IncomeStmtData } from '../interfaces/big-five.interface';
import { EPSGrowthCalculator } from '../calculators/eps-growth.calculator';

describe('EPSCalculator', () => {
  let epsCalculator: EPSGrowthCalculator;

  const createIncomeYear = (overrides = {}) => ({
    TotalRevenue: 100,
    EBIT: 20,
    DilutedEPS: 5,
    TaxRateForCalcs: 0.2,
    DilutedAverageShares: 10,
    ...overrides,
  });

  const mockMsftIncomeStmt: IncomeStmtData = {
    '2025-06-30': {
      TotalRevenue: 281724,
      EBIT: 126012,
      DilutedEPS: 13.64,
      TaxRateForCalcs: 0.176,
      DilutedAverageShares: 7465,
    },
    '2024-06-30': {
      TotalRevenue: 245122,
      EBIT: 110722,
      DilutedEPS: 11.8,
      TaxRateForCalcs: 0.182,
      DilutedAverageShares: 7469,
    },
    '2020-06-30': {
      TotalRevenue: 125843,
      EBIT: 42959,
      DilutedEPS: 5.76,
      TaxRateForCalcs: 0.1,
      DilutedAverageShares: 7735,
    },
    '2015-06-30': {
      TotalRevenue: 86833,
      EBIT: 27759,
      DilutedEPS: 1.48,
      TaxRateForCalcs: 0.2,
      DilutedAverageShares: 8363,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EPSGrowthCalculator],
    }).compile();

    epsCalculator = module.get<EPSGrowthCalculator>(EPSGrowthCalculator);
  });

  it('should be defined', () => {
    expect(epsCalculator).toBeDefined();
  });

  describe('Input and Output validation', () => {
    it('should return 0s if input data is empty', () => {
      const rates = epsCalculator.calculate({});
      expect(rates.tenYear).toBe(0);
      expect(rates.fiveYear).toBe(0);
      expect(rates.oneYear).toBe(0);
      expect(rates.average).toBe(0);
    });

    it('should ignore years with missing DilutedEPS', () => {
      const badData: IncomeStmtData = {
        '2025-06-30': { TotalRevenue: 100, EBIT: 10, DilutedEPS: 0, TaxRateForCalcs: 0.1, DilutedAverageShares: 12 },
        '2015-06-30': { TotalRevenue: 100, EBIT: 1, DilutedEPS: 0, TaxRateForCalcs: 0.1, DilutedAverageShares: 12 },
      };

      const rates = epsCalculator.calculate(badData);
      expect(rates.tenYear).toBe(0);
      expect(rates.average).toBe(0);
    });

    it('should return 0 if DilutedEPS is null or NaN or undefined', () => {
      const badData: any = {
        '2025-06-30': { TotalRevenue: 100, EBIT: 10, DilutedEPS: NaN, TaxRateForCalcs: 0.1, DilutedAverageShares: 12 },
        '2015-06-30': { TotalRevenue: 100, EBIT: 1, DilutedEPS: 'eps', TaxRateForCalcs: 0.1, DilutedAverageShares: 12 },
      };

      const rates = epsCalculator.calculate(badData);
      expect(rates.tenYear).toBe(0);
      expect(rates.average).toBe(0);
    });
  });

  describe('Sales Growth Logic (The Math)', () => {
    it('should penalize average growth when a year has zero EPS', () => {
      const stableMockData: IncomeStmtData = {
        '2025-06-30': createIncomeYear({ DilutedEPS: 30 }),
        '2024-06-30': createIncomeYear({ DilutedEPS: 15 }),
        '2020-06-30': createIncomeYear({ DilutedEPS: 12 }),
        '2015-06-30': createIncomeYear({ DilutedEPS: 3 }),
      };

      const crisisMockData = structuredClone(stableMockData);
      crisisMockData['2024-06-30'].DilutedEPS = 0;

      const stableRates = epsCalculator.calculate(stableMockData);
      const crisisRates = epsCalculator.calculate(crisisMockData);

      expect(stableRates.oneYear).toBeGreaterThan(crisisRates.oneYear);
      expect(stableRates.average).toBeGreaterThan(crisisRates.average);
      expect(crisisRates.oneYear).toBe(0);
    });

    it('should correctly calculate 1-year growth matching MSFT Excel', () => {
      const rates = epsCalculator.calculate(mockMsftIncomeStmt);

      // 2025 vs 2024: (13.64 / 11.8)^(1) - 1 = ~ 15.593%
      expect(rates.oneYear).toBeCloseTo(15.593, 2);
    });

    it('should correctly calculate 5-year growth matching MSFT Excel', () => {
      const rates = epsCalculator.calculate(mockMsftIncomeStmt);

      // 2025 vs 2020: (13.64 / 5.76)^(0.2) - 1 = ~ 18.817%
      expect(rates.fiveYear).toBeCloseTo(18.817, 2);
    });

    it('should correctly calculate 10-year growth matching MSFT Excel', () => {
      const rates = epsCalculator.calculate(mockMsftIncomeStmt);

      // 2025 vs 2015: (13.64 / 1.48)^(0.1) - 1 = ~ 24.869%
      expect(rates.tenYear).toBeCloseTo(24.869, 2);
    });
  });
});

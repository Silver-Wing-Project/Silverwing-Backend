import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowData } from '../interfaces/big-five.interface';
import { FCFGrowthCalculator } from '../calculators/fcf-growth.calculator';

describe('EPSCalculator', () => {
  let fcfCalculator: FCFGrowthCalculator;

  const createCashFlowYear = (overrides = {}) => ({
    OperatingCashFlow: 100,
    ...overrides,
  });

  const mockMsftCashFlow: CashFlowData = {
    '2025-06-30': {
      OperatingCashFlow: 136162,
    },
    '2024-06-30': {
      OperatingCashFlow: 118548,
    },
    '2020-06-30': {
      OperatingCashFlow: 60675,
    },
    '2015-06-30': {
      OperatingCashFlow: 28669,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FCFGrowthCalculator],
    }).compile();

    fcfCalculator = module.get<FCFGrowthCalculator>(FCFGrowthCalculator);
  });

  it('should be defined', () => {
    expect(fcfCalculator).toBeDefined();
  });

  describe('Input and Output Validation', () => {
    it('should return 0s if input data is empty', () => {
      const rate = fcfCalculator.calculate({});
      expect(rate.oneYear).toBe(0);
      expect(rate.fiveYear).toBe(0);
      expect(rate.tenYear).toBe(0);
      expect(rate.average).toBe(0);
    });

    it('should ignore years with missing OperatingCashFlow', () => {
      const badData: CashFlowData = {
        '2025-06-30': { OperatingCashFlow: 100 },
        '2024-06-30': { OperatingCashFlow: 0 },
        '2020-06-30': { OperatingCashFlow: 10 },
      };

      const rates = fcfCalculator.calculate(badData);
      expect(rates.oneYear).toBe(0);
      expect(rates.fiveYear).toBeGreaterThan(0);
    });

    it('should return 0 if OperatingCashFlow is null or NaN or undefined', () => {
      const badData: any = {
        '2025-06-30': { OperatingCashFlow: 100 },
        '2024-06-30': { OperatingCashFlow: NaN },
        '2020-06-30': { OperatingCashFlow: undefined },
      };

      const rates = fcfCalculator.calculate(badData);
      expect(rates.oneYear).toBe(0);
      expect(rates.fiveYear).toBe(0);
      expect(rates.average).toBe(0);
    });
  });

  describe('Free Cash Flow Logic (The Math)', () => {
    it('should penalize average growth when a year has zero FCF', () => {
      const stableMockData: CashFlowData = {
        '2025-06-30': createCashFlowYear({ OperatingCashFlow: 30 }),
        '2024-06-30': createCashFlowYear({ OperatingCashFlow: 15 }),
        '2020-06-30': createCashFlowYear({ OperatingCashFlow: 12 }),
        '2015-06-30': createCashFlowYear({ OperatingCashFlow: 3 }),
      };

      const crisisMockData = structuredClone(stableMockData);
      crisisMockData['2024-06-30'].OperatingCashFlow = 0;

      const stableRates = fcfCalculator.calculate(stableMockData);
      const crisisRates = fcfCalculator.calculate(crisisMockData);

      expect(stableRates.oneYear).toBeGreaterThan(crisisRates.oneYear);
      expect(stableRates.average).toBeGreaterThan(crisisRates.average);
      expect(crisisRates.oneYear).toBe(0);
    });

    it('should correctly calculate 1-year growth matching MSFT Excel', () => {
      const rates = fcfCalculator.calculate(mockMsftCashFlow);

      // 2025 vs 2024: (136162 / 118548)^(1) - 1 = ~14.858
      expect(rates.oneYear).toBeCloseTo(14.858, 2);
    });

    it('should correctly calculate 5-year growth matching MSFT Excel', () => {
      const rates = fcfCalculator.calculate(mockMsftCashFlow);

      // 2025 vs 2020: (136162 / 60675)^(0.2) - 1 = ~17.546
      expect(rates.fiveYear).toBeCloseTo(17.546, 2);
    });

    it('should correctly calculate 10-year growth matching MSFT Excel', () => {
      const rates = fcfCalculator.calculate(mockMsftCashFlow);

      // 2025 vs 2015: (136162 / 28669)^(0.1) - 1 = ~16.86
      expect(rates.tenYear).toBeCloseTo(16.86, 2);
    });
  });
});

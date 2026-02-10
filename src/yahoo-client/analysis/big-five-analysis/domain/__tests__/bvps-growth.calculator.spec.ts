import { Test, TestingModule } from '@nestjs/testing';
import { IncomeStmtData, BalanceSheetData, GrowthRates } from './../interfaces/big-five.interface';
import { BVPSGrowthCalculator } from '../calculators/bvps-growth.calculator';

describe('BVPSCalculator', () => {
  let bvpsCalculator: BVPSGrowthCalculator;

  const createIncomeYear = (overrides = {}) => ({
    TotalRevenue: 100,
    EBIT: 20,
    DilutedEPS: 5,
    TaxRateForCalcs: 0.2,
    DilutedAverageShares: 10,
    ...overrides,
  });

  const createBalanceYear = (overrides = {}) => ({
    StockholdersEquity: 500,
    TotalDebt: 10,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BVPSGrowthCalculator],
    }).compile();

    bvpsCalculator = module.get<BVPSGrowthCalculator>(BVPSGrowthCalculator);
  });

  it('should be defined', () => {
    expect(bvpsCalculator).toBeDefined();
  });

  describe('Input Validation & Sanity', () => {
    describe('Data Integrity', () => {
      it('should return 0s if input data objects are null', () => {
        const ratesNull = bvpsCalculator.calculate({ key: null }, null);
        // console.log(ratesNull);

        expect(ratesNull).toEqual({ tenYear: 0, fiveYear: 0, oneYear: 0, average: 0 });
      });

      it('should ignore years that do not exist in both reports', () => {
        const mockIncome = { '2025-06-30': createIncomeYear() };
        const mockBalance = { '2023-06-30': createBalanceYear() };

        expect(bvpsCalculator.calculate(mockIncome, mockBalance).oneYear).toBe(0);
      });

      it('should calculate only for shared years', () => {
        const income = {
          '2025-06-30': createIncomeYear({ DilutedAverageShares: 10 }),
          '2024-06-30': createIncomeYear({ DilutedAverageShares: 10 }),
        };

        const balance = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 100 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 50 }),
        };

        const result = bvpsCalculator.calculate(income, balance);
        expect(result.oneYear).toBe(100);
      });

      it('should ignore years where date keys are malformed or missing', () => {
        const mockIncome: IncomeStmtData = {
          '2025/06-33': { TotalRevenue: 120, EBIT: 3, DilutedEPS: 3, TaxRateForCalcs: 2, DilutedAverageShares: 12 },
          '2024j06tr30': { TotalRevenue: 100, EBIT: 2, DilutedEPS: 2, TaxRateForCalcs: 1, DilutedAverageShares: 10 },
        };

        const mockBalance: BalanceSheetData = {
          '20240s3-06-30': { StockholdersEquity: 23, TotalDebt: 3 },
          '2025-אב-30': { StockholdersEquity: 20, TotalDebt: 5 },
        };

        expect(bvpsCalculator.calculate(mockIncome, mockBalance)).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });

      it('should sort years correctly regardless of the input order of keys', () => {
        const mockIncome: IncomeStmtData = {
          '2024-06-30': { TotalRevenue: 100, EBIT: 2, DilutedEPS: 2, TaxRateForCalcs: 1, DilutedAverageShares: 10 },
          '2023-06-30': { TotalRevenue: 90, EBIT: 2, DilutedEPS: 2, TaxRateForCalcs: 1, DilutedAverageShares: 10 },
          '2025-06-30': { TotalRevenue: 120, EBIT: 3, DilutedEPS: 3, TaxRateForCalcs: 2, DilutedAverageShares: 10 },
        };

        const mockBalance: BalanceSheetData = {
          '2023-06-30': { StockholdersEquity: 30, TotalDebt: 2 },
          '2025-06-30': { StockholdersEquity: 30, TotalDebt: 5 },
          '2024-06-30': { StockholdersEquity: 20, TotalDebt: 3 },
        };

        const result = bvpsCalculator.calculate(mockIncome, mockBalance);
        expect(result.oneYear).toBeGreaterThan(0);
      });
    });

    describe('Validating Income Statement data', () => {
      it('should ignore years with missing DilutedAverageShares', () => {
        const badIncome: any = {
          '2025-06-30': createIncomeYear({
            DilutedAverageShares: undefined,
          }),
          '2024-06-30': createIncomeYear({
            DilutedAverageShares: null,
          }),
          '2023-06-30': createIncomeYear({
            DilutedAverageShares: undefined,
          }),
          '2019-06-30': createIncomeYear({
            DilutedAverageShares: NaN,
          }),
          '2014-06-30': createIncomeYear({
            DilutedAverageShares: undefined,
          }),
        };

        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 5 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 4 }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: 3 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 2 }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: 1 }),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });

      it('should ignore years if invalid DilutedAverageShares values (NaN, null, strings, zero or negative)', () => {
        const badIncome: any = {
          '2025-06-30': createIncomeYear({ DilutedAverageShares: '100' }),
          '2024-06-30': createIncomeYear({ DilutedAverageShares: 0 }),
          '2023-06-30': createIncomeYear({ DilutedAverageShares: -2 }),
          '2019-06-30': createIncomeYear({ DilutedAverageShares: NaN }),
          '2014-06-30': createIncomeYear({ DilutedAverageShares: null }),
        };

        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 5 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 4 }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: 3 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 2 }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: 1 }),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates.tenYear).toBe(0);
        expect(rates.fiveYear).toBe(0);
        expect(rates.oneYear).toBe(0);
        expect(rates.average).toBe(0);
      });
    });

    describe('Validating Balance Sheet data', () => {
      it('should ignore years with missing StockholdersEquity', () => {
        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: undefined }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: null }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: undefined }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: NaN }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: undefined }),
        };

        const badIncome: any = {
          '2025-06-30': createIncomeYear(),
          '2024-06-30': createIncomeYear(),
          '2023-06-30': createIncomeYear(),
          '2019-06-30': createIncomeYear(),
          '2014-06-30': createIncomeYear(),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });

      it('should ignore years if StockholdersEquity invalid values (NaN, null, strings)', () => {
        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 'hi' }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: '0' }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: -3 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: NaN }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: 'String!' }),
        };

        const badIncome: any = {
          '2025-06-30': createIncomeYear(),
          '2024-06-30': createIncomeYear(),
          '2023-06-30': createIncomeYear(),
          '2019-06-30': createIncomeYear(),
          '2014-06-30': createIncomeYear(),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });

      it('should ignore years where StockholdersEquity is negative (Rule #1: High Risk)', () => {
        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: -1 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: -3 }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: -2 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: -5 }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: -9 }),
        };

        const badIncome: any = {
          '2025-06-30': createIncomeYear(),
          '2024-06-30': createIncomeYear(),
          '2023-06-30': createIncomeYear(),
          '2019-06-30': createIncomeYear(),
          '2014-06-30': createIncomeYear(),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });

      it('should handle zero StockholdersEquity as a valid value but return 0 CAGR (no growth from zero)', () => {
        const badBalance: any = {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          '2023-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          '2014-06-30': createBalanceYear({ StockholdersEquity: 0 }),
        };

        const badIncome: any = {
          '2025-06-30': createIncomeYear(),
          '2024-06-30': createIncomeYear(),
          '2023-06-30': createIncomeYear(),
          '2019-06-30': createIncomeYear(),
          '2014-06-30': createIncomeYear(),
        };

        const rates = bvpsCalculator.calculate(badIncome, badBalance);
        expect(rates).toEqual({
          tenYear: 0,
          fiveYear: 0,
          oneYear: 0,
          average: 0,
        });
      });
    });
  });

  describe('BVPS Growth Logic (The Math)', () => {
    it('should penalize average growth when a year has zero StockholdersEquity', () => {
      const stableData = [
        {
          '2025-06-30': createIncomeYear({ TotalRevenue: 1000 }),
          '2024-06-30': createIncomeYear({ TotalRevenue: 500 }),
          '2020-06-30': createIncomeYear({ TotalRevenue: 150 }),
          '2019-06-30': createIncomeYear({ TotalRevenue: 100 }),
          '2015-06-30': createIncomeYear({ TotalRevenue: 20 }),
        },
        {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 1000 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 500 }),
          '2020-06-30': createBalanceYear({ StockholdersEquity: 150 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 100 }),
          '2015-06-30': createBalanceYear({ StockholdersEquity: 20 }),
        },
      ];

      const crisisData = stableData.map((item, index) => {
        if (index === 1) {
          return {
            ...item,
            '2024-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          };
        }
        return item;
      });

      const stableRates = (bvpsCalculator as any).calculate(stableData[0], stableData[1]);
      const crisisRates = (bvpsCalculator as any).calculate(crisisData[0], crisisData[1]);

      expect(stableRates.oneYear).toBeGreaterThan(crisisRates.oneYear);
      expect(crisisRates.oneYear).toEqual(0);
    });

    it('should return 0 for CAGR if the starting value of the period is 0 or negative', () => {
      const data = [
        {
          '2025-06-30': createIncomeYear({ TotalRevenue: 1000 }),
          '2024-06-30': createIncomeYear({ TotalRevenue: 500 }),
          '2020-06-30': createIncomeYear({ TotalRevenue: 150 }),
          '2019-06-30': createIncomeYear({ TotalRevenue: 100 }),
          '2015-06-30': createIncomeYear({ TotalRevenue: 20 }),
        },
        {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 1000 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 500 }),
          '2020-06-30': createBalanceYear({ StockholdersEquity: 0 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 100 }),
          '2015-06-30': createBalanceYear({ StockholdersEquity: 20 }),
        },
      ];

      const rates = (bvpsCalculator as any).calculate(data[0], data[1]);
      expect(rates.fiveYear).toBe(0);
      expect(rates.tenYear).toBeGreaterThan(0);
    });

    describe('Correct Mock calculations', () => {
      const balance = {
        '2025-06-30': createBalanceYear({ StockholdersEquity: 1000 }),
        '2024-06-30': createBalanceYear({ StockholdersEquity: 500 }),
        '2020-06-30': createBalanceYear({ StockholdersEquity: 150 }),
        '2019-06-30': createBalanceYear({ StockholdersEquity: 100 }),
        '2015-06-30': createBalanceYear({ StockholdersEquity: 20 }),
      };

      const income = {
        '2025-06-30': createIncomeYear({ TotalRevenue: 1000 }),
        '2024-06-30': createIncomeYear({ TotalRevenue: 500 }),
        '2020-06-30': createIncomeYear({ TotalRevenue: 150 }),
        '2019-06-30': createIncomeYear({ TotalRevenue: 100 }),
        '2015-06-30': createIncomeYear({ TotalRevenue: 20 }),
      };

      it('should correctly calculate 1-year growth', () => {
        const rates = bvpsCalculator.calculate(income, balance);
        expect(rates.oneYear).toBeCloseTo(100, 2);
      });

      it('should correctly calculate 5-year growth', () => {
        const rates = bvpsCalculator.calculate(income, balance);
        expect(rates.fiveYear).toBeCloseTo(46.14, 2);
        expect(rates.oneYear).toBeCloseTo(100, 2);
      });

      it('should correctly calculate 10-year growth', () => {
        const rates = bvpsCalculator.calculate(income, balance);
        expect(rates.tenYear).toBeCloseTo(47.875, 2);
        expect(rates.fiveYear).toBeCloseTo(46.14, 2);
        expect(rates.oneYear).toBeCloseTo(100, 2);
        expect(rates.average).toBeCloseTo(64.67, 2);
      });
    });
  });

  describe('Phil Town Specifics', () => {
    const generateFullMsftData = () => {
      const income = {
        '2025-06-30': createIncomeYear({ DilutedAverageShares: 7462 }),
        '2024-06-30': createIncomeYear({ DilutedAverageShares: 7452 }),
        '2023-06-30': createIncomeYear({ DilutedAverageShares: 7466 }),
        '2022-06-30': createIncomeYear({ DilutedAverageShares: 7504 }),
        '2021-06-30': createIncomeYear({ DilutedAverageShares: 7581 }),
        '2020-06-30': createIncomeYear({ DilutedAverageShares: 7653 }),
        '2019-06-30': createIncomeYear({ DilutedAverageShares: 7735 }),
        '2018-06-30': createIncomeYear({ DilutedAverageShares: 7794 }),
        '2017-06-30': createIncomeYear({ DilutedAverageShares: 7808 }),
        '2016-06-30': createIncomeYear({ DilutedAverageShares: 7929 }),
        '2015-06-30': createIncomeYear({ DilutedAverageShares: 8063 }),
        '2014-06-30': createIncomeYear({ DilutedAverageShares: 8363 }),
      };

      const balance = {
        '2025-06-30': createBalanceYear({ StockholdersEquity: 343479 }),
        '2024-06-30': createBalanceYear({ StockholdersEquity: 268477 }),
        '2023-06-30': createBalanceYear({ StockholdersEquity: 206223 }),
        '2022-06-30': createBalanceYear({ StockholdersEquity: 166542 }),
        '2021-06-30': createBalanceYear({ StockholdersEquity: 141988 }),
        '2020-06-30': createBalanceYear({ StockholdersEquity: 118304 }),
        '2019-06-30': createBalanceYear({ StockholdersEquity: 102330 }),
        '2018-06-30': createBalanceYear({ StockholdersEquity: 82718 }),
        '2017-06-30': createBalanceYear({ StockholdersEquity: 72394 }),
        '2016-06-30': createBalanceYear({ StockholdersEquity: 71997 }),
        '2015-06-30': createBalanceYear({ StockholdersEquity: 80083 }),
        '2014-06-30': createBalanceYear({ StockholdersEquity: 89784 }),
      };

      return { income, balance };
    };

    it('should correctly identify if the average growth meets the 10% threshold', () => {
      const { income, balance } = generateFullMsftData();

      const rates = bvpsCalculator.calculate(income, balance);

      expect(rates.oneYear).toBeGreaterThan(10);
      expect(rates.fiveYear).toBeGreaterThan(10);
      expect(rates.tenYear).toBeGreaterThan(10);

      const isGoodInvestment = (bvpsCalculator as any).meetsThreshold(rates.average);
      expect(isGoodInvestment).toBe(true);
    });

    it('should calculate the average only from available growth periods', () => {
      const data = [
        {
          '2025-06-30': createIncomeYear({ TotalRevenue: 1000 }),
          '2024-06-30': createIncomeYear({ TotalRevenue: 500 }),
          '2019-06-30': createIncomeYear({ TotalRevenue: 100 }),
        },
        {
          '2025-06-30': createBalanceYear({ StockholdersEquity: 1000 }),
          '2024-06-30': createBalanceYear({ StockholdersEquity: 500 }),
          '2019-06-30': createBalanceYear({ StockholdersEquity: 100 }),
        },
      ];

      const rates = (bvpsCalculator as any).calculate(data[0], data[1]);
      expect(rates.oneYear).toBeGreaterThan(10);
      expect(rates.fiveYear).toBe(0);
      expect(rates.tenYear).toBe(0);
    });

    it('should include all possible periods in the average calculation', () => {
      const { income, balance } = generateFullMsftData();
      const rates = bvpsCalculator.calculate(income, balance);

      const manualAverage = (rates.oneYear + rates.fiveYear + rates.tenYear) / 3;
      expect(rates.average).toBeCloseTo(manualAverage, 2);
    });

    it('should return false if average growth is 9.9%', () => {
      const weakGrowth: GrowthRates = {
        oneYear: 9.9,
        fiveYear: 9.9,
        tenYear: 9.9,
        average: 9.9,
      };

      expect((bvpsCalculator as any).meetsThreshold(weakGrowth.average)).toBe(false);
    });

    describe('Phil Town Rules & High Fidelity Math', () => {
      it('should correctly identify if the average growth meets the 10% threshold with real MSFT data', () => {
        const { income, balance } = generateFullMsftData();

        const rates = bvpsCalculator.calculate(income, balance);

        expect(rates.oneYear).toBeGreaterThan(20);
        expect(rates.tenYear).toBeGreaterThan(12);
        expect(rates.average).toBeGreaterThan(10);

        const meetsRule = (bvpsCalculator as any).meetsThreshold(rates.average);
        expect(meetsRule).toBe(true);
      });

      it('should verify the math of BVPS for specific years before calculating growth', () => {
        const { income, balance } = generateFullMsftData();

        const equity2025 = balance['2025-06-30'].StockholdersEquity;
        const shares2025 = income['2025-06-30'].DilutedAverageShares;
        const expectedBVPS2025 = equity2025 / shares2025; // 343479 / 7465 = 46.011...

        const equity2024 = balance['2024-06-30'].StockholdersEquity;
        const shares2024 = income['2024-06-30'].DilutedAverageShares;
        const expectedBVPS2024 = equity2024 / shares2024; // 268477 / 7469 = 35.945...

        const expectedYoY = ((expectedBVPS2025 - expectedBVPS2024) / expectedBVPS2024) * 100;

        const rates = bvpsCalculator.calculate(income, balance);

        expect(rates.oneYear).toBeCloseTo(expectedYoY, 2);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { IncomeStmtData, BalanceSheetData } from './../interfaces/big-five.interface';
import { RoicCalculator } from '../calculators/roic.calculator';

describe('ROIC Calculator', () => {
  let roicCalculator: RoicCalculator;

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
    '2023-06-30': {
      TotalRevenue: 211915,
      EBIT: 91279,
      DilutedEPS: 9.68,
      TaxRateForCalcs: 0.19,
      DilutedAverageShares: 7472,
    },
    '2019-06-30': {
      TotalRevenue: 125843,
      EBIT: 42959,
      DilutedEPS: 5.06,
      TaxRateForCalcs: 0.1,
      DilutedAverageShares: 7735,
    },
    '2014-06-30': {
      TotalRevenue: 86833,
      EBIT: 27759,
      DilutedEPS: 2.63,
      TaxRateForCalcs: 0.2,
      DilutedAverageShares: 8363,
    },
  };

  const mockMsftBalanceSheet: BalanceSheetData = {
    '2025-06-30': { StockholdersEquity: 343479, TotalDebt: 60588 },
    '2024-06-30': { StockholdersEquity: 268477, TotalDebt: 67127 },
    '2023-06-30': { StockholdersEquity: 206223, TotalDebt: 59965 },
    '2019-06-30': { StockholdersEquity: 102330, TotalDebt: 78752 },
    '2014-06-30': { StockholdersEquity: 89784, TotalDebt: 22645 },
  };

  const mockExcelMsftIncomeStmt: IncomeStmtData = {
    '2025-06-30': {
      TotalRevenue: 281724,
      EBIT: 128528,
      DilutedEPS: 13.64,
      TaxRateForCalcs: 0.1763,
      DilutedAverageShares: 7465,
    },
    '2024-06-30': {
      TotalRevenue: 245122,
      EBIT: 109433,
      DilutedEPS: 11.8,
      TaxRateForCalcs: 0.1823,
      DilutedAverageShares: 7469,
    },
    '2023-06-30': {
      TotalRevenue: 211915,
      EBIT: 88523,
      DilutedEPS: 9.68,
      TaxRateForCalcs: 0.1898,
      DilutedAverageShares: 7472,
    },
  };
  const mockExcelMsftBalance: BalanceSheetData = {
    '2025-06-30': { StockholdersEquity: 343479, TotalDebt: 60588 },
    '2024-06-30': { StockholdersEquity: 268477, TotalDebt: 67127 },
    '2023-06-30': { StockholdersEquity: 206223, TotalDebt: 59965 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoicCalculator],
    }).compile();

    roicCalculator = module.get<RoicCalculator>(RoicCalculator);
  });

  it('should be defined', () => {
    expect(roicCalculator).toBeDefined();
  });

  describe('Input Validation', () => {
    it('should have Income Statement parameters in all sub-objects', () => {
      const subObjects = Object.values(mockMsftIncomeStmt);

      subObjects.forEach((sub) => {
        expect(sub).toHaveProperty('TotalRevenue');
        expect(sub).toHaveProperty('EBIT');
        expect(sub).toHaveProperty('TaxRateForCalcs');
        expect(sub).toHaveProperty('DilutedAverageShares');
      });
    });

    it('should have Balance Sheet parameters', () => {
      const subObjects = Object.values(mockMsftBalanceSheet);

      subObjects.forEach((sub) => {
        expect(sub).toHaveProperty('StockholdersEquity');
        expect(sub).toHaveProperty('TotalDebt');
      });
    });
  });

  describe('ROIC Logic (The Math)', () => {
    it('[MSFT Verification] should calculate ROIC correctly for 2024', () => {
      // NOPAT = 110722 * (1 - 0.182) = ~90570.596
      // Invested Capital = 268477 + 67127 = 335604
      // ROIC = 90570.596 / 335604 = ~26.987%
      const result = roicCalculator.calculate('2024-06-30', mockMsftIncomeStmt, mockMsftBalanceSheet);
      expect(result).toBeCloseTo(26.987, 1);
    });

    it('[MSFT Verification] should calculate ROIC correctly for 2025', () => {
      const result = roicCalculator.calculate('2025-06-30', mockMsftIncomeStmt, mockMsftBalanceSheet);
      expect(result).toBeCloseTo(25.6971, 1);
    });

    it('[MSFT Excel] should calculate the same ROIC for 2025 our EXCEL', () => {
      const result = roicCalculator.calculate('2025-06-30', mockExcelMsftIncomeStmt, mockExcelMsftBalance);
      expect(result).toBeCloseTo(26.2, 1);
    });

    it('[MSFT Excel] should calculate the same ROIC for 2024 our EXCEL', () => {
      const result = roicCalculator.calculate('2024-06-30', mockExcelMsftIncomeStmt, mockExcelMsftBalance);
      expect(result).toBeCloseTo(26.66, 1);
    });

    it('[MSFT Excel] should calculate the same ROIC for 2023 our EXCEL', () => {
      const result = roicCalculator.calculate('2023-06-30', mockExcelMsftIncomeStmt, mockExcelMsftBalance);
      expect(result).toBeCloseTo(26.94, 1);
    });

    it('should return 0 if invested capital is 0', () => {
      const emptyBS: BalanceSheetData = { '2024-06-30': { StockholdersEquity: 0, TotalDebt: 0 } };
      const result = roicCalculator.calculate('2024-06-30', mockMsftIncomeStmt, emptyBS);
      expect(result).toBe(0);
    });

    it('should return 0 if data for year is missing', () => {
      const result = roicCalculator.calculate('1990-01-01', mockMsftIncomeStmt, mockMsftBalanceSheet);
      expect(result).toBe(0);
    });
  });
});

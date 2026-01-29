import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, BalanceSheetData, YearValue } from './../interfaces/big-five.interface';

@Injectable()
export class RoicCalculator extends BaseCalculator {
  /**
   * Calculate ROIC for a specific year
   * Formula: ROIC = NOPAT / Invested Capital
   * NOPAT: EBIT * (1 - Tax Rate)
   * Invested Capital = Equity + Debt
   */

  public calculate(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    try {
      const incomeStmtData = incomeStmt[year];
      const balanceSheetData = balanceSheet[year];

      if (!incomeStmtData || !balanceSheetData) return 0;

      const ebit = incomeStmtData.EBIT || 0;
      const taxRate = incomeStmtData.TaxRateForCalcs || 0;
      const nopat = ebit * (1 - taxRate);

      const equity = balanceSheetData.StockholdersEquity || 0;
      const debt = balanceSheetData.TotalDebt || 0;
      const investedCapital = equity + debt;

      if (investedCapital === 0) return 0;

      const roic = (nopat / investedCapital) * 100;

      return roic;
    } catch (error) {
      console.error(`Error calculating ROIC: ${error}`);
      return 0;
    }
  }

  /**
   * Calculate ROIC for the most recent available year
   */
  public calculateMostRecent(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    const years = this.getSortedYears(incomeStmt);
    if (years.length === 0) return 0;
    return this.calculate(years[0], incomeStmt, balanceSheet);
  }

  /**
   * Get ROIC history for all available years
   */
  public calculateHistorical(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): YearValue[] {
    const years = this.getSortedYears(incomeStmt);
    return years
      .map((year) => ({
        year: this.extractYear(year),
        value: this.calculate(year, incomeStmt, balanceSheet),
      }))
      .filter((v) => v.value !== 0);
  }
}

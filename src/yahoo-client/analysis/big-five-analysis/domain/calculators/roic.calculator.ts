import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, BalanceSheetData } from './../interfaces/big-five.interface';

/**
 * ROIC (Return on Invested Capital) Calculator
 *
 * Formula: ROIC = NOPAT / Invested Capital
 * Where:
 *  NOPAT: EBIT * (1 - Tax Rate)
 *  Invested Capital = Equity + Debt
 */

@Injectable()
export class RoicCalculator extends BaseCalculator {
  /**
   * Calculate ROIC for a specific year
   */

  calculate(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
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
   * Calculate ROIC for the most recent year
   */
  calculateMostRecent(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    const years = this.getSortedYears(incomeStmt);
    if (years.length === 0) return 0;

    const mostRecentYear = years[0];
    return this.calculate(mostRecentYear, incomeStmt, balanceSheet);
  }
}

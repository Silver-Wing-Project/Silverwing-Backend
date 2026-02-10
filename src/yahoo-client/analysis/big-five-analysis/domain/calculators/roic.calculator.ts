import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, BalanceSheetData } from './../interfaces/big-five.interface';

@Injectable()
export class RoicCalculator extends BaseCalculator {
  /**
   * Calculate ROIC for a specific year
   * Formula: ROIC = NOPAT / Invested Capital
   * NOPAT: EBIT * (1 - Tax Rate)
   * Invested Capital = Equity + Debt
   */

  public calculate(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    if (!incomeStmt[year] || !balanceSheet[year]) return 0;

    const ebit = incomeStmt[year]?.EBIT;
    const taxRate = incomeStmt[year]?.TaxRateForCalcs;
    const nopat = ebit * (1 - taxRate);

    const equity = balanceSheet[year]?.StockholdersEquity;
    const debt = balanceSheet[year]?.TotalDebt;
    const investedCapital = equity + debt;

    if (investedCapital === 0) return 0;

    const roic = (nopat / investedCapital) * 100;
    return roic;
  }

  /**
   * Calculate ROIC for the most recent available year
   */
  public calculateMostRecent(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    const years = this.getSortedYears(incomeStmt);
    if (years.length === 0) return 0;
    return this.calculate(years[0], incomeStmt, balanceSheet);
  }
}

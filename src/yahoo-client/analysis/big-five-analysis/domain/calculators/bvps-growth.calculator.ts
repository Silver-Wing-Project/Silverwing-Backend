import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, BalanceSheetData, GrowthRates, YearValue } from './../interfaces/big-five.interface';

/**
 * BVPS (Book Value Per Share) Growth Calculator
 */
@Injectable()
export class BVPSGrowthCalculator extends BaseCalculator {
  /**
   * Calculate BVPS for a specific Year
   * Formula: BVPS = Equity / Diluted Shares Outstanding
   */
  private calculateBVPS(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number | null {
    if (!this.hasDataForYear(year, incomeStmt, balanceSheet)) return null;

    const equity = balanceSheet[year]?.StockholdersEquity;
    const shares = incomeStmt[year]?.DilutedAverageShares;

    if (
      !(
        this.isValidNumber(equity) &&
        this.isValidNumber(shares) &&
        this.isBusinessValueValid('DilutedAverageShares', shares)
      ) ||
      equity < 0
    ) {
      return null;
    }

    return equity / shares;
  }

  /**
   * Calculate BVPS growth rates
   */
  calculate(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): GrowthRates {
    const years = this.getSortedYears(incomeStmt);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const bvps = this.calculateBVPS(yearStr, incomeStmt, balanceSheet);

      if (bvps !== undefined && bvps !== null) values.push({ year: this.extractYear(yearStr), value: bvps });
    }

    return this.calculateGrowthRates(values);
  }
}

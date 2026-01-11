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
  private calculateBVPS(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {
    try {
      const equity = balanceSheet[year]?.StockholdersEquity || 0;
      const shares = incomeStmt[year]?.DilutedAverageShares || 0;

      if (shares === 0) return 0;

      return equity / shares;
    } catch (error) {
      console.error(`Error calculating BVPS ${error}`);
      return 0;
    }
  }

  /**
   * Calculate BVPS growth rates
   */
  calculate(incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): GrowthRates {
    const years = this.getSortedYears(incomeStmt);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const year = this.extractYear(yearStr);
      const bvps = this.calculateBVPS(yearStr, incomeStmt, balanceSheet);

      if (bvps > 0) values.push({ year, value: bvps });
    }

    return this.calculateGrowthRates(values);
  }
}

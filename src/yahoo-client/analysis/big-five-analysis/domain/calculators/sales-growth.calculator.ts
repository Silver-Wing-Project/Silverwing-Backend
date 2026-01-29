import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, GrowthRates, YearValue } from './../interfaces/big-five.interface';

@Injectable()
export class SalesGrowthCalculator extends BaseCalculator {
  /**
   * Calculate sales growth rates
   * Filters out 0 or missing revenue years to ensure CAGR validity
   */
  public calculate(incomeStmt: IncomeStmtData): GrowthRates {
    const years = this.getSortedYears(incomeStmt);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const year = this.extractYear(yearStr);
      const revenue = incomeStmt[yearStr]?.TotalRevenue;

      if (typeof revenue === 'number' && revenue !== 0) {
        values.push({ year, value: revenue });
      }
    }

    return this.calculateGrowthRates(values);
  }
}

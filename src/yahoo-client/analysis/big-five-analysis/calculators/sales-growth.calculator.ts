import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, GrowthRates, YearValue } from './../interfaces/big-five.interface';

@Injectable()
export class SalesGrowthCalculator extends BaseCalculator {
  /**
   * Calculate sales growth rates
   */
  calculate(incomeStmt: IncomeStmtData): GrowthRates {
    const years = this.getSortedYears(incomeStmt);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const year = this.extractYear(yearStr);
      const sales = incomeStmt[yearStr]?.TotalRevenue || 0;

      if (sales > 0) values.push({ year, value: sales });
    }

    return this.calculateGrowthRates(values);
  }
}

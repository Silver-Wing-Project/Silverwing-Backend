import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { GrowthRates, IncomeStmtData, YearValue } from '../interfaces/big-five.interface';

/**
 * EPS (Earnings Per Share) Growth Calculator
 */
@Injectable()
export class EPSGrowthCalculator extends BaseCalculator {
  /**
   * Calculate EPS growth rates
   */
  calculate(incomeStmt: IncomeStmtData): GrowthRates {
    const years = this.getSortedYears(incomeStmt);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const year = this.extractYear(yearStr);
      const eps = incomeStmt[yearStr]?.DilutedEPS || 0;

      if (eps > 0) values.push({ year, value: eps });
    }

    return this.calculateGrowthRates(values);
  }
}

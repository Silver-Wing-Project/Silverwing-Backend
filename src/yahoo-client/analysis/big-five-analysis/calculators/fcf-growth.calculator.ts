import { Injectable } from '@nestjs/common';
import { CashFlowData, GrowthRates, YearValue } from '../interfaces/big-five.interface';
import { BaseCalculator } from './base.calculator';

/**
 * FCF (Free Cash Flow) Growth Calculator
 */
@Injectable()
export class FCFGrowthCalculator extends BaseCalculator {
  /**
   * Calculate FCF growth rates
   */
  calculate(cashFlow: CashFlowData): GrowthRates {
    const years = this.getSortedYears(cashFlow);
    const values: YearValue[] = [];

    for (const yearStr of years) {
      const year = this.extractYear(yearStr);
      const fcf = cashFlow[yearStr]?.FreeCashFlow || 0;

      if (fcf > 0) values.push({ year, value: fcf });
    }

    return this.calculateGrowthRates(values);
  }
}

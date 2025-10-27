import { Injectable } from '@nestjs/common';
import { CashFlowData, GrowthRates } from '../interfaces/big-five.interface';
import { BaseCalculator } from './base.calculator';

/**
 * FCF (Free Cash Flow) Growth Calculator
 */
@Injectable()
export class FCFGrowthCalculator extends BaseCalculator {
  /**
   * Calculate FCF growth rates
   */
  calculate(cashFlow: CashFlowData): GrowthRates {}
}

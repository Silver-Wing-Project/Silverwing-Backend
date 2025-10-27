import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { GrowthRates, IncomeStmtData } from '../interfaces/big-five.interface';

/**
 * EPS (Earnings Per Share) Growth Calculator
 */
@Injectable()
export class EPSGrowthCalculator extends BaseCalculator {
  /**
   * Calculate EPS growth rates
   */
  calculate(incomeStmt: IncomeStmtData): GrowthRates {}
}

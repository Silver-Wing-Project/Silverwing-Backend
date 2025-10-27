import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, GrowthRates } from './../interfaces/big-five.interface';

@Injectable()
export class SalesGrowthCalculator extends BaseCalculator {
  /**
   * Calculate sales growth rates
   */
  calculate(incomeStmt: IncomeStmtData): GrowthRates {}
}

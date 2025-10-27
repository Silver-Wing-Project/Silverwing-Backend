import { Injectable } from '@nestjs/common';
import { BaseCalculator } from './base.calculator';
import { IncomeStmtData, BalanceSheetData, GrowthRates } from './../interfaces/big-five.interface';

/**
 * BVPS (Book Value Per Share) Growth Calculator
 */
@Injectable()
export class BVPSGrowthCalculator extends BaseCalculator {
  /**
   * Calculate BVPS for a specific Year
   * Formula: BVPS = Equity / Diluted Shares Outstanding
   */
  private calculateBVPS(year: string, incomeStmt: IncomeStmtData, balanceSheet: BalanceSheetData): number {}

  /**
   * Calculate BVPS growth rates
   */
  calculate(financials: FinancialData, balanceSheet: BalanceSheetData): GrowthRates {}
}

import { Injectable, Logger } from '@nestjs/common';
import { RoicCalculator } from './calculators/roic.calculator';
import { BVPSGrowthCalculator } from './calculators/bvps-growth.calculator';
import { SalesGrowthCalculator } from './calculators/sales-growth.calculator';
import { EPSGrowthCalculator } from './calculators/eps-growth.calculator';
import { FCFGrowthCalculator } from './calculators/fcf-growth.calculator';
import {
  BalanceSheetData,
  CashFlowData,
  IncomeStmtData,
  BigFiveNumbers,
  CombinedFinancialData,
  InvestmentRecommendation,
  MetricStatus,
} from './interfaces/big-five.interface';
import { StockReportService } from '@/yahoo-client/stock/stock-report/stock-report.service';
import { PythonService } from '@/yahoo-client/utility/ts-services/python.service';
import { parseStockReportsData } from '@/yahoo-client/utility/data-parsers/data-parser.utils';

@Injectable()
export class BigFiveAnalysisService {
  constructor(
    private readonly stockReportService: StockReportService,
    private readonly roicCalculator: RoicCalculator,
    private readonly bvpsGrowthCalculator: BVPSGrowthCalculator,
    private readonly salesGrowthCalculator: SalesGrowthCalculator,
    private readonly epsGrowthCalculator: EPSGrowthCalculator,
    private readonly fcfGrowthCalculator: FCFGrowthCalculator,
    private readonly pythonService: PythonService,
  ) {}

  async syncAndCalculate(ticker: string): Promise<BigFiveNumbers> {
    Logger.log(`Starting bulk sync for ${ticker}...`);

    // 1. Scrape all 3 reports from Python/Yahoo in parallel
    const [rawFinancials, rawBalance, rawCashFlow] = await Promise.all([
      this.pythonService.fetchStockReports(ticker, 'financials'),
      this.pythonService.fetchStockReports(ticker, 'balance_sheet'),
      this.pythonService.fetchStockReports(ticker, 'cash_flow'),
    ]);

    // 2. Parse and Save to Database (using your existing logic)
    // We do this so the data is available for future requests
    await Promise.all([
      this.stockReportService.createManyStockReports(parseStockReportsData(rawFinancials)),
      this.stockReportService.createManyStockReports(parseStockReportsData(rawBalance)),
      this.stockReportService.createManyStockReports(parseStockReportsData(rawCashFlow)),
    ]);

    // 3. Now that the DB is "Warm", run the standard calculation
    return this.fetchAndCalculate(ticker);
  }

  async fetchAndCalculate(ticker: string): Promise<BigFiveNumbers> {
    // 1. Fetch the 3 reports in parallel
    const [incomeReports, balanceReports, cashFlowReports] = await Promise.all([
      this.stockReportService.findManyStockReports(ticker, 'financials'),
      this.stockReportService.findManyStockReports(ticker, 'balance_sheet'),
      this.stockReportService.findManyStockReports(ticker, 'cash_flow'),
    ]);

    // 2. Specific Error Checking (Helpful for debugging)
    const missing = [];
    if (!incomeReports.length) missing.push('Financials (Income Statement)');
    if (!balanceReports.length) missing.push('Balance Sheet');
    if (!cashFlowReports.length) missing.push('Cash Flow');

    if (missing.length > 0) {
      throw new Error(`Missing reports for ${ticker}: ${missing.join(', ')}. Please run the fetcher for these types.`);
    }

    // 3. Ensure we use the absolute latest scrape by sorting
    const latestIncome = incomeReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const latestBalance = balanceReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const latestCashFlow = cashFlowReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // 4. Map to interface
    const combinedData: CombinedFinancialData = {
      incomeStmt: latestIncome.content,
      balanceSheet: latestBalance.content,
      cashFlow: latestCashFlow.content,
    };

    Logger.log(`Successfully aggregated data for ${ticker}. Starting Big Five calculations...`);

    return this.calculateBigFive(ticker, combinedData);
  }

  /**
   * Calculate all Bgi Five Numbers for a given ticker
   */
  async calculateBigFive(ticker: string, data: CombinedFinancialData): Promise<BigFiveNumbers> {
    const { incomeStmt, balanceSheet, cashFlow } = data;

    // Get the most recent year
    const years = Object.keys(incomeStmt).sort((a, b) => {
      return parseInt(b.split('-')[0]) - parseInt(a.split('-')[0]);
    });

    const mostRecentYear = years.length > 0 ? parseInt(years[0].split('-')[0]) : 0;

    // Calculate ROIC for most recent year
    const roic = this.roicCalculator.calculateMostRecent(incomeStmt, balanceSheet);

    // Calculate growth rates
    const bvpsGrowth = this.bvpsGrowthCalculator.calculate(incomeStmt, balanceSheet);
    const salesGrowth = this.salesGrowthCalculator.calculate(incomeStmt);
    const epsGrowth = this.epsGrowthCalculator.calculate(incomeStmt);
    const fcfGrowth = this.fcfGrowthCalculator.calculate(cashFlow);

    const recommendation = this.generateRecommendation({
      ticker,
      mostRecentYear,
      roic,
      bvpsGrowth,
      salesGrowth,
      epsGrowth,
      fcfGrowth,
      recommendation: null as any,
    });

    return {
      ticker,
      mostRecentYear,
      roic,
      bvpsGrowth,
      salesGrowth,
      epsGrowth,
      fcfGrowth,
      recommendation,
    };
  }

  /**
   * Generate investment recommendation based on Phil Town's criteria
   */

  private generateRecommendation(bigFive: BigFiveNumbers): InvestmentRecommendation {
    const THRESHOLD = 10; // 10%

    const metrics: MetricStatus[] = [
      {
        name: 'ROIC',
        value: bigFive.roic,
        passed: bigFive.roic >= THRESHOLD,
      },
      {
        name: 'BVPS Growth',
        value: bigFive.bvpsGrowth.average,
        passed: bigFive.bvpsGrowth.average >= THRESHOLD,
      },
      {
        name: 'Sales Growth',
        value: bigFive.salesGrowth.average,
        passed: bigFive.salesGrowth.average >= THRESHOLD,
      },
      {
        name: 'EPS Growth',
        value: bigFive.epsGrowth.average,
        passed: bigFive.epsGrowth.average >= THRESHOLD,
      },
      {
        name: 'FCF Growth',
        value: bigFive.fcfGrowth.average,
        passed: bigFive.fcfGrowth.average >= THRESHOLD,
      },
    ];

    const metricsPassingThreshold = metrics.filter((m) => m.passed).length;
    const totalMetrics = metrics.length;

    let status: 'STRONG_BUY' | 'CONSIDER' | 'PASS';
    if (metricsPassingThreshold >= 4) status = 'STRONG_BUY';
    else if (metricsPassingThreshold >= 3) status = 'CONSIDER';
    else status = 'PASS';

    return {
      status,
      metricsPassingThreshold,
      totalMetrics,
      details: metrics,
    };
  }
}

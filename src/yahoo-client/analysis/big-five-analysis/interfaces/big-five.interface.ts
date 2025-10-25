/**
 * Growth rates for different time periods
 */
export interface GrowthRates {
  tenYear: number; // 10-year CAGR
  fiveYear: number; // 5-year CAGR
  oneYear: number; // 1-year growth
  average: number; // Average of all periods
}

/**
 * Complete Big Five Numbers result
 */
export interface BigFiveNumbers {
  ticker: string;
  mostRecentYear: number;
  roic: number;
  bvpsGrowth: GrowthRates;
  salesGrowth: GrowthRates;
  epsGrowth: GrowthRates;
  fcfGrowth: GrowthRates;
  recommendation: InvestmentRecommendation;
}

/**
 * Investment recommendation based on Phil Town's criteria
 */
export interface InvestmentRecommendation {
  status: 'STRONG_BUY' | 'CONSIDER' | 'PASS';
  metricsPassingThreshold: number; // Number of metrics passing 10%
  totalMetrics: number;
  details: MetricStatus[];
}

/**
 * Status of individual metric
 */
export interface MetricStatus {
  name: string;
  value: number;
  passed: boolean; // true if >= 10%
}

/**
 * Financial data from Yahoo Finance API (Income Statement)
 */
export interface IncomeStmtData {
  [year: string]: {
    TotalRevenue: number; // For Sales Growth
    EBIT: number; // For ROIC calculation
    DilutedEPS: number; // For EPS Growth
    TaxRateForCalcs: number; // For ROIC (already calculated!)
    DilutedAverageShares: number; // For BVPS calculation
  };
}

/**
 * Balance sheet data from Yahoo Finance API
 */
export interface BalanceSheetData {
  [year: string]: {
    StockholdersEquity: number; // For BVPS & ROIC
    TotalDebt: number; // For ROIC
  };
}

/**
 * Cash flow data from Yahoo Finance API
 */
export interface CashFlowData {
  [year: string]: {
    FreeCashFlow: number; // For FCF Growth (already calculated!)
  };
}

/**
 * Combined financial reports needed for Big Five calculation
 */
export interface CombinedFinancialData {
  incomeStmt: IncomeStmtData;
  balanceSheet: BalanceSheetData;
  cashFlow: CashFlowData;
}

/**
 * Year-value pair for calculations
 */
export interface YearValue {
  year: number;
  value: number;
}

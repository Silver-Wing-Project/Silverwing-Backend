import { GrowthRates, YearValue } from '../interfaces/big-five.interface';

/**
 * Base Calculator class with common utility methods for Big Five analysis calculators.
 */
export class BaseCalculator {
  /**
   * Phil Town's recommended minimum growth rate
   */
  protected static readonly PHIL_TOWN_THRESHOLD = 10;

  /**
   * Calculates the Compound Annual Growth Rate (CAGR).
   * Note: CAGR does not support negative starting or ending values mathematically.
   * In such cases, we return 0 as a fail-safe/warning.
   */
  protected calculateCAGR(startValue: number, endValue: number, years: number): number {
    if (years <= 0) return 0;

    if (startValue <= 0 || endValue <= 0) {
      return 0;
    }
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  }

  /**
   * Calculate simple year-over-year growth rate
   */
  protected calculateYoYGrowthRate(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;

    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  }

  /**
   * Extract year from date string like '2024-09-30T00:00:00.000'
   */
  protected extractYear(dateString: string): number {
    return parseInt(dateString.split('-')[0]);
  }

  /**
   * Get sorted years from data object (newest to oldest)
   */
  protected getSortedYears(data: any): string[] {
    if (!data) return [];
    return Object.keys(data).sort((a, b) => {
      return this.extractYear(b) - this.extractYear(a);
    });
  }

  /**
   * Calculate growth rates for different periods
   */

  protected calculateGrowthRates(values: YearValue[]): GrowthRates {
    const growthRates: GrowthRates = {
      tenYear: 0,
      fiveYear: 0,
      oneYear: 0,
      average: 0,
    };

    if (!values || values.length < 2) {
      return growthRates;
    }

    const sortedValues = [...values].sort((a, b) => b.year - a.year);
    const mostRecent = sortedValues[0];

    // 1-Year Growth (YoY)
    const oneYearAgo = sortedValues.find((v) => v.year === mostRecent.year - 1);
    if (oneYearAgo) {
      growthRates.oneYear = this.calculateYoYGrowthRate(oneYearAgo.value, mostRecent.value);
    }

    // 5-year growth rate (CAGR)
    const fiveYearAgo = sortedValues.find((v) => v.year === mostRecent.year - 5);
    if (fiveYearAgo) {
      growthRates.fiveYear = this.calculateCAGR(fiveYearAgo.value, mostRecent.value, 5);
    }

    // 10-year growth rate (CAGR)
    const tenYearAgo = sortedValues.find((v) => v.year === mostRecent.year - 10);
    if (tenYearAgo) {
      growthRates.tenYear = this.calculateCAGR(tenYearAgo.value, mostRecent.value, 10);
    }

    // Average growth rate (only for non-zero values, or simple average)
    // const validGrowthRates = [growthRates.tenYear, growthRates.fiveYear, growthRates.oneYear].filter((g) => g !== 0);

    const maxYearsAvailable = mostRecent.year - sortedValues[sortedValues.length - 1].year;
    const periodsToAverage = [];
    if (maxYearsAvailable >= 1) periodsToAverage.push(growthRates.oneYear);
    if (maxYearsAvailable >= 5) periodsToAverage.push(growthRates.fiveYear);
    if (maxYearsAvailable >= 10) periodsToAverage.push(growthRates.tenYear);

    // const periods = [growthRates.tenYear, growthRates.fiveYear, growthRates.oneYear].filter((r) => r !== 0);

    growthRates.average =
      periodsToAverage.length > 0 ? periodsToAverage.reduce((sum, val) => sum + val, 0) / periodsToAverage.length : 0;

    return growthRates;
  }

  /**
   * Check if metric meets Phil Town's threshold
   */
  protected meetsThreshold(value: number): boolean {
    return value >= BaseCalculator.PHIL_TOWN_THRESHOLD;
  }
}

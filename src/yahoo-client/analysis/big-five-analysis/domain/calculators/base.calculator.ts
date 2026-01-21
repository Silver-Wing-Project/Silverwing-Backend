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
   */
  protected calculateCAGR(startValue: number, endValue: number, years: number): number {
    if (startValue <= 0 || endValue <= 0 || years <= 0) {
      console.log(`not valid`);
      return 0;
    }
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  }

  /**
   * Calculate simple year-over-year growth rate
   */
  protected calculateYoYGrowthRate(oldValue: number, newValue: number): number {
    if (oldValue === 0) {
      return 0;
    }
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
    return Object.keys(data).sort((a, b) => {
      return this.extractYear(b) - this.extractYear(a);
    });
  }

  /**
   * Calculate growth rates for different periods
   */

  protected calculateGrowthRates(values: YearValue[]): GrowthRates {
    if (values.length < 2) {
      return {
        tenYear: 0,
        fiveYear: 0,
        oneYear: 0,
        average: 0,
      };
    }

    const sortedValues = values.sort((a, b) => b.year - a.year);
    const mostRecent = sortedValues[0];

    const growthRates: GrowthRates = {
      tenYear: 0,
      fiveYear: 0,
      oneYear: 0,
      average: 0,
    };

    // 1-year growth rate
    if (sortedValues.length >= 2) {
      const oneYearAgo = sortedValues[1];
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

    // Average growth rate (only for non-zero values)
    // const validGrowthRates = [growthRates.tenYear, growthRates.fiveYear, growthRates.oneYear].filter((g) => g !== 0);

    const periods = [];
    if (growthRates.oneYear !== 0 || sortedValues.length >= 2) periods.push(growthRates.oneYear);
    if (growthRates.fiveYear !== 0) periods.push(growthRates.fiveYear);
    if (growthRates.tenYear !== 0) periods.push(growthRates.tenYear);

    growthRates.average = periods.length > 0 ? periods.reduce((sum, g) => sum + g, 0) / periods.length : 0;

    return growthRates;
  }

  /**
   * Check if metric meets Phil Town's threshold
   */
  protected meetsThreshold(value: number): boolean {
    return value >= BaseCalculator.PHIL_TOWN_THRESHOLD;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { BaseCalculator } from '../calculators/base.calculator';
import { YearValue } from '../interfaces/big-five.interface';

class PublicBaseCalculator extends BaseCalculator {
  public testCalculateCAGR(start: number, end: number, years: number): number {
    return this.calculateCAGR(start, end, years);
  }
  public testExtractYear(date: string): number {
    return this.extractYear(date);
  }
  public testCalculateGrowthRates(values: YearValue[]) {
    return this.calculateGrowthRates(values);
  }
}

describe('BaseCalculator', () => {
  let calculator: PublicBaseCalculator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicBaseCalculator],
    }).compile();

    calculator = module.get<PublicBaseCalculator>(PublicBaseCalculator);
  });

  describe('CAGR Logic (The Math)', () => {
    it('should calculate correct growth rate for positive numbers', () => {
      // 100 -> 200 over 10 years if approx 7.18%
      const result = calculator.testCalculateCAGR(100, 200, 10);
      expect(result).toBeCloseTo(7.177, 3);
    });

    it('[MSFT Verification] should return ~10.93% given MSFT 2014 and 2024 Revenue', () => {
      // data from Excel
      const revenue2014 = 86833;
      const revenue2024 = 245122;
      const years = 10;

      // Excel Formula equivalent: (245122/86833)^(1/10) - 1
      // Expected result: ~10.935%
      const result = calculator.testCalculateCAGR(revenue2014, revenue2024, years);

      expect(result).toBeCloseTo(10.935, 2);
    });

    it('should handle "Negative to Positive" (Turnaround) by returning 0 (Safety logic)', () => {
      // CAGR fails mathematically on negative start numbers.
      // Decision: Return 0 to indicate "Not calculable / Risky".
      const result = calculator.testCalculateCAGR(-500, 1000, 5);
      expect(result).toBe(0);
    });

    it('should handle "Positive to Negative" (Crash) by returning 0 or negative flow', () => {
      // Also mathematically problematic for roots.
      const result = calculator.testCalculateCAGR(1000, -500, 5);
      expect(result).toBe(0);
    });

    it('should return 0 if `years` is 0 or negative', () => {
      expect(calculator.testCalculateCAGR(100, 200, 0)).toBe(0);
      expect(calculator.testCalculateCAGR(100, 200, -5)).toBe(0);
    });
  });

  describe('Data Parsing & Slicing', () => {
    it('should correctly slice the correct years when given more than 10 years of data', () => {
      // assume we have 15 years of data: years 2010-2024
      // we want to make sure the calculator takes 2014-2024
      const mockData: YearValue[] = [];
      for (let y = 2010; y <= 2024; y++) {
        mockData.push({ year: y, value: 100 * (y - 2000) }); // Fake linear growth
      }

      const rates = calculator.testCalculateGrowthRates(mockData);

      // verify: 2024 value = 2400. and the value of 2014 = 1400
      // expected CAGR: (2400/1400)^(1\10) - 1 = ~5.53%
      expect(rates.tenYear).toBeCloseTo(5.537, 2);
    });

    it('should return 0s if input array is empty or too short', () => {
      const rates = calculator.testCalculateGrowthRates([{ year: 2024, value: 100 }]);
      expect(rates.tenYear).toBe(0);
      expect(rates.average).toBe(0);
    });
  });
});

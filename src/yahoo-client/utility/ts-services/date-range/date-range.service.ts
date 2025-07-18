import { Injectable, Logger } from '@nestjs/common';
import { IDateRangeService } from './interfaces/date-range.interface';
import { formatDateToString } from '@utility/date-parser/date-parser.utils';

@Injectable()
export class DateRangeService implements IDateRangeService {
  private readonly logger = new Logger(DateRangeService.name);

  generateBusinessDays(startDate: Date, endDate: Date): Date[] {
    this.validateDateRange(startDate, endDate);

    const businessDays: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (this.isBusinessDay(currentDate)) {
        businessDays.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // this.logger.debug(
    //   `Generated ${businessDays.length} business days from ${formatDateToString(startDate)} to ${formatDateToString(endDate)}`,
    // );
    return businessDays;
  }

  findMissingDates(requestedDates: Date[], existingDates: Date[]): Date[] {
    this.validateDateArrays(requestedDates, existingDates);

    const existingDateStrings = existingDates.map((date) => formatDateToString(date));
    const missingDates = requestedDates.filter((date) => {
      return !existingDateStrings.includes(formatDateToString(date));
    });

    // this.logger.debug(`Found ${missingDates.length} missing dates from requested dates`);
    return missingDates;
  }

  groupConsecutiveDates(dates: Date[]): { startDate: Date; endDate: Date }[] {
    if (!Array.isArray(dates) || dates.length === 0) return [];

    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const ranges: { startDate: Date; endDate: Date }[] = [];

    let rangeStart = sortedDates[0];
    let rangeEnd = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      if (this.isConsecutiveBusinessDay(sortedDates[i - 1], sortedDates[i])) {
        rangeEnd = sortedDates[i];
      } else {
        ranges.push({ startDate: rangeStart, endDate: rangeEnd });
        rangeStart = sortedDates[i];
        rangeEnd = sortedDates[i];
      }
    }

    ranges.push({ startDate: rangeStart, endDate: rangeEnd });
    // this.logger.debug(`Grouped ${dates.length} dates into ${ranges.length} consecutive ranges`);
    return ranges;
  }

  private isConsecutiveBusinessDay(date1: Date, date2: Date): boolean {
    const nextBusinessDay = this.getNextBusinessDay(date1);
    return formatDateToString(nextBusinessDay) === formatDateToString(date2);
  }

  private getNextBusinessDay(date: Date): Date {
    const nextDay = new Date(date);
    do {
      nextDay.setDate(nextDay.getDate() + 1);
    } while (nextDay.getDay() === 0 || nextDay.getDay() === 6); // Skip weekends

    return nextDay;
  }

  private isBusinessDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate > endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }

  private validateDateArrays(requestedDates: Date[], existingDates: Date[]): void {
    if (!Array.isArray(requestedDates) || !Array.isArray(existingDates)) {
      throw new Error('Both requested and existing dates must be arrays');
    }
  }
}

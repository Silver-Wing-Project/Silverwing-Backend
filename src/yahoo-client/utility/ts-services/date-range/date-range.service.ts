import { Injectable } from '@nestjs/common';

@Injectable()
export class DateRangeService {
  /**
   * Generated an array of dates between the start and end dates(inclusive).
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns An array of dates between the start and end dates.
   * @throws Exception if the start date is after the end date.
   */
  generateDateRange(startDate: Date, endDate: Date): Date[] {
    if (startDate > endDate) throw new Error('Start date cannot be after end date');

    const dateArray: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  /**
   * Finds missing dates by comparing requested range with existing range.
   * @param requestedRange - The requested date range.
   * @param existingRange - The existing date range.
   * @returns An array of missing dates.
   * @throws Exception if the requested range is not an array or if the existing range is
   */
  findMissingDates(requestedRange: Date[], existingRange: Date[]): Date[] {
    if (!Array.isArray(requestedRange) || !Array.isArray(existingRange))
      throw new Error('One or both ranges are not arrays');

    const existingDateStrings = existingRange.map((date) => date.toISOString().split('T')[0]);

    return requestedRange.filter((date) => {
      const dateString = date.toISOString().split('T')[0];
      return !existingDateStrings.includes(dateString);
    });
  }

  /**
   * Groups consecutive dates into ranges.
   * @param dates - An array of dates to group.
   * @returns An array of objects representing the start and end of each grouped date range.
   */
  groupConsecutiveDates(dates: Date[]): { start: Date; end: Date }[] {
    if (!Array.isArray(dates) || dates.length === 0) return [];

    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const groupedRanges: { start: Date; end: Date }[] = [];
    let rangeStart = sortedDates[0];
    let rangeEnd = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const previousDate = sortedDates[i - 1];

      // Check if dates are consecutive (accounting for weekends)
      const dayDiff = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
      if (dayDiff <= 3) {
        rangeEnd = currentDate;
      } else {
        groupedRanges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = currentDate;
        rangeEnd = currentDate;
      }
    }

    // Push the last range
    groupedRanges.push({ start: rangeStart, end: rangeEnd });

    return groupedRanges;
  }
}

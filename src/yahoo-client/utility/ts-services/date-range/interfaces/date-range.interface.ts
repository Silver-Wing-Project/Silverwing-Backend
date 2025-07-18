export interface IDateRangeService {
  generateBusinessDays(startDate: Date, endDate: Date): Date[];
  findMissingDates(requestedDates: Date[], existingDates: Date[]): Date[];
  groupConsecutiveDates(dates: Date[]): Array<{ startDate: Date; endDate: Date }>;
}

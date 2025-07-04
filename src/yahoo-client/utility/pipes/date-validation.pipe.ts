import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }
    return date;
  }
}

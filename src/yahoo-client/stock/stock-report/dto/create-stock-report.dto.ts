import { IsString, IsDate, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { parseDate } from '../../../utility/date-parser/date-parser.utils';

export class CreateStockReportDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  reportType: string;

  @IsNotEmpty()
  @IsObject()
  content: Record<string, any>;

  constructor(partial: Partial<CreateStockReportDto>) {
    Object.assign(this, partial);
    this.date = parseDate(this.date);
  }
}

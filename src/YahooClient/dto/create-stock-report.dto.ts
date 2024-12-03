import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockReportDto {
  @IsString()
  ticker: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  reportType: string;

  @IsString()
  content: string;
}
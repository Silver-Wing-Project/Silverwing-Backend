import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockReportDto {
  @IsString()
  _id: string;

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

import { IsString, IsDate, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockReportDto {
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

  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;
}

import { IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockPriceDto {
  @IsString()
  ticker: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  open: number;

  @IsNumber()
  close: number;

  @IsNumber()
  high: number;

  @IsNumber()
  low: number;

  @IsNumber()
  volume: number;
}
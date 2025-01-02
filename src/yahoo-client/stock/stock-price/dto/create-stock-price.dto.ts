import { IsString, IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStockPriceDto {
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

  @IsNumber()
  @IsNotEmpty()
  open: number;

  @IsNumber()
  @IsNotEmpty()
  close: number;

  @IsNumber()
  @IsNotEmpty()
  high: number;

  @IsNumber()
  @IsNotEmpty()
  low: number;

  @IsNumber()
  @IsNotEmpty()
  volume: number;
}

import { IsString, IsDate, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { parseDate } from 'src/yahoo-client/utility/date-parser/date-parser.utils';

export class UpdateStockPriceDto {
  @ApiProperty({ description: 'Stock Price ID' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Stock Ticker' })
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @ApiProperty({ description: 'Stock Price Date' })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Stock Price Open' })
  @IsNumber()
  @IsNotEmpty()
  open: number;

  @ApiProperty({ description: 'Stock Price Close' })
  @IsNumber()
  @IsNotEmpty()
  close: number;

  @ApiProperty({ description: 'Stock Price High' })
  @IsNumber()
  @IsNotEmpty()
  high: number;

  @ApiProperty({ description: 'Stock Price Low' })
  @IsNumber()
  @IsNotEmpty()
  low: number;

  @ApiProperty({ description: 'Stock Price Volume' })
  @IsNumber()
  @IsNotEmpty()
  volume: number;

  constructor(partial: Partial<UpdateStockPriceDto>) {
    Object.assign(this, partial);
    this.date = parseDate(this.date);
  }
}

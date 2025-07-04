import { IsString, IsDate, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
// import { parseDate } from '@utility/date-parser/date-parser.utils';

export class CreateStockReportDto {
  @ApiProperty({ description: 'Stock Report ID' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Stock Ticker' })
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @ApiProperty({ description: 'Stock Report Date' })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Stock Report Type' })
  @IsString()
  @IsNotEmpty()
  reportType: string;

  @ApiProperty({ description: 'Stock Report Content' })
  @IsNotEmpty()
  @IsObject()
  content: Record<string, any>;

  constructor(partial: Partial<CreateStockReportDto>) {
    Object.assign(this, partial);
    // this.date = parseDate(this.date);
  }
}

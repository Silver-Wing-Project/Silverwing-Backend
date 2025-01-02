import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsDate, IsNotEmpty, IsObject } from 'class-validator';

export type StockReportDocument = StockReport & Document;

@Schema()
export class StockReport {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  _id: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, index: true, type: String })
  ticker: string;

  @IsDate()
  @IsNotEmpty()
  @Prop({ required: true, index: true, type: Date })
  date: Date;
  
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, type: String })
  reportType: string;

  @IsObject()
  @IsNotEmpty()
  @Prop({ required: true, type: Object })
  content: Record<string, any>;
}

export const StockReportSchema = SchemaFactory.createForClass(StockReport);
StockReportSchema.index(
  { ticker: 1, date: 1, reportType: 1 },
  { unique: true },
);

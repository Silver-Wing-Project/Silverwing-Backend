import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsDate } from 'class-validator';

export type StockReportDocument = StockReport & Document;

@Schema()
export class StockReport {
  @IsString()
  @Prop({ required: true, type: String })
  _id: string;

  @IsString()
  @Prop({ required: true, index: true, type: String })
  ticker: string;

  @IsDate()
  @Prop({ required: true, index: true, type: Date })
  date: Date;

  @IsString()
  @Prop({ required: true, type: String })
  reportType: string;

  @IsString()
  @Prop({ required: true, type: String })
  content: string;
}

export const StockReportSchema = SchemaFactory.createForClass(StockReport);
StockReportSchema.index({ ticker: 1, date: 1, reportType: 1 }, { unique: true });
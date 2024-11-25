import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockReportDocument = StockReport & Document;

@Schema()
export class StockReport {
  @Prop({ required: true, index: true })
  ticker: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true })
  reportType: string;

  @Prop({ required: true })
  content: string;
}

export const StockReportSchema = SchemaFactory.createForClass(StockReport);
StockReportSchema.index({ ticker: 1, date: 1, reportType: 1 }, { unique: true });
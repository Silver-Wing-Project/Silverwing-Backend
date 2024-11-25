import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockPriceDocument = StockPrice & Document;

@Schema()
export class StockPrice {
  @Prop({ required: true, index: true })
  ticker: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true })
  open: number;

  @Prop({ required: true })
  close: number;

  @Prop({ required: true })
  high: number;

  @Prop({ required: true })
  low: number;

  @Prop({ required: true })
  volume: number;
}

export const StockPriceSchema = SchemaFactory.createForClass(StockPrice);
StockPriceSchema.index({ ticker: 1, date: 1 }, { unique: true });
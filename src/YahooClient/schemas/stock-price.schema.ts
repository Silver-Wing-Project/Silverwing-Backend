import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsDate, IsNumber } from 'class-validator';

export type StockPriceDocument = StockPrice & Document;

@Schema()
export class StockPrice {
  @IsString()
  @Prop({ required: true, type: String })
  _id: string;

  @IsString()
  @Prop({ required: true, index: true, type: String })
  ticker: string;

  @IsDate()
  @Prop({ required: true, index: true, type: Date })
  date: Date;

  @IsNumber()
  @Prop({ required: true , type: Number })
  open: number;

  @IsNumber()
  @Prop({ required: true, type: Number })
  close: number;

  @IsNumber()
  @Prop({ required: true, type: Number })
  high: number;

  @IsNumber()
  @Prop({ required: true, type: Number })
  low: number;

  @IsNumber()
  @Prop({ required: true, type: Number })
  volume: number;
}

export const StockPriceSchema = SchemaFactory.createForClass(StockPrice);
StockPriceSchema.index({ ticker: 1, date: 1 }, { unique: true });
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export type StockPriceDocument = StockPrice & Document;

@Schema()
export class StockPrice {
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

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true, type: Number })
  open: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true, type: Number })
  close: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true, type: Number })
  high: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true, type: Number })
  low: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true, type: Number })
  volume: number;
}

export const StockPriceSchema = SchemaFactory.createForClass(StockPrice);
StockPriceSchema.index({ ticker: 1, date: 1 }, { unique: true });

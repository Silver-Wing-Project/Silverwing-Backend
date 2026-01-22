import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockPriceController } from './stock-price.controller';
import { StockPriceService } from './stock-price.service';
import { StockPriceRepository } from './repositories/stock-price.repository';
import { StockPrice, StockPriceSchema } from './entities/stock-price.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: StockPrice.name, schema: StockPriceSchema }])],
  controllers: [StockPriceController],
  providers: [StockPriceService, StockPriceRepository],
  exports: [StockPriceService, StockPriceRepository],
})
export class StockPriceModule {}

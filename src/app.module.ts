import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './yahoo-client/finance/finance.module';
import { StockModule } from './yahoo-client/stock/stock.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/silverwing'),
    FinanceModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

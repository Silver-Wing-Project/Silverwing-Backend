import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './yahoo-client/finance/finance.module';
import { StockModule } from './yahoo-client/stock/stock.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    FinanceModule,
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

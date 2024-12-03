import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YahooFinanceModule } from './YahooClient/yahooFinance.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/silverwing'),
    YahooFinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

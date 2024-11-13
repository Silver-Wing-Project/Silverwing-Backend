import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PythonController } from './YahooClient/python/python.controller';
import { PythonExecutorService } from './YahooClient/python/python-executor.service';
import { YahooFinanceModule } from './YahooClient/yahooFinance.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/silverwing'),
    YahooFinanceModule,
  ],
  controllers: [AppController, PythonController],
  providers: [AppService, PythonExecutorService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PythonController } from './YahooClient/python/python.controller';
import { PythonExecutorService } from './YahooClient/python-executor/python-executor.service';

@Module({
  imports: [],
  controllers: [AppController, PythonController],
  providers: [AppService, PythonExecutorService],
})
export class AppModule {}

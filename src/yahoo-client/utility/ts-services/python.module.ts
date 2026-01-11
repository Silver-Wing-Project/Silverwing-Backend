import { Module } from '@nestjs/common';
import { PythonService } from '@/yahoo-client/utility/ts-services/python.service';
import { PythonExecutorService } from '../python-executor/python-executor.service';

@Module({
  providers: [PythonService, PythonExecutorService],
  exports: [PythonService],
})
export class PythonModule {}

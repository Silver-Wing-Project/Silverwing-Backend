import { Module } from '@nestjs/common';
import { PythonExecutorService } from './python-executor/python-executor.service';
import { PythonService } from './ts-services/python.service';

@Module({
  providers: [PythonExecutorService, PythonService],
  exports: [PythonExecutorService, PythonService],
})
export class UtilityModule {}

import { Controller, Get } from '@nestjs/common';
import { PythonExecutorService } from '../python-executor/python-executor.service';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonExecutorService: PythonExecutorService) {}

  @Get('run-script')
  async runScript(): Promise<string> {
    const scriptPath = 'src/YahooClient/demo.py';
    return await this.pythonExecutorService.runPythonScript(scriptPath);
  }
}
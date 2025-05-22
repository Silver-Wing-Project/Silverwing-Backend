import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { exec } from 'child_process';

export class PythonExecutionError extends Error {
  constructor(
    message: string,
    public stderr: string,
  ) {
    super(message);
    this.name = 'PythonExecutionError';
  }
}
@Injectable()
export class PythonExecutorService {
  private readonly logger = new Logger(PythonExecutorService.name);

  async executePythonScript(scriptPath: string, args: string[] = []): Promise<string> {
    const command = `python ${scriptPath} ${args.join(' ')}`;
    const options = {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONPATH: `${process.cwd()}/src/yahoo-client/utility/python`,
      },
    };

    return new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        try {
          const parsed = JSON.parse(stdout);
          if (parsed && parsed.error) {
            this.logger.error(`Python script error: ${parsed.error}`);
            reject(new NotFoundException(`Python script error: ${parsed.error}`));
            return;
          }
        } catch (e) {
          // stdout is not JSON, continue
          this.logger.debug(`Python script output is not JSON. e.message: ${e.message}`);
        }

        if (stderr && !stderr.includes('FutureWarning')) {
          this.logger.error(`Python script stderr: ${stderr}`);
          if (stderr.includes('not found')) {
            reject(new NotFoundException(`Python script or stock ticker not found: ${stderr}`));
            return;
          }
          reject(new PythonExecutionError('Python script execution failed', stderr));
          return;
        }

        if (error) {
          this.logger.error(`Error executing Python script: ${error.message}`);
          if (error.message.includes('not found') || error.message.includes('no data found')) {
            reject(new NotFoundException(`Python script not found: ${error.message}`));
            return;
          }
          reject(new PythonExecutionError(error.message, stderr));
          return;
        }

        // Log warnings but don't fail
        if (stderr) {
          this.logger.warn(`Python script warning: ${stderr}`);
        }

        this.logger.debug(`Python script stdout: ${stdout}`);
        resolve(stdout.trim());
      });
    });
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { normalizePythonError } from './python-error.utils';
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

  private static readonly NOT_FOUND_PATTERNS = [
    'not found',
    'no price data',
    'no price data found',
    'possibly delisted',
    'delisted',
    'no data found',
  ];

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
            const cleanMsg = normalizePythonError(parsed.error, args[1]);
            reject(new NotFoundException(cleanMsg));
            return;
          }
        } catch (e) {
          this.logger.debug(`Python script output is not JSON. e.message: ${e.message}`);
        }

        if (stderr && !stderr.toLowerCase().includes('futurewarning')) {
          this.logger.error(`Python script stderr: ${stderr}`);
          if (PythonExecutorService.NOT_FOUND_PATTERNS.some((pattern) => stderr.includes(pattern))) {
            const cleanMsg = normalizePythonError(stderr, args[1]);
            reject(new NotFoundException(cleanMsg));
            return;
          }
          reject(new PythonExecutionError('Python script execution failed', stderr));
          return;
        }

        if (error) {
          this.logger.error(`Error executing Python script: ${error.message}`);
          if (
            PythonExecutorService.NOT_FOUND_PATTERNS.some((pattern) =>
              error.message.toLocaleLowerCase().includes(pattern),
            )
          ) {
            const cleanMsg = normalizePythonError(error.message, args[1]);
            reject(new NotFoundException(cleanMsg));
            return;
          }
          reject(new PythonExecutionError(error.message, stderr));
          return;
        }

        this.logger.debug(`Python script stdout: ${stdout}`);
        resolve(stdout.trim());
      });
    });
  }
}

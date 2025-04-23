import { Injectable, Logger } from '@nestjs/common';
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

  async executePythonScript(
    scriptPath: string,
    args: string[] = [],
  ): Promise<string> {
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
        // Handle non-error warnings (like FutureWarning)
        if (stderr && !stderr.includes('FutureWarning')) {
          this.logger.error(`Python script stderr: ${stderr}`);
          reject(
            new PythonExecutionError('Python script execution failed', stderr),
          );
          return;
        }

        if (error) {
          this.logger.error(`Error executing Python script: ${error.message}`);
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

import {
  Injectable,
  Logger,
  NotFoundException,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { notFoundExceptionPatterns, rateLimitExceptionPatterns } from '../constants/constants';
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
          if (parsed && parsed.error && this.classifyAndRejectError(parsed.error, args[1], reject, this.logger)) return;
          // if (parsed && parsed.error) {
          //   //check #1 parsed.error
          //   this.logger.error(`Python script error: ${parsed.error}`);
          //   const cleanMsg = normalizePythonError(parsed.error, args[1]);
          //   // Rate limit errors
          //   if (rateLimitExceptionPatterns.some((pattern) => parsed.error.toLowerCase().includes(pattern))) {
          //     this.logger.warn(`Rate limit error detected: ${parsed.error}`);
          //     reject(new HttpException(cleanMsg, HttpStatus.TOO_MANY_REQUESTS));
          //     return;
          //   }
          //   // Not found errors
          //   if (notFoundExceptionPatterns.some((pattern) => parsed.error.toLowerCase().includes(pattern))) {
          //     this.logger.warn(`Not found error detected: ${parsed.error}`);
          //     reject(new NotFoundException(cleanMsg));
          //     return;
          //   }

          //   // Internal Server Error
          //   this.logger.error(`Python script execution failed with error: ${parsed.error}`);
          //   reject(new InternalServerErrorException(cleanMsg));
          //   return;
          // }
        } catch (e) {
          this.logger.debug(`Python script output is not JSON. e.message: ${e.message}`);
        }

        if (
          stderr &&
          !stderr.toLowerCase().includes('futurewarning') &&
          this.classifyAndRejectError(stderr, args[1], reject, this.logger)
        )
          return;
        //   //check #2 stderr
        //   this.logger.error(`Python script stderr: ${stderr}`);
        //   const cleanMsg = normalizePythonError(stderr, args[1]);

        //   if (rateLimitExceptionPatterns.some((pattern) => stderr.toLowerCase().includes(pattern))) {
        //     this.logger.warn(`Rate limit error detected in stderr: ${stderr}`);
        //     reject(new HttpException(cleanMsg, HttpStatus.TOO_MANY_REQUESTS));
        //     return;
        //   }
        //   if (notFoundExceptionPatterns.some((pattern) => stderr.toLowerCase().includes(pattern))) {
        //     this.logger.warn(`Not found error detected in stderr: ${stderr}`);
        //     reject(new NotFoundException(cleanMsg));
        //     return;
        //   }
        //   reject(new PythonExecutionError('Python script execution failed', stderr));
        //   return;
        // }

        if (error && this.classifyAndRejectError(error.message, args[1], reject, this.logger)) return;
        //   //check #3 error
        //   this.logger.error(`Error executing Python script: ${error.message}`);
        //   const cleanMsg = normalizePythonError(error.message, args[1]);

        //   if (rateLimitExceptionPatterns.some((pattern) => error.message.toLowerCase().includes(pattern))) {
        //     this.logger.warn(`Rate limit error detected in error message: ${error.message}`);
        //     reject(new HttpException(cleanMsg, HttpStatus.TOO_MANY_REQUESTS));
        //     return;
        //   }
        //   if (notFoundExceptionPatterns.some((pattern) => error.message.toLowerCase().includes(pattern))) {
        //     reject(new NotFoundException(cleanMsg));
        //     return;
        //   }
        //   reject(new PythonExecutionError(error.message, stderr));
        //   return;
        // }

        this.logger.debug(`Python script stdout: ${stdout}`);
        resolve(stdout.trim());
      });
    });
  }

  classifyAndRejectError = (
    rawError: string,
    context: string,
    reject: (reason?: any) => void,
    logger: Logger,
  ): boolean => {
    const cleanMsg = normalizePythonError(rawError, context);
    if (rateLimitExceptionPatterns.some((pattern) => rawError.toLowerCase().includes(pattern))) {
      logger.warn(`Rate limit error detected: ${rawError}`);
      reject(new HttpException(cleanMsg, HttpStatus.TOO_MANY_REQUESTS));
      return true;
    }

    if (notFoundExceptionPatterns.some((pattern) => rawError.toLowerCase().includes(pattern))) {
      logger.warn(`Not found error detected: ${rawError}`);
      reject(new NotFoundException(cleanMsg));
      return true;
    }
    logger.error(`Unhandled error: ${rawError}`);
    reject(new InternalServerErrorException(cleanMsg));
    return false;
  };
}

import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class PythonExecutorService {
  runPythonScript(scriptPath: string, ...args: string[]): Promise<string> {
    const command = `python ${scriptPath} ${args.join(' ')}`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
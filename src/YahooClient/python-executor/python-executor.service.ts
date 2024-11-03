import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class PythonExecutorService {
    runPythonScript(scriptPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
          exec(`python ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
              reject(`Error: ${stderr}`);
            } else {
              resolve(stdout);
            }
          });
        });
    }
}

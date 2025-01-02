import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class PythonExecutorService {
  runPythonScript(scriptPath: string, args: string[] = []): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `python ${scriptPath} ${args.join(' ')}`;
      const options = {
        env: {
          ...process.env,
          PYTHONPATH: path.resolve(process.cwd(), 'src/yahoo-client/utility/python'),
        },
      };
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
          reject(new Error(stderr));
          return;
        }
        // console.log(`Python script stdout: ${stdout}`);
        resolve(stdout);
      });
    });
  }
}

import { spawn } from 'child_process';

export default (projectName: string, dbType: string) => {
  console.log('|| DEPENDENCES INSTALLATION || ');
  const command = 'npm';
  const args = ['install', '--save', '@nestjs/typeorm', 'typeorm', dbType];
  const process = spawn(command, args, {
    stdio: 'pipe',
    cwd: `./output/${projectName}`,
  });
  process.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  return new Promise((resolve, reject) => {
    process.on('close', async (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(`El proceso falló con código de salida ${code}`);
      }
    });
  });
};

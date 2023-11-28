import { spawn } from 'child_process';
import { createEndpoints } from './createEndpoints';
import { GenerateMicroserviceDto } from 'src/dtos/app.dto';

export default async (data: GenerateMicroserviceDto) => {
  console.log('|| PROJECT GENERATION|| ');
  await generateProject(data);
};

const generateProject = ({
  endpoints,
  name: projectName,
}: GenerateMicroserviceDto): Promise<number> => {
  const command = 'nest';
  const args = ['new', `output/${projectName}`];
  const process = spawn(command, args, { stdio: 'pipe' });
  process.stdin.write('1\n');
  process.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  process.stderr.on('data', (data) => {
    console.error(`${data}`);
  });
  return new Promise(async (resolve, reject) => {
    try {
      process.on('close', async (code) => {
        if (code === 0) {
          await createEndpoints(projectName, endpoints);
          console.log('Servicio generado satisfactoriamente');
          resolve(code);
        } else {
          reject(`El proceso falló con código de salida ${code}`);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

import { BadRequestException, Injectable } from '@nestjs/common';
import { GenerateMicroserviceDto } from './dtos/app.dto';
import utils from './utils';

@Injectable()
export class AppService {
  async generateMicroservice(data: GenerateMicroserviceDto) {
    try {
      await utils.generateProject(data.name);
      return 'success';
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        message: 'Error al generar microservicio',
        error,
      });
    }
  }
}

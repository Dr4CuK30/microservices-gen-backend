import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GenerateMicroserviceDto } from './dtos/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  generateMicroservice(@Body() body: GenerateMicroserviceDto) {
    return this.appService.generateMicroservice(body);
  }
}

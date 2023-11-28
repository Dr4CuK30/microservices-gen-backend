import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum EndpointTypesEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

enum LenguagesEnum {
  NODE = 'NODE',
  GO = 'GO',
}

export class GenerateMicroserviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LenguagesEnum)
  lenguage: LenguagesEnum;

  @IsArray()
  endpoints: Endpoint[];
}

export class Endpoint {
  @IsString()
  name: string;

  @IsEnum(EndpointTypesEnum)
  type: EndpointTypesEnum;
}

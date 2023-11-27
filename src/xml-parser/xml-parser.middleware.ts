import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as xml2js from 'xml2js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GenerateMicroserviceDto } from 'src/dtos/app.dto';

@Injectable()
export class XmlParserMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['content-type'] === 'application/xml') {
      let xmlData = '';

      req.on('data', (chunk) => {
        xmlData += chunk;
      });

      req.on('end', async () => {
        try {
          const parsedData = await this.parseXml(xmlData);
          const formatedData = this.modifyObjectProps(
            parsedData.data,
            (prop, value) => {
              if (typeof value === 'string') {
                return value.replaceAll(' ', '').replaceAll('\n', '');
              }
              return value;
            },
          );
          formatedData.endpoints = Object.values(formatedData?.endpoints);
          req.body = formatedData;
          const dtoInstance = plainToInstance(
            GenerateMicroserviceDto,
            req.body,
          );

          const errors = await validate(dtoInstance, {
            stopAtFirstError: true,
          });
          if (errors.length > 0) {
            const errorResponse = { message: 'Validation failed', errors: {} };
            errors.forEach((error) => {
              const propertyName = error.property;
              errorResponse.errors[propertyName] = Object.values(
                error.constraints,
              );
            });

            res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
          }
          next();
        } catch (error) {
          console.error('Error al procesar XML:', error);
          res
            .status(400)
            .send({ success: false, error: 'Error al procesar XML' });
        }
      });
    } else {
      next();
    }
  }

  private async parseXml(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(
        xmlString,
        { explicitArray: false },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  private modifyObjectProps(
    object: any,
    callback: (propiedad: string, valor: any) => any,
  ) {
    for (const propiedad in object) {
      if (object.hasOwnProperty(propiedad)) {
        if (
          typeof object[propiedad] === 'object' &&
          object[propiedad] !== null
        ) {
          object[propiedad] = this.modifyObjectProps(
            object[propiedad],
            callback,
          );
        } else {
          object[propiedad] = callback(propiedad, object[propiedad]);
        }
      }
    }
    return object;
  }
}

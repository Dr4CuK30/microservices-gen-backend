import { Endpoint } from '../dtos/app.dto';
import * as fs from 'fs-extra';

export const createEndpoints = async (
  projectName: string,
  endpoints: Endpoint[],
) => {
  const endpointsTypes = Array.from(
    new Set(endpoints.map((endpoint) => capitalizeString(endpoint.type))),
  ).join(', ');
  let endpointsString = [];
  for (const endpoint of endpoints) {
    endpointsString = endpointsString.concat(getRouteData(endpoint));
  }
  const appControllerPath = `${__dirname}/../../output/${projectName}/src/app.controller.ts`;
  try {
    const requestTypesImport = `import { Controller, ${endpointsTypes} } from '@nestjs/common';`;
    const content: string[] = (
      await fs.readFile(appControllerPath, 'utf-8')
    ).split('\n');
    content[0] = requestTypesImport;
    console.log(endpointsString);
    content.splice(6, 5, ...endpointsString);
    console.log(content);
    await fs.writeFile(appControllerPath, content.join('\n'), 'utf-8');
  } catch (err) {
    console.error(err);
  }
};

function getRouteData({ name, type }: Endpoint): string[] {
  return [
    '',
    `  @${capitalizeString(type)}('${name.toLowerCase()}')`,
    `  ${type.toLocaleLowerCase()}${capitalizeString(name)}() {`,
    `    console.log('${name} endpoint');`,
    '  }',
  ];
}

function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

import * as fs from 'fs-extra';

export default async (data) => {
  console.log('|| PROJECT CONFIGURATION ||');
  await loadTypeOrmModule(data);
  // await loadEntityConfiguration(data);
};

async function loadTypeOrmModule({ projectName, connection }) {
  const appModulePath = `${__dirname}/../../output/${projectName}/src/app.module.ts`;
  try {
    const typeormImport = `import { TypeOrmModule } from '@nestjs/typeorm';\n`;
    const content = await fs.readFile(appModulePath, 'utf-8');
    const newContent = content.replace(
      'imports: [FeedsModule],',
      `imports: [
    TypeOrmModule.forRoot({
      type: '${connection.dbType}',
      host: '${connection.dbHost}',
      port: ${connection.dbPort},
      username: '${connection.dbUser}',
      password: '${connection.dbPassword}',
      database: '${connection.dbName}',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FeedsModule,
  ],`,
    );

    await fs.writeFile(appModulePath, typeormImport + newContent, 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

// async function loadEntityConfiguration({ projectName, feedProps }) {
//   const feedsModulePath = `${__dirname}/../../output/${projectName}/src/modules/feeds/feeds.module.ts`;
//   const feedsEntityPath = `${__dirname}/../../output/${projectName}/src/modules/feeds/entities/feed.entity.ts`;
// }

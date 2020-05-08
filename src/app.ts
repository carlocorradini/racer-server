import 'reflect-metadata';
import path from 'path';
// eslint-disable-next-line no-unused-vars
import { createConnection, ConnectionOptions } from 'typeorm';
import config from '@app/config'; // Always First!
import logger from '@app/logger';
import Server from '@app/server';

createConnection(<ConnectionOptions>{
  type: config.DATABASE.TYPE,
  url: config.DATABASE.URL,
  extra: {
    ssl: config.DATABASE.SSL,
  },
  synchronize: config.DATABASE.SYNCHRONIZE,
  logging: config.DATABASE.LOGGING,
  entities: [path.join(__dirname, config.DATABASE.ENTITIES)],
  migrations: [path.join(__dirname, config.DATABASE.MIGRATIONS)],
  subscribers: [path.join(__dirname, config.DATABASE.SUBSCRIBERS)],
})
  .then(() => {
    logger.info(`Database connected`);
    return Server.getInstance().listen(config.NODE.PORT);
  })
  .then((addressInfo) => {
    logger.info(`Server running at ${addressInfo.address} on port ${addressInfo.port}`);
  })
  .catch((ex) => {
    logger.error(ex.message);
    process.exit(1);
  });

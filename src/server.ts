import app from './app';
import config from './config/config';
import { initRateLimiter } from './config/rateLimiter';
import databaseService from './service/databaseService';
import logger from './utils/logger';

const server = app.listen(config.PORT);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async() => {
  try {
    // Database connection
    const connection = await databaseService.connect()
    logger.info('DATABASE_CONNECTION', {
      meta: {
        CONNECTION_NAME: connection.name,
      }
    });

    initRateLimiter(connection)
    logger.info('RATE_LIMITER_INITIATED');

    logger.info('APPLICATION_STARTED', {
      meta: {
        PORT: config.PORT,
        SERVER_URL: config.SERVER_URL
      }
    });
  } catch (err) {
    logger.error('APPLICATION_ERROR', { meta: err });
    
    server.close((error: Error | undefined) => {
      if (error) {
        logger.error('APPLICATION ERROR', { meta: error });
      }

      process.exit(1);
    });
  }
})();

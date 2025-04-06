import app from './app';
import config from './config/config';
import logger from './utils/logger';

const server = app.listen(config.PORT);

(() => {
  try {
    // Database connection (You can actually connect here if needed)
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

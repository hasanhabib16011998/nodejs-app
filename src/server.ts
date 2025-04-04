import app from './app';
import config from './config/config';

const server = app.listen(config.PORT);

(() => {
  try {
    // Database connection (You can actually connect here if needed)
    console.info('APPLICATION_STARTED', {
      meta: {
        PORT: config.PORT,
        SERVER_URL: config.SERVER_URL
      }
    });
  } catch (err) {
    console.error('APPLICATION_ERROR', { meta: err });
    
    server.close((error: Error | undefined) => {
      if (error) {
        console.error('APPLICATION ERROR', { meta: error });
      }

      process.exit(1);
    });
  }
})();

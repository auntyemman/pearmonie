import { createApp } from './app';
import { pool } from './common/configs/database';
import { logger } from './common/configs/logger';
import { PORT } from './common/configs';
import { runMigration } from './common/utils/migrate';
import { redisService } from './common/configs/redis.service';

export class Server {
  private readonly app;

  constructor() {
    this.app = createApp();
    //this.redisService = new RedisService();
  }

  async start() {
    try {
      await runMigration();
      await pool.connect();
      redisService;
      this.app.listen(PORT, () => {
        logger.info(`app is running on port ${PORT}`);
      });
      logger.info('Server started successfully');
    } catch (error) {
      logger.error(error);
      redisService.disconnect();
      process.exit(1);
    }
  }
}

const server = new Server();
server.start();

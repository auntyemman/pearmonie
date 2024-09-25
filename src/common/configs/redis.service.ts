import { createClient, RedisClientType } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '.';
import { logger } from './logger';

export class RedisService {
  private client: RedisClientType;
  constructor() {
    this.client = createClient({
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });

    this.client.on('error', (err: unknown) => {
      logger.error('Redis Client Error', err);
    });

    this.client
      .connect()
      .then(() => {
        logger.info('Connected to Redis');
      })
      .catch((err: unknown) => {
        logger.error('Redis connection failed', err);
      });
  }

  // Set data in Redis with optional expiration time (in seconds)
  async set(key: string, value: string, expirationTimeInSeconds?: number): Promise<void> {
    try {
      if (expirationTimeInSeconds) {
        await this.client.set(key, value, {
          EX: expirationTimeInSeconds,
        });
      } else {
        await this.client.set(key, value, {
          EX: 3600,
        });
      }
    } catch (error) {
      logger.error(`Error setting key ${key} in Redis`, error);
      throw new Error('Redis SET operation failed');
    }
  }

  // Get data from Redis by key
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      logger.error(`Error getting key ${key} from Redis`, error);
      throw new Error('Redis GET operation failed');
    }
  }

  // Method to get keys by pattern
  async keys(pattern: string): Promise<string[]> {
    const keys = await this.client.keys(pattern);
    return keys;
  }

  // Invalidate (delete) data from Redis by key
  async invalidate(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Error invalidating key ${key} from Redis`, error);
      throw new Error('Redis DEL operation failed');
    }
  }

  // Check if Redis is connected
  isConnected(): boolean {
    return this.client.isOpen;
  }

  // Graceful shutdown for Redis when app closes
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      logger.error('Error disconnecting Redis', error);
      throw new Error('Redis disconnection failed');
    }
  }
}

export const redisService = new RedisService();

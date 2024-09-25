import { DATABASE_URI } from '.';
import { logger } from './logger';
import { DatabaseConnectionError } from '../utils/custom_error';
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: DATABASE_URI,
  connectionTimeoutMillis: 10000,
})
  .on('connect', () => {
    logger.info('database connected!');
  })
  .on('error', (err: unknown) => {
    logger.error(`database connection error: ${err}`);
    throw new DatabaseConnectionError();
  });

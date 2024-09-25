import { pool } from '../../common/configs/database';
import { logger } from '../../common/configs/logger';

export interface IStore {
  id: number;
  name: string;
  phone: string;
  location: string;
}

export const store = async () => {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS stores (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT NOW()
        )
      `,
    );
  } catch (error) {
    logger.error(`error creating user`);
  } finally {
    logger.info('stores table created');
  }
};

import { UserRole } from './user.dto';
import { pool } from '../../common/configs/database';
import { logger } from '../../common/configs/logger';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole | string;
  createdAt: Date;
}

export const user = async () => {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
          createdAt TIMESTAMP DEFAULT NOW()
        )
      `,
    );
  } catch (error) {
    logger.error(`error creating user table ${error}`);
  }
};

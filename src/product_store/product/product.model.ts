import { pool } from '../../common/configs/database';
import { logger } from '../../common/configs/logger';

// Product Document Interface definition
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  storeid: number;
  createdby: number;
}

// Product Table
export const product = async () => {
  try {
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          quantity INTEGER NOT NULL,
          category VARCHAR(255) NOT NULL,
          storeId INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
          createdBy INTEGER NOT NULL,
          createdAt TIMESTAMP DEFAULT NOW()
        )
      `,
    );
  } catch (error) {
    logger.error(`error creating product table ${error}`);
  } finally {
    logger.info('product table created');
  }
};

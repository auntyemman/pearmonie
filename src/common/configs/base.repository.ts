import { BadRequestError, NotFoundError } from '../utils/custom_error';
import { pool } from './database';

export class BaseRepository<T> {
  private readonly table: string;
  constructor(table: string) {
    this.table = table;
  }

  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = [];
    let i = 0;
    while (i < values.length) {
      placeholders.push(`$${i + 1}`);
      i++;
    }
    const result = await pool.query(
      `
            INSERT INTO ${this.table} (${fields}) 
            VALUES (${placeholders})
            RETURNING *
        `,
      values,
    );
    return result.rows[0];
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      throw new BadRequestError('No fields to update');
    }
    // SET clause
    const setFactory = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

    // Prepare the values array, including the user ID at the end
    const values = fields.map((field) => (data as any)[field]);
    values.push(id);
    const idPlaceholder = fields.length + 1;

    // build query
    const query = `
    UPDATE ${this.table}
    SET ${setFactory}
    WHERE id = $${idPlaceholder}
    RETURNING *
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }
    return result.rows[0];
  }

  async findById(id: number): Promise<T | null> {
    const result = await pool.query(
      `
            SELECT * FROM ${this.table}
            WHERE id = ${id}
        `,
    );
    return result.rows[0];
  }

  async findOne(query: any): Promise<T | null> {
    const result = await pool.query(
      `
            SELECT * FROM ${this.table}
            WHERE ${Object.keys(query)
              .map((key) => `${key} = '${query[key]}'`)
              .join(' AND ')}
        `,
    );
    return result.rows[0];
  }

  async findAll(): Promise<T[] | null> {
    const result = await pool.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async delete(id: number): Promise<T | null> {
    const result = await pool.query(
      `
            DELETE FROM ${this.table}
            WHERE id = ${id}
        `,
    );
    return result.rows[0];
  }
}

export default BaseRepository;

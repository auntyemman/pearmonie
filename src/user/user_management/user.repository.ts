import { BaseRepository } from '../../common/configs/base.repository';
import { IUser } from './user.model';
import { pool } from '../../common/configs/database';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await pool.query<IUser>(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length) {
      return result.rows[0];
    }
    return null;
  }
}

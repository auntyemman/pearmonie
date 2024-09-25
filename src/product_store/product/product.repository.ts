import { BaseRepository } from '../../common/configs/base.repository';
import { pool } from '../../common/configs/database';
import { paginate, PaginationResult } from '../../common/utils/pagination';
import { IProduct } from './product.model';

export class ProductRepository extends BaseRepository<IProduct> {
  private tableName = 'products';

  constructor() {
    super('products');
  }

  async findMany(query: any, limit: number, page: number): Promise<PaginationResult<IProduct>> {
    return paginate<IProduct>(pool, this.tableName, query, limit, page);
  }

  // async findMany(query: any, limit: number, page: number) {
  //   try {
  //     const offset = (page - 1) * limit;
  //     const result = await pool.query(
  //       `SELECT * FROM products WHERE ${Object.keys(query)
  //         .map((key, index) => `${key} = $${index + 1}`)
  //         .join(' AND ')}
  //        LIMIT $${Object.keys(query).length + 1} OFFSET $${Object.keys(query).length + 2}`,
  //       [...Object.values(query), limit, offset],
  //     );
  //     return result.rows;
  //   } catch (error) {
  //     throw new Error(`Error fetching products: ${error}`);
  //   }
  // }
}

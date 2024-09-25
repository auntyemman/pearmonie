import { Pool } from 'pg';

export interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export async function paginate<T>(
  pool: Pool,
  tableName: string,
  query: any,
  limit: number,
  page: number,
): Promise<PaginationResult<T>> {
  try {
    const offset = (page - 1) * limit;

    // Build query conditions dynamically
    const whereClause = Object.keys(query)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');

    // Count total items for pagination metadata
    const countQuery = `SELECT COUNT(*) FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''}`;
    const countResult = await pool.query(countQuery, Object.values(query));
    const totalItems = parseInt(countResult.rows[0].count, 10);

    // Fetch the paginated data
    const dataQuery = `
      SELECT * FROM ${tableName}
      ${whereClause ? `WHERE ${whereClause}` : ''}
      LIMIT $${Object.keys(query).length + 1}
      OFFSET $${Object.keys(query).length + 2}
    `;
    const dataResult = await pool.query(dataQuery, [...Object.values(query), limit, offset]);

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;

    return {
      data: dataResult.rows,
      totalItems,
      totalPages,
      currentPage,
      limit,
    };
  } catch (error) {
    throw new Error(`Error during pagination: ${error}`);
  }
}

// import { Pool } from 'pg';
// import { BaseRepository } from './base.repository';
// import { BadRequestError, NotFoundError } from '../utils/custom_error';
// import { pool } from './database';

// // Mock the pool object from pg
// jest.mock('./database', () => ({
//   pool: {
//     query: jest.fn(),
//   },
// }));

// describe('BaseRepository', () => {
//   let repository: BaseRepository<any>;

//   beforeEach(() => {
//     // Reset the mocks and create a new instance of the repository
//     jest.clearAllMocks();
//     repository = new BaseRepository('test_table');
//   });

//   describe('create', () => {
//     it('should insert data and return the inserted row', async () => {
//       const mockData = { name: 'Test', age: 30 };
//       const mockResult = { rows: [{ id: 1, ...mockData }] };

//       // Mock the pool.query call to return the inserted row
//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.create(mockData);

//       // Ensure the correct SQL query and values were used
//       expect(pool.query).toHaveBeenCalledWith(
//         `
//             INSERT INTO test_table (name, age)
//             VALUES ($1, $2)
//             RETURNING *
//         `,
//         ['Test', 30],
//       );

//       expect(result).toEqual(mockResult.rows[0]);
//     });
//   });

//   describe('update', () => {
//     it('should update data and return the updated row', async () => {
//       const mockData = { name: 'Updated Test', age: 35 };
//       const mockResult = { rows: [{ id: 1, ...mockData }] };

//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.update(1, mockData);

//       // Ensure the correct SQL query and values were used
//       expect(pool.query).toHaveBeenCalledWith(
//         `
//     UPDATE test_table
//     SET name = $1, age = $2
//     WHERE id = $3
//     RETURNING *
//     `,
//         ['Updated Test', 35, 1],
//       );

//       expect(result).toEqual(mockResult.rows[0]);
//     });

//     it('should throw NotFoundError if no rows are updated', async () => {
//       pool.query.mockResolvedValueOnce({ rows: [] });

//       await expect(repository.update(1, { name: 'Updated Test' })).rejects.toThrow(NotFoundError);
//     });

//     it('should throw BadRequestError if no fields to update', async () => {
//       await expect(repository.update(1, {})).rejects.toThrow(BadRequestError);
//     });
//   });

//   describe('findById', () => {
//     it('should return a row when found by id', async () => {
//       const mockResult = { rows: [{ id: 1, name: 'Test' }] };

//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.findById(1);

//       expect(pool.query).toHaveBeenCalledWith(
//         `
//             SELECT * FROM test_table
//             WHERE id = 1
//         `,
//       );

//       expect(result).toEqual(mockResult.rows[0]);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a row when found by query', async () => {
//       const mockResult = { rows: [{ id: 1, name: 'Test' }] };
//       const mockQuery = { name: 'Test', age: 30 };

//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.findOne(mockQuery);

//       expect(pool.query).toHaveBeenCalledWith(
//         `
//             SELECT * FROM test_table
//             WHERE name = 'Test' AND age = '30'
//         `,
//       );

//       expect(result).toEqual(mockResult.rows[0]);
//     });
//   });

//   describe('findAll', () => {
//     it('should return all rows', async () => {
//       const mockResult = {
//         rows: [
//           { id: 1, name: 'Test' },
//           { id: 2, name: 'Another Test' },
//         ],
//       };

//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.findAll();

//       expect(pool.query).toHaveBeenCalledWith(`SELECT * FROM test_table`);
//       expect(result).toEqual(mockResult.rows);
//     });
//   });

//   describe('delete', () => {
//     it('should delete a row and return the deleted row', async () => {
//       const mockResult = { rows: [{ id: 1, name: 'Test' }] };

//       pool.query.mockResolvedValueOnce(mockResult);

//       const result = await repository.delete(1);

//       expect(pool.query).toHaveBeenCalledWith(
//         `
//             DELETE FROM test_table
//             WHERE id = 1
//         `,
//       );

//       expect(result).toEqual(mockResult.rows[0]);
//     });
//   });
// });

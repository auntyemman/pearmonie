import { Pool } from 'pg';
import { pool } from './database';
import { logger } from './logger';
import { DatabaseConnectionError } from '../utils/custom_error';

// Mock the logger and pg Pool
jest.mock('pg', () => {
  return {
    Pool: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
    })),
  };
});

jest.mock('./logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Database connection', () => {
  let mockPoolOn: jest.Mock;

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    mockPoolOn = (Pool as unknown as jest.Mock).mock.instances[0].on;
  });

  it('should log successful database connection', () => {
    // Trigger the 'connect' event callback
    const connectCallback = mockPoolOn.mock.calls.find((call) => call[0] === 'connect')[1];
    connectCallback(); // Simulate a connection event

    // Check that logger.info was called with the correct message
    expect(logger.info).toHaveBeenCalledWith('database connected!');
  });

  it('should log error and throw DatabaseConnectionError on connection failure', () => {
    // Trigger the 'error' event callback
    const errorCallback = mockPoolOn.mock.calls.find((call) => call[0] === 'error')[1];
    const error = new Error('Connection failed');

    expect(() => {
      errorCallback(error); // Simulate an error event
    }).toThrow(DatabaseConnectionError);

    // Check that logger.error was called with the correct message
    expect(logger.error).toHaveBeenCalledWith(`database connection error: ${error}`);
  });
});

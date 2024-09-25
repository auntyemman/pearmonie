import { Server } from './server';
import { pool } from './common/configs/database';
import { logger } from './common/configs/logger';
import { PORT } from './common/configs';
import { runMigration } from './common/utils/migrate';
import { redisService } from './common/configs/redis.service';
import { createApp } from './app';

// Mocking external dependencies
jest.mock('./common/configs/database', () => ({
  pool: {
    connect: jest.fn(),
  },
}));

jest.mock('./common/utils/migrate', () => ({
  runMigration: jest.fn(),
}));

jest.mock('./common/configs/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('./common/configs/redis.service', () => ({
  redisService: {
    disconnect: jest.fn(),
  },
}));

jest.mock('./app', () => ({
  createApp: jest.fn(() => ({
    listen: jest.fn((port: number, cb: () => void) => cb()),
  })),
}));

describe('Server', () => {
  let server: Server;

  beforeEach(() => {
    server = new Server();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should start the server successfully', async () => {
    await server.start();

    expect(runMigration).toHaveBeenCalled();
    expect(pool.connect).toHaveBeenCalled();
    expect(createApp().listen).toHaveBeenCalledWith(PORT, expect.any(Function));
    expect(logger.info).toHaveBeenCalledWith(`app is running on port ${PORT}`);
    expect(logger.info).toHaveBeenCalledWith('Server started successfully');
  });

  test('should log an error and exit the process if there is a startup failure', async () => {
    const mockError = new Error('Startup error');
    (runMigration as jest.Mock).mockRejectedValueOnce(mockError);

    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`process.exit: ${code}`);
      });

    await expect(server.start()).rejects.toThrow('process.exit: 1');

    expect(runMigration).toHaveBeenCalled();
    expect(pool.connect).not.toHaveBeenCalled(); // Should not continue after migration error
    expect(logger.error).toHaveBeenCalledWith(mockError);
    expect(redisService.disconnect).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
  });
});

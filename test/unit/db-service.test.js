import Database from '../../srv/lib/database/db-service';
import axios from 'axios';

jest.mock('axios');
describe('Database', () => {
  let dbService;

  beforeEach(async () => {
    dbService = new Database(
			{
        database: 'test_db',
        user: 'test_user',
        password: 'test_password',
        createConnectionPromise: jest.fn()
      },
      {
        host: 'localhost',
        port: 3306,
        database: 'test_db',
        user: 'test_user',
        password: 'test_password'
      }
		);
  });

  describe('connect method', () => {
    it('should create a connection to the database', async () => {
      await dbService.connect()
      expect(dbService.client.createConnectionPromise).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    it('should close the database connection', async () => {
      dbService.connection = {
        close: jest.fn()
      }
      await dbService.disconnect();
      expect(dbService.connection.close).toHaveBeenCalled();
    });
  });
  
  describe('query', () => {
    it('should resolve with rows when client.exec succeeds', async () => {
      dbService.connection = {
        exec: jest.fn()
      }
      const sql = 'SELECT * FROM users WHERE id = ?';
      const args = [123];
  
      const expectedRows = [{ id: 123, name: 'John' }];
      dbService.connection.exec.mockImplementation((q, a, callback) => {
        callback(null, expectedRows);
      });
  
      const rows = await dbService.query(sql, args);
  
      expect(dbService.connection.exec).toHaveBeenCalledWith(sql, args, expect.any(Function));
      expect(rows).toEqual(expectedRows);
    });
  
    it('should reject with error when client.exec fails', async () => {
      dbService.connection = {
        exec: jest.fn()
      }
      const sql = 'SELECT * FROM users WHERE id = ?';
      const args = [123];
  
      const expectedError = new Error('Database error');
      dbService.connection.exec.mockImplementation((q, a, callback) => {
        callback(expectedError, null);
      });
  
      await expect(dbService.query(sql, args)).rejects.toEqual(expectedError);
    });
  });
  
});

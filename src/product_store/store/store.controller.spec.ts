import request from 'supertest';
import { NextFunction, Request, Response } from 'express';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { validateRequest } from '../../common/utils/request_validator';
import { CreateStoreDTO, UpdateStoreDTO } from './store.dto';

jest.mock('./store.service');
jest.mock('../../common/utils/request_validator');

describe('StoreController', () => {
  let storeController: StoreController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    storeController = new StoreController();
    mockReq = {} as Request;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStore', () => {
    it('should create a new store and return 201 status', async () => {
      const storeData = {
        phone: '081-39402-444',
        name: 'Oluchi store',
        location: 'New York',
      };

      mockReq.body = storeData;
      (validateRequest as jest.Mock).mockResolvedValue(storeData);
      (StoreService.prototype.createstore as jest.Mock).mockResolvedValue(storeData);

      await storeController.createStore(mockReq as Request, mockRes as Response, mockNext);

      expect(validateRequest).toHaveBeenCalledWith(CreateStoreDTO, storeData);
      expect(StoreService.prototype.createstore).toHaveBeenCalledWith(storeData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'store created successfully',
        data: { store: storeData },
      });
    });

    it('should call next with an error when validation fails', async () => {
      const error = new Error('Validation error');
      mockReq.body = {};
      (validateRequest as jest.Mock).mockRejectedValue(error);

      await storeController.createStore(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getStore', () => {
    it('should fetch a store by id and return 200 status', async () => {
      const storeId = 2;
      const storeData = {
        id: storeId,
        phone: '081-39402-444',
        name: 'Oluchi store',
        location: 'New York',
      };

      mockReq.params = { id: storeId.toString() };
      (StoreService.prototype.getstore as jest.Mock).mockResolvedValue(storeData);

      await storeController.getStore(mockReq as Request, mockRes as Response, mockNext);

      expect(StoreService.prototype.getstore).toHaveBeenCalledWith(storeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'store fetched successfully',
        data: { store: storeData },
      });
    });

    it('should call next with an error when fetching store fails', async () => {
      const error = new Error('Store not found');
      mockReq.params = { id: '2' };
      (StoreService.prototype.getstore as jest.Mock).mockRejectedValue(error);

      await storeController.getStore(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateStore', () => {
    it('should update an existing store and return 200 status', async () => {
      const storeId = 2;
      const updatedData = { phone: '081-39402-444' };
      const updatedStore = { id: storeId, ...updatedData };

      mockReq.params = { id: storeId.toString() };
      mockReq.body = updatedData;
      (validateRequest as jest.Mock).mockResolvedValue(updatedData);
      (StoreService.prototype.updateStore as jest.Mock).mockResolvedValue(updatedStore);

      await storeController.updateStore(mockReq as Request, mockRes as Response, mockNext);

      expect(validateRequest).toHaveBeenCalledWith(UpdateStoreDTO, updatedData);
      expect(StoreService.prototype.updateStore).toHaveBeenCalledWith(storeId, updatedData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'store updated successfully',
        data: { store: updatedStore },
      });
    });

    it('should call next with an error when validation fails during update', async () => {
      const error = new Error('Validation error');
      mockReq.body = {};
      mockReq.params = { id: '2' };
      (validateRequest as jest.Mock).mockRejectedValue(error);

      await storeController.updateStore(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteStore', () => {
    it('should delete a store and return 200 status', async () => {
      const storeId = 2;
      const deletedStore = { id: storeId };

      mockReq.params = { id: storeId.toString() };
      (StoreService.prototype.deleteStore as jest.Mock).mockResolvedValue(deletedStore);

      await storeController.deleteStore(mockReq as Request, mockRes as Response, mockNext);

      expect(StoreService.prototype.deleteStore).toHaveBeenCalledWith(storeId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'store deleted successfully',
        data: { store: deletedStore },
      });
    });

    it('should call next with an error when deleting store fails', async () => {
      const error = new Error('Store not found');
      mockReq.params = { id: '2' };
      (StoreService.prototype.deleteStore as jest.Mock).mockRejectedValue(error);

      await storeController.deleteStore(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

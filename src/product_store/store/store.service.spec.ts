import { StoreService } from './store.service';
import { StoreRepository } from './store.repository';
import { APIError, NotFoundError } from '../../common/utils/custom_error';
import { IStore } from './store.model';

jest.mock('./store.repository');

describe('StoreService', () => {
  let storeService: StoreService;
  let storeRepo: jest.Mocked<StoreRepository>;

  beforeEach(() => {
    storeService = new StoreService();
    storeRepo = new StoreRepository() as jest.Mocked<StoreRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStore', () => {
    it('should create a store successfully', async () => {
      const storeData: IStore = { id: 1, name: 'Test Store' } as IStore;
      storeRepo.create = jest.fn().mockResolvedValue(storeData);

      const result = await storeService.createstore(storeData);

      expect(storeRepo.create).toHaveBeenCalledWith(storeData);
      expect(result).toEqual(storeData);
    });

    it('should throw APIError if store creation fails', async () => {
      const storeData: IStore = { id: 1, name: 'Test Store' } as IStore;
      storeRepo.create = jest.fn().mockResolvedValue(null);

      await expect(storeService.createstore(storeData)).rejects.toThrow(APIError);
      expect(storeRepo.create).toHaveBeenCalledWith(storeData);
    });
  });

  describe('getStore', () => {
    it('should return a store by ID', async () => {
      const storeData: IStore = { id: 1, name: 'Test Store' } as IStore;
      storeRepo.findById = jest.fn().mockResolvedValue(storeData);

      const result = await storeService.getstore(1);

      expect(storeRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(storeData);
    });

    it('should throw NotFoundError if store is not found', async () => {
      storeRepo.findById = jest.fn().mockResolvedValue(null);

      await expect(storeService.getstore(1)).rejects.toThrow(NotFoundError);
      expect(storeRepo.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateStore', () => {
    it('should update a store successfully', async () => {
      const storeData: IStore = { id: 1, name: 'Updated Store' } as IStore;
      storeRepo.update = jest.fn().mockResolvedValue(storeData);

      const result = await storeService.updateStore(1, storeData);

      expect(storeRepo.update).toHaveBeenCalledWith(1, storeData);
      expect(result).toEqual(storeData);
    });

    it('should throw APIError if store update fails', async () => {
      const storeData: IStore = { id: 1, name: 'Updated Store' } as IStore;
      storeRepo.update = jest.fn().mockResolvedValue(null);

      await expect(storeService.updateStore(1, storeData)).rejects.toThrow(APIError);
      expect(storeRepo.update).toHaveBeenCalledWith(1, storeData);
    });
  });

  describe('deleteStore', () => {
    it('should delete a store successfully', async () => {
      const storeData: IStore = { id: 1, name: 'Test Store' } as IStore;
      storeRepo.delete = jest.fn().mockResolvedValue(storeData);

      const result = await storeService.deleteStore(1);

      expect(storeRepo.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(storeData);
    });

    it('should throw APIError if store deletion fails', async () => {
      storeRepo.delete = jest.fn().mockResolvedValue(null);

      await expect(storeService.deleteStore(1)).rejects.toThrow(APIError);
      expect(storeRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});

import { APIError, NotFoundError } from '../../common/utils/custom_error';
import { PaginationResult } from '../../common/utils/pagination';
import { IStore } from './store.model';
import { StoreRepository } from './store.repository';

// Service layer class for store where the business logic is implemented
export class StoreService {
  private readonly storeRepo;
  constructor() {
    this.storeRepo = new StoreRepository();
  }

  async createstore(data: IStore): Promise<IStore> {
    const store = await this.storeRepo.create(data);
    if (!store) {
      throw new APIError('Failed to create store');
    }
    return store;
  }

  async getstore(id: number): Promise<IStore> {
    const store = await this.storeRepo.findById(id);
    if (!store) {
      throw new NotFoundError('store not found');
    }
    return store;
  }

  async updateStore(id: number, data: IStore): Promise<IStore> {
    const store = await this.storeRepo.update(id, data);
    if (!store) {
      throw new APIError('Failed to update store');
    }
    return store;
  }

  async deleteStore(id: number): Promise<IStore> {
    const store = await this.storeRepo.delete(id);
    if (!store) {
      throw new APIError('Failed to update store');
    }
    return store;
  }
}

import { BaseRepository } from '../../common/configs/base.repository';
import { IStore } from './store.model';

export class StoreRepository extends BaseRepository<IStore> {
  constructor() {
    super('stores');
  }
}

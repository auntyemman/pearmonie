import { user } from '../../user/user_management/user.model';
import { store } from '../../product_store/store/store.model';
import { product } from '../../product_store/product/product.model';

export const runMigration = async () => {
  await user();
  await store();
  await product();
};

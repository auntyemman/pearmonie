import { Router } from 'express';
import { user } from './user/user_management/user.routes';
import { product } from './product_store/product/product.routes';
import { store } from './product_store/store/store.routes';
import { suggestion } from './suggestion/suggestions.routes';

export const router: Router = Router();

// each route
router.use('/', user);
router.use('/products', product);
router.use('/stores', store);
router.use('/suggestions', suggestion);

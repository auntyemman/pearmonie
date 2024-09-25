import { Router } from 'express';
import { ProductController } from './product.controller';
import { authUser } from '../../common/middlewares/auth';
import { bindMethods } from '../../common/utils/bind_method';

export const product: Router = Router();
const productCont = bindMethods(new ProductController());

product.post('/create', authUser, productCont.createProduct);
product.get('/:productId', authUser, productCont.getProduct);
product.delete('/:productId', authUser, productCont.deleteProduct);
product.get('/', authUser, productCont.getProducts);
product.put('/:productId', authUser, productCont.updateProduct);

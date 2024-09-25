import { Router } from 'express';
import { bindMethods } from '../../common/utils/bind_method';
import { StoreController } from './store.controller';
import { authUser } from '../../common/middlewares/auth';
import { adminRBAC } from '../../common/middlewares/admin.RBAC';

export const store: Router = Router();
// Bind methods to the controller
const storeCont = bindMethods(new StoreController());
// Routes definition for store
store.post('/create', authUser, adminRBAC, storeCont.createStore);
store.get('/:id', authUser, adminRBAC, storeCont.getStore);
store.put('/:id', authUser, adminRBAC, storeCont.updateStore);
store.delete('/:id', authUser, adminRBAC, storeCont.deleteStore);

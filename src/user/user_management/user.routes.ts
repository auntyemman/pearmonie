import { Router } from 'express';
import { UserController } from './user.controller';
import { authUser } from '../../common/middlewares/auth';
import { adminRBAC } from '../../common/middlewares/admin.RBAC';
import { bindMethods } from '../../common/utils/bind_method';

export const user: Router = Router();
const userCont = bindMethods(new UserController());

user.post('/auth/signup', userCont.signUp);
user.post('/auth/admin', adminRBAC, userCont.createAdmin);
user.post('/auth/login', userCont.login);
user.post('/auth/logout', authUser, userCont.logout);
user.get('/users/profile', authUser, userCont.getProfile);
user.put('/users/profile', authUser, userCont.updateProfile);

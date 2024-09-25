import { Router } from 'express';
import { SuggestionController } from './suggestion.controller';
import { authUser } from '../common/middlewares/auth';
import { bindMethods } from '../common/utils/bind_method';

export const suggestion: Router = Router();
const suggestionCont = bindMethods(new SuggestionController());

suggestion.post('/products', authUser, suggestionCont.getProductSuggestions);

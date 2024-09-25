import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/custom_error';
import { UserRole } from '../../user/user_management/user.dto';

/**
 * A middleware that checks if the current user is an admin.
 * If not, it throws a ForbiddenError.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware in the stack.
 */
export const adminRBAC = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = res.locals.user.user;
    // If the user is not an admin, throw a ForbiddenError.
    if (role !== UserRole.admin) {
      throw new ForbiddenError('You are not an admin');
    }
    next();
  } catch (err) {
    next(err);
  }
};

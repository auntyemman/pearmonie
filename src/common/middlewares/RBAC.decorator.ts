// import { Request, Response, NextFunction } from 'express';

// export const authorizeAdminOrCreator = (
//   getProductId: (req: Request) => number,
//   getCreatorId: (product: any) => number,
//   productService: any,
// ) => {
//   return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
//     const originalMethod = descriptor.value;

//     descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
//       try {
//         const { id: userId, role } = res.locals.user.user; // User info from JWT
//         const productId = getProductId(req); // Get the product ID from the request
//         const product = await productService.getProduct(productId); // Fetch the product

//         // Check if the user is admin or the creator
//         if (role !== 'admin' && getCreatorId(product) !== parseInt(userId)) {
//           return res.status(403).json({
//             status: 'fail',
//             message: 'You do not have permission to access this resource',
//           });
//         }

//         // If authorized, call the original method
//         return originalMethod.apply(this, [req, res, next]);
//       } catch (error) {
//         next(error);
//       }
//     };

//     return descriptor;
//   };
// };

// import request from 'supertest';
// import { Request, Response, NextFunction } from 'express';
// import { ProductController } from './product.controller';
// import { ProductService } from './product.service';
// import { redisService } from '../../common/configs/redis.service';
// import { validateRequest } from '../../common/utils/request_validator';

// jest.mock('./product.service');
// jest.mock('../../common/configs/redis.service');
// jest.mock('../../common/utils/request_validator');

// const mockProductService = new ProductService();
// const productController = new ProductController();

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe('ProductController', () => {
//   let mockRequest: Partial<Request>;
//   let mockResponse: Partial<Response>;
//   let nextFunction: NextFunction;

//   beforeEach(() => {
//     mockRequest = {
//       body: {},
//       params: {}, // Initialize params as an empty object
//       query: {}, // Initialize query as an empty object
//     };

//     mockResponse = {
//       locals: {
//         user: {
//           user: {
//             id: 1,
//             role: 'user', // Set to 'admin' for admin tests
//           },
//         },
//       },
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     nextFunction = jest.fn();
//   });

//   describe('createProduct', () => {
//     it('should create a product successfully', async () => {
//       const productData = { name: 'Sample Product', category: 'Sample Category' };
//       mockRequest.body = productData;
//       const validatedData = { ...productData, createdBy: 1 };

//       (validateRequest as jest.Mock).mockResolvedValue(validatedData);
//       (mockProductService.createProduct as jest.Mock).mockResolvedValue(validatedData);

//       const prod = await productController.createProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(validateRequest).toHaveBeenCalledWith(expect.anything(), mockRequest.body);
//       expect(mockProductService.createProduct).toHaveBeenCalledWith(validatedData);
//       expect(mockResponse.status).toHaveBeenCalledWith(201);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Product created successfully',
//         data: { product: prod },
//       });
//     });

//     it('should call next function on validation error', async () => {
//       mockRequest.body = { name: '' }; // Invalid data
//       (validateRequest as jest.Mock).mockRejectedValue(new Error('Validation Error'));

//       await productController.createProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
//     });
//   });

//   describe('getProduct', () => {
//     it('should fetch a product successfully', async () => {
//       mockRequest.params = { productId: '1' }; // Initialize params with productId
//       const product = { id: 1, name: 'Sample Product', createdby: 1 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);

//       await productController.getProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockProductService.getProduct).toHaveBeenCalledWith('1');
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Product fetched successfully',
//         data: { product },
//       });
//     });

//     it('should return 403 if user does not have permission', async () => {
//       mockResponse.locals!.user.user.role = 'user';
//       mockRequest.params = { productId: '2' }; // Initialize params with productId
//       const product = { id: 2, name: 'Another Product', createdby: 3 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);

//       await productController.getProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockResponse.status).toHaveBeenCalledWith(403);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'fail',
//         message: 'You do not have permission to access this resource',
//       });
//     });
//   });

//   describe('updateProduct', () => {
//     it('should update a product successfully', async () => {
//       mockRequest.params = { productId: '1' }; // Initialize params with productId
//       const updatedData = { name: 'Updated Product' };
//       const product = { id: 1, createdby: 1 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);
//       (validateRequest as jest.Mock).mockResolvedValue(updatedData);
//       (mockProductService.updateProduct as jest.Mock).mockResolvedValue(updatedData);

//       await productController.updateProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockProductService.getProduct).toHaveBeenCalledWith(1);
//       expect(validateRequest).toHaveBeenCalledWith(expect.anything(), mockRequest.body);
//       expect(mockProductService.updateProduct).toHaveBeenCalledWith(1, updatedData);
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Product updated successfully',
//         data: { updatedProduct: updatedData },
//       });
//     });

//     it('should return 403 if user does not have permission to update the product', async () => {
//       mockResponse.locals!.user.user.role = 'user';
//       mockRequest.params = { productId: '1' }; // Initialize params with productId
//       const product = { id: 1, createdby: 2 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);

//       await productController.updateProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockResponse.status).toHaveBeenCalledWith(403);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'fail',
//         message: 'You do not have permission to access this resource',
//       });
//     });
//   });

//   describe('deleteProduct', () => {
//     it('should delete a product successfully', async () => {
//       mockRequest.params = { productId: '1' }; // Initialize params with productId
//       const product = { id: 1, createdby: 1 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);
//       (mockProductService.deleteProduct as jest.Mock).mockResolvedValue(null); // Assuming delete returns nothing

//       await productController.deleteProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockProductService.getProduct).toHaveBeenCalledWith(1);
//       expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Product deleted successfully',
//         data: { product },
//       });
//     });

//     it('should return 403 if user does not have permission to delete the product', async () => {
//       mockResponse.locals!.user.user.role = 'user';
//       mockRequest.params = { productId: '1' }; // Initialize params with productId
//       const product = { id: 1, createdby: 2 };

//       (mockProductService.getProduct as jest.Mock).mockResolvedValue(product);

//       await productController.deleteProduct(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(mockResponse.status).toHaveBeenCalledWith(403);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'fail',
//         message: 'You do not have permission to access this resource',
//       });
//     });
//   });

//   describe('getProducts', () => {
//     it('should fetch products successfully', async () => {
//       mockRequest.query = { limit: '10', page: '1' }; // Initialize query with values
//       const products = [
//         { id: 1, name: 'Product 1' },
//         { id: 2, name: 'Product 2' },
//       ];
//       const cacheKey = '1: /api/v1/product';

//       (redisService.get as jest.Mock).mockResolvedValue(null); // No cache
//       (mockProductService.getProducts as jest.Mock).mockResolvedValue(products);
//       (redisService.set as jest.Mock).mockResolvedValue(null); // Mock set cache

//       await productController.getProducts(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(redisService.get).toHaveBeenCalledWith(cacheKey);
//       expect(mockProductService.getProducts).toHaveBeenCalledWith({}, 10, 1);
//       expect(redisService.set).toHaveBeenCalledWith(cacheKey, JSON.stringify(products));
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Products fetched successfully',
//         data: { products },
//       });
//     });

//     it('should return products from cache if available', async () => {
//       const cacheKey = '1: /api/v1/product';
//       const cachedProducts = JSON.stringify([{ id: 1, name: 'Cached Product' }]);
//       (redisService.get as jest.Mock).mockResolvedValue(cachedProducts);

//       await productController.getProducts(
//         mockRequest as Request,
//         mockResponse as Response,
//         nextFunction,
//       );

//       expect(redisService.get).toHaveBeenCalledWith(cacheKey);
//       expect(mockProductService.getProducts).not.toHaveBeenCalled(); // Should not call service
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         status: 'success',
//         message: 'Products fetched successfully',
//         data: { products: JSON.parse(cachedProducts) },
//       });
//     });
//   });
// });

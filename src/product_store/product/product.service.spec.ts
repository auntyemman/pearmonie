// import { ProductService } from './product.service';
// import { ProductRepository } from './product.repository';
// import { IProduct } from './product.model';
// import { APIError, NotFoundError } from '../../common/utils/custom_error';
// import { PaginationResult } from '../../common/utils/pagination';

// // Mock ProductRepository
// jest.mock('./product.repository');

// describe('ProductService', () => {
//   let productService: ProductService;
//   let productRepository: jest.Mocked<ProductRepository>;

//   beforeEach(() => {
//     // Initialize ProductService and its dependencies
//     productRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
//     productService = new ProductService();

//     // Override the productRepository with the mocked one
//     (productService as any).productRepository = productRepository;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createProduct', () => {
//     it('should create a product successfully', async () => {
//       const productData: IProduct = {
//         name: 'Test Product',
//         category: [],
//       } as unknown as IProduct;

//       // Mock repository methods
//       productRepository.findById.mockResolvedValue(null);
//       productRepository.create.mockResolvedValue(productData);

//       const result = await productService.createProduct(productData);

//       expect(result).toEqual(productData);
//       expect(productRepository.findById).toHaveBeenCalledWith(null);
//       expect(productRepository.create).toHaveBeenCalledWith(productData);
//     });
//   });

//   describe('getProduct', () => {
//     it('should return a product if it exists', async () => {
//       const productData: IProduct = {
//         name: 'Test Product',
//         category: [],
//       } as unknown as IProduct;

//       // Mock repository methods
//       productRepository.findById.mockResolvedValue(productData);

//       const result = await productService.getProduct(4);

//       expect(result).toEqual(productData);
//       expect(productRepository.findById).toHaveBeenCalledWith(4);
//     });

//     it('should throw NotFoundError if the product does not exist', async () => {
//       // Mock repository methods
//       productRepository.findById.mockResolvedValue(null);

//       await expect(productService.getProduct(4)).rejects.toThrow(NotFoundError);
//       expect(productRepository.findById).toHaveBeenCalledWith(4);
//     });
//   });

//   describe('deleteProduct', () => {
//     it('should delete a product successfully', async () => {
//       const productData: IProduct = {
//         name: 'Test Product',
//         category: [],
//       } as unknown as IProduct;

//       // Mock repository methods
//       productRepository.delete.mockResolvedValue(productData);

//       const result = await productService.deleteProduct(4);

//       expect(result).toEqual(productData);
//       expect(productRepository.delete).toHaveBeenCalledWith(4);
//     });

//     it('should throw APIError if deletion fails', async () => {
//       // Mock repository methods
//       productRepository.delete.mockResolvedValue(null);

//       await expect(productService.deleteProduct(4)).rejects.toThrow(APIError);
//       expect(productRepository.delete).toHaveBeenCalledWith(4);
//     });
//   });

//   describe('getProducts', () => {
//     it('should return a paginated list of products', async () => {
//       const query = {};
//       const limit = 10;
//       const page = 1;
//       const products: PaginationResult<IProduct> = {
//         data: [],
//         totalItems: 0,
//         totalPages: 1,
//         currentPage: 1,
//         limit,
//       };

//       // Mock repository methods
//       productRepository.findMany.mockResolvedValue(products);

//       const result = await productService.getProducts(query, limit, page);

//       expect(result).toEqual(products);
//       expect(productRepository.findMany).toHaveBeenCalledWith(query, limit, page);
//     });
//   });

//   describe('updateProduct', () => {
//     it('should update a product successfully', async () => {
//       const productData: IProduct = {
//         name: 'Updated Product',
//         category: [],
//       } as unknown as IProduct;

//       // Mock repository methods
//       productRepository.update.mockResolvedValue(productData);

//       const result = await productService.updateProduct(4, productData);

//       expect(result).toEqual(productData);
//       expect(productRepository.update).toHaveBeenCalledWith(4, productData);
//     });

//     it('should throw APIError if update fails', async () => {
//       const productData: IProduct = {
//         name: 'Updated Product',
//         category: [],
//       } as unknown as IProduct;

//       // Mock repository methods
//       productRepository.update.mockResolvedValue(null);

//       await expect(productService.updateProduct(4, productData)).rejects.toThrow(APIError);
//       expect(productRepository.update).toHaveBeenCalledWith(4, productData);
//     });
//   });
// });

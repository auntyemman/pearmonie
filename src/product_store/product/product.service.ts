import { ProductRepository } from './product.repository';
import { IProduct } from './product.model';
import { APIError, NotFoundError } from '../../common/utils/custom_error';
import { PaginationResult } from '../../common/utils/pagination';

export class ProductService {
  private readonly productRepository: ProductRepository;
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: IProduct): Promise<IProduct> {
    const product = await this.productRepository.create(data);
    if (!product) {
      throw new APIError('Failed to create product');
    }
    return product;
  }

  async getProduct(id: number): Promise<IProduct> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      return product;
    } catch (error) {
      throw new APIError('error getting product');
    }
  }

  async deleteProduct(id: number): Promise<IProduct> {
    const product = await this.productRepository.delete(id);
    if (!product) {
      throw new APIError('error deleting the product');
    }
    return product;
  }

  async getProducts(query: any, limit: number, page: number): Promise<PaginationResult<IProduct>> {
    try {
      const products = this.productRepository.findMany(query, limit, page);
      return products;
    } catch (error) {
      throw new APIError('error processing the endpoint');
    }
  }

  async updateProduct(id: number, data: IProduct): Promise<IProduct> {
    const product = await this.productRepository.update(id, data);
    if (!product) {
      throw new APIError('Failed to update product');
    }
    return product;
  }
}

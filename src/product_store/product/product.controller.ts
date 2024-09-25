import { Request, Response, NextFunction } from 'express';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { validateRequest } from '../../common/utils/request_validator';
import { ProductService } from './product.service';
import { redisService } from '../../common/configs/redis.service';

export class ProductController {
  private readonly productService;
  constructor() {
    this.productService = new ProductService();
  }
  async createProduct(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const { id } = res.locals.user.user;
      const payload = { ...req.body, createdBy: id };
      const validated = await validateRequest(CreateProductDTO, payload);
      const product = await this.productService.createProduct(validated);
      return res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const { id, role } = res.locals.user.user;
      const productId = parseInt(req.params.productId);
      const product = await this.productService.getProduct(productId);
      if (role !== 'admin' && product.createdby !== id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to access this resource',
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Product fetched successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const { id, role } = res.locals.user.user;
      const productId = parseInt(req.params.productId);
      const product = await this.productService.getProduct(productId);
      if (role !== 'admin' && product.createdby !== id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to access this resource',
        });
      }
      await this.productService.deleteProduct(productId);
      return res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const { id, role } = res.locals.user.user;
      // pagination
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      // query
      const { category, name } = req.query;
      const query: any = {};
      if (category) {
        query.category = category;
      }
      if (name) {
        query.name = name;
      }
      // products to be returned
      let products;
      // caching
      const cacheKey = `${id}: ${req.url}`;
      // Check cache first
      const cachedProducts = await redisService.get(cacheKey);
      if (cachedProducts) {
        products = JSON.parse(cachedProducts); // Return cached data if available
      }
      if (role !== 'admin') {
        query.createdby = id;
        products = await this.productService.getProducts(query, limit, page);
        // set cache for none admin user
        const value = JSON.stringify(products);
        await redisService.set(cacheKey, value);
      }
      products = await this.productService.getProducts(query, limit, page);
      // set cache for admin user
      const value = JSON.stringify(products);
      await redisService.set(cacheKey, value);

      return res.status(200).json({
        status: 'success',
        message: 'Products fetched successfully',
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const { id, role } = res.locals.user.user;
      const productId = parseInt(req.params.productId);
      const validated = await validateRequest(UpdateProductDTO, req.body);
      const product = await this.productService.getProduct(productId);
      if (role !== 'admin' && product.createdby !== id) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to access this resource',
        });
      }
      const updatedProduct = await this.productService.updateProduct(productId, validated);
      return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: { updatedProduct },
      });
    } catch (error) {
      next(error);
    }
  }
}

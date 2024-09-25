import { Request, Response, NextFunction } from 'express';
import { SuggestionService } from './suggestion.service';
import { ProductRepository } from '../product_store/product/product.repository';
import { NotFoundError } from '../common/utils/custom_error';

export class SuggestionController {
  private readonly suggestionService;
  private readonly productRepository;
  constructor() {
    this.suggestionService = new SuggestionService();
    this.productRepository = new ProductRepository();
  }
  async getProductSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { userPreferences } = req.body;

      if (!userPreferences) {
        return res.status(400).json({ error: 'User preferences are required' });
      }

      // Get product suggestions from the service
      const products = await this.productRepository.findAll();
      if (!products) {
        throw new NotFoundError('no product found');
      }
      const suggestions = await this.suggestionService.suggestProducts(userPreferences, products);

      return res.status(200).json({
        message: 'Product suggestions generated successfully',
        suggestions,
      });
    } catch (error) {
      next(error);
    }
  }
}

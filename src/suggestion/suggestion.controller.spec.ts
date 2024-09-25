import { Request, Response, NextFunction } from 'express';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';
import { ProductRepository } from '../product_store/product/product.repository';
import { NotFoundError } from '../common/utils/custom_error';

jest.mock('./suggestion.service');
jest.mock('../product_store/product/product.repository');

describe('SuggestionController', () => {
  let suggestionController: SuggestionController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let mockProducts: any[];

  beforeEach(() => {
    suggestionController = new SuggestionController();
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    mockProducts = [
      { id: 1, name: 'Product A' },
      { id: 2, name: 'Product B' },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProductSuggestions', () => {
    it('should return product suggestions successfully', async () => {
      mockRequest.body.userPreferences = { category: 'Electronics' };

      // Mock the behavior of the ProductRepository and SuggestionService
      (ProductRepository.prototype.findAll as jest.Mock).mockResolvedValue(mockProducts);
      (SuggestionService.prototype.suggestProducts as jest.Mock).mockResolvedValue([
        'Product A',
        'Product B',
      ]);

      await suggestionController.getProductSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(ProductRepository.prototype.findAll).toHaveBeenCalled();
      expect(SuggestionService.prototype.suggestProducts).toHaveBeenCalledWith(
        mockRequest.body.userPreferences,
        mockProducts,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Product suggestions generated successfully',
        suggestions: ['Product A', 'Product B'],
      });
    });

    it('should return 400 if user preferences are not provided', async () => {
      await suggestionController.getProductSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User preferences are required' });
    });

    it('should return 404 if no products are found', async () => {
      mockRequest.body.userPreferences = { category: 'Electronics' };
      (ProductRepository.prototype.findAll as jest.Mock).mockResolvedValue(null); // No products found

      await suggestionController.getProductSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it('should call next function on error', async () => {
      mockRequest.body.userPreferences = { category: 'Electronics' };
      const error = new Error('Some error occurred');
      (ProductRepository.prototype.findAll as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await suggestionController.getProductSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalledWith(error);
    });
  });
});

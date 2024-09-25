import { NextFunction, Request, Response } from 'express';
import { StoreService } from './store.service';
import { validateRequest } from '../../common/utils/request_validator';
import { CreateStoreDTO, UpdateStoreDTO } from './store.dto';

// Controller class for store service
export class StoreController {
  private readonly storeService;
  constructor() {
    this.storeService = new StoreService();
  }
  /**
   * Creates a new store
   * @example
   * curl -X POST \
   *   http://localhost:3000/api/v1/store \
   *   -H 'Content-Type: application/json' \
   *   -d '{"phone": "081-39402-444","name": "Oluchi store","location": "New York"}'
   * @param {Request} req - The express request object
   * @param {Response} res - The express response object
   * @param {NextFunction} next - The express next function
   * @returns {Promise<object | unknown>} - The response object
   */
  async createStore(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const data = req.body;
      const validated = await validateRequest(CreateStoreDTO, data);
      const store = await this.storeService.createstore(validated);
      return res.status(201).json({
        status: 'success',
        message: 'store created successfully',
        data: { store },
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Fetches a single store by its id
   * @example
   * curl -X GET \
   *   http://localhost:3000/api/v1/store/2
   * @param {Request} req - The express request object
   * @param {Response} res - The express response object
   * @param {NextFunction} next - The express next function
   * @returns {Promise<object | unknown>} - The response object
   */
  async getStore(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const id = parseInt(req.params.id);
      const store = await this.storeService.getstore(id);
      return res.status(200).json({
        status: 'success',
        message: 'store fetched successfully',
        data: { store },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an existing store
   * @example
   * curl -X PUT \
   *   http://localhost:3000/api/v1/store/2 \
   *   -H 'Content-Type: application/json' \
   *   -d '{"quantity": 10}'
   * @param {Request} req - The express request object
   * @param {Response} res - The express response object
   * @param {NextFunction} next - The express next function
   * @returns {Promise<object | unknown>} - The response object
   */
  async updateStore(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const id = parseInt(req.params.id);
      const validated = await validateRequest(UpdateStoreDTO, req.body);
      const store = await this.storeService.updateStore(id, validated);
      return res.status(200).json({
        status: 'success',
        message: 'store updated successfully',
        data: { store },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteStore(req: Request, res: Response, next: NextFunction): Promise<object | unknown> {
    try {
      const id = parseInt(req.params.id);
      const store = await this.storeService.deleteStore(id);
      return res.status(200).json({
        status: 'success',
        message: 'store deleted successfully',
        data: { store },
      });
    } catch (error) {
      next(error);
    }
  }
}

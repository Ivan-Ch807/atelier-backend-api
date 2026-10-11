import { Request, Response, NextFunction } from 'express';

import { OrderService } from '../services/OrderService';

export class OrderController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getAll();
      return res.status(200).json(orders);
    } catch (err) {
      return next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const order = await OrderService.getById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(order);
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newOrder = await OrderService.create(req.body);
      const fullOrder = await OrderService.getById(newOrder.id);
      return res.status(201).json(fullOrder);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updatedOrder = await OrderService.update(id, req.body);
      return res.status(200).json(updatedOrder);
    } catch (err) {
      return next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await OrderService.delete(id);
      return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
      return next(err);
    }
  }
}

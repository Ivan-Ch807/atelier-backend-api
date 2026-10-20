import { Request, Response, NextFunction } from 'express';

import { OrderResponseDTO } from '../dto/OrderResponseDTO';
import { OrderService } from '../services/OrderService';

export class OrderController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const orderService = new OrderService();
      const orders = await orderService.findAll();
      const ordersDto = orders.map((order) => new OrderResponseDTO(order));
      return res.status(200).json(ordersDto);
    } catch (err) {
      return next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const orderService = new OrderService();
      const order = await orderService.findOne(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(new OrderResponseDTO(order));
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orderService = new OrderService();
      const newOrder = await orderService.create(req.body);
      if (!newOrder) {
        return res.status(400).json({ message: 'Could not create order' });
      }
      return res.status(201).json(new OrderResponseDTO(newOrder));
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const orderService = new OrderService();
      const updatedOrder = await orderService.update(id, req.body);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      return res.status(200).json(new OrderResponseDTO(updatedOrder));
    } catch (err) {
      return next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const orderService = new OrderService();
      await orderService.delete(id);
      return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
      return next(err);
    }
  }
}

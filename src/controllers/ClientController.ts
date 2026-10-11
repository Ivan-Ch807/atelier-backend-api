import { Request, Response, NextFunction } from 'express';

import { ClientService } from '../services/ClientService';

export class ClientController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await ClientService.getAll();
      return res.status(200).json(clients);
    } catch (err) {
      return next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const client = await ClientService.getById(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      return res.status(200).json(client);
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const newClient = await ClientService.create(req.body);
      return res.status(201).json(newClient);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updatedClient = await ClientService.update(id, req.body);
      return res.status(200).json(updatedClient);
    } catch (err) {
      return next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ClientService.delete(id);
      return res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
      return next(err);
    }
  }
}

import { Request, Response, NextFunction } from 'express';

import { ClientResponseDTO } from '../dto/ClientResponseDTO';
import { ClientService } from '../services/ClientService';

export class ClientController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const clientService = new ClientService();
      const clients = await clientService.findAll();
      const clientsDto = clients.map((client) => new ClientResponseDTO(client));
      return res.status(200).json(clientsDto);
    } catch (err) {
      return next(err);
    }
  }

  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const clientService = new ClientService();
      const client = await clientService.findOne(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      return res.status(200).json(new ClientResponseDTO(client));
    } catch (err) {
      return next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clientService = new ClientService();
      const newClient = await clientService.create(req.body);
      return res.status(201).json(new ClientResponseDTO(newClient));
    } catch (err) {
      return next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const clientService = new ClientService();
      const updatedClient = await clientService.update(id, req.body);
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      return res.status(200).json(new ClientResponseDTO(updatedClient));
    } catch (err) {
      return next(err);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const clientService = new ClientService();
      await clientService.delete(id);
      return res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
      return next(err);
    }
  }
}

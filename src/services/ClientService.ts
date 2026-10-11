import { getRepository } from 'typeorm';

import { Client } from '../orm/entities/clients/Client';

export class ClientService {
  private static get repository() {
    return getRepository(Client);
  }

  static async getAll() {
    return await this.repository.createQueryBuilder('client').leftJoinAndSelect('client.orders', 'orders').getMany();
  }

  static async getById(id: number) {
    return await this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.orders', 'orders')
      .where('client.id = :id', { id })
      .getOne();
  }

  static async create(data: Partial<Client>) {
    const client = this.repository.create(data);
    return await this.repository.save(client);
  }

  static async update(id: number, data: Partial<Client>) {
    await this.repository.update(id, data);
    return await this.getById(id);
  }

  static async delete(id: number) {
    return await this.repository.delete(id);
  }
}

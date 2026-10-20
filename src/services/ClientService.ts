import { getRepository, Repository } from 'typeorm';

import { Client } from '../orm/entities/clients/Client';

export class ClientService {
  private get repository(): Repository<Client> {
    return getRepository(Client);
  }

  async findAll(): Promise<Client[]> {
    return await this.repository.createQueryBuilder('client').leftJoinAndSelect('client.orders', 'orders').getMany();
  }

  async findOne(id: number): Promise<Client | null> {
    return await this.repository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.orders', 'orders')
      .where('client.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<Client>): Promise<Client> {
    const client = this.repository.create(data);
    return await this.repository.save(client);
  }

  async update(id: number, data: Partial<Client>): Promise<Client | null> {
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

import { getRepository, Not, Repository } from 'typeorm';

import { Client } from '../orm/entities/clients/Client';
import { CustomError } from '../utils/response/custom-error/CustomError';

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
    if (data.phone) {
      const existingClient = await this.repository.findOne({ where: { phone: data.phone } });
      if (existingClient) {
        throw new CustomError(400, 'Validation', 'Create client validation error', null, null, [
          { phone: `�볺�� �� ������� '${data.phone}' ��� ����` },
        ]);
      }
    }

    const client = this.repository.create(data);
    return await this.repository.save(client);
  }

  async update(id: number, data: Partial<Client>): Promise<Client | null> {
    if (data.phone) {
      const existingClient = await this.repository.findOne({
        where: { phone: data.phone, id: Not(id) },
      });
      if (existingClient) {
        throw new CustomError(400, 'Validation', 'Update client validation error', null, null, [
          { phone: `�볺�� �� ������� '${data.phone}' ��� ����` },
        ]);
      }
    }

    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

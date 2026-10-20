import { getRepository, Repository } from 'typeorm';

import { Order } from '../orm/entities/orders/Order';

export class OrderService {
  private get repository(): Repository<Order> {
    return getRepository(Order);
  }

  async findAll(): Promise<Order[]> {
    return await this.repository.createQueryBuilder('order').leftJoinAndSelect('order.client', 'client').getMany();
  }

  async findOne(id: number): Promise<Order | null> {
    return await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .where('order.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<Order>): Promise<Order | null> {
    const targetClientId = Number(data.clientId);
    const order = this.repository.create({
      description: data.description,
      price: data.price,
      status: data.status || 'NEW',
      clientId: targetClientId,
      client: { id: targetClientId } as any,
    });
    const savedOrder = await this.repository.save(order);
    return await this.findOne(savedOrder.id);
  }

  async update(id: number, data: Partial<Order>): Promise<Order | null> {
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

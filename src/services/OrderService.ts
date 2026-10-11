import { getRepository } from 'typeorm';

import { Order } from '../orm/entities/orders/Order';

export class OrderService {
  private static get repository() {
    return getRepository(Order);
  }

  static async getAll() {
    return await this.repository.createQueryBuilder('order').leftJoinAndSelect('order.client', 'client').getMany();
  }

  static async getById(id: number) {
    return await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .where('order.id = :id', { id })
      .getOne();
  }

  static async create(data: Partial<Order>) {
    const targetClientId = Number(data.clientId);

    const order = this.repository.create({
      description: data.description,
      price: data.price,
      status: data.status || 'NEW',
      clientId: targetClientId,
      client: { id: targetClientId } as any,
    });

    const savedOrder = await this.repository.save(order);
    return await this.getById(savedOrder.id);
  }

  static async update(id: number, data: Partial<Order>) {
    await this.repository.update(id, data);
    return await this.getById(id);
  }

  static async delete(id: number) {
    return await this.repository.delete(id);
  }
}

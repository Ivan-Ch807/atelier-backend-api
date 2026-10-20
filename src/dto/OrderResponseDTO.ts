import { Order } from '../orm/entities/orders/Order';

export class OrderResponseDTO {
  id: number;
  description: string;
  price: number;
  status: string;
  clientId: number;
  clientName?: string;
  createdAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.description = order.description;
    this.price = Number(order.price);
    this.status = order.status;
    this.clientId = order.clientId;
    if (order.client) {
      this.clientName = order.client.fullName;
    }
    this.createdAt = order.created_at;
  }
}

import { Client } from '../orm/entities/clients/Client';

import { OrderResponseDTO } from './OrderResponseDTO';

export class ClientResponseDTO {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  orders?: OrderResponseDTO[];
  createdAt: Date;
  updatedAt: Date;

  constructor(client: Client) {
    this.id = client.id;
    this.fullName = client.fullName;
    this.phone = client.phone;
    this.email = client.email || null;
    this.createdAt = client.created_at;
    this.updatedAt = client.updated_at;
    if (client.orders && client.orders.length > 0) {
      this.orders = client.orders.map((order) => new OrderResponseDTO(order));
    }
  }
}

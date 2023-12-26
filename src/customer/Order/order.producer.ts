import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable } from '@nestjs/common';
import { Order } from './order.models';
import { EntityManager } from 'typeorm';

@Injectable()
export class SalesOrderService {
  constructor(@InjectQueue('order-queue') private orderQueue: Queue, private readonly entityManager: EntityManager) {
  }
  async createSalesOrderProducer(user_id: string, address_id: string, warehouse_id: string): Promise<any> {
    const orderData = { user_id, address_id, warehouse_id };
   return await this.orderQueue.add(orderData);
  }
  async getOrderStatus(orderId: string): Promise<Order | null> {
    const order = await this.entityManager.getRepository(Order).findOne({where: {id: orderId}});
    return order || null;
  }
}

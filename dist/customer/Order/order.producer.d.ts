import { Queue } from 'bull';
import { Order } from './order.models';
import { EntityManager } from 'typeorm';
export declare class SalesOrderService {
    private orderQueue;
    private readonly entityManager;
    constructor(orderQueue: Queue, entityManager: EntityManager);
    createSalesOrderProducer(user_id: string, address_id: string, warehouse_id: string): Promise<any>;
    getOrderStatus(orderId: string): Promise<Order | null>;
}

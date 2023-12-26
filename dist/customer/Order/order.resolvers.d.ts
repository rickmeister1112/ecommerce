import { DataSource } from 'typeorm';
import { SalesOrderService } from './order.producer';
import { CreateOrderResponse, OrderStatusResponse } from './order.interface';
declare const OrderTrackingResolver_base: any;
export declare class OrderTrackingResolver extends OrderTrackingResolver_base {
    constructor(dataSource: DataSource);
}
declare const ItemResolver_base: any;
export declare class ItemResolver extends ItemResolver_base {
    private dataSource;
    private salesOrderService;
    private zohohelper;
    constructor(dataSource: DataSource, salesOrderService: SalesOrderService);
    createSalesOrder(user_id: string, address_id: string, warehouse_id: string): Promise<CreateOrderResponse>;
    orderStatus(orderId: string): Promise<OrderStatusResponse>;
}
declare const OrderResolver_base: any;
export declare class OrderResolver extends OrderResolver_base {
    constructor(dataSource: DataSource);
}
declare const PackageResolver_base: any;
export declare class PackageResolver extends PackageResolver_base {
    constructor(dataSource: DataSource);
}
declare const InvoiceResolver_base: any;
export declare class InvoiceResolver extends InvoiceResolver_base {
    constructor(dataSource: DataSource);
}
export declare class OrderController {
    private dataSource;
    constructor(dataSource: DataSource);
    ping(req: Request, res: any): Promise<void>;
    salesOrderInformation(body: any, response: any): Promise<any>;
    invoiceHistory(body: any, res: any): Promise<void>;
}
export {};

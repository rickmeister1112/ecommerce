import { DataSource } from "typeorm";
import { LineItem, PackagePayload } from "./order.interface";
import { Invoice, Order } from "./order.models";
declare const OrderFlow_base: any;
export declare class OrderFlow extends OrderFlow_base {
    constructor(dataSource: DataSource);
    findOrCreateUpdateInvoice(orderNumber: string, invoiceData: any): Promise<Invoice>;
    updateItemsFromOrder(orderId: string, lineItems: LineItem[]): Promise<any>;
    updatePackages(orderId: string, packages: PackagePayload[]): Promise<any>;
    updateSalesOrder(order: any): Promise<Order>;
    updateOrder(orderData: any): Promise<boolean>;
}
export {};

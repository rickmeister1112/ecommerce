import { DataSource } from "typeorm";
import { LineItem, PackagePayload } from "./order.interface";
import { Invoice, Item, Order, Package } from "./order.models";
import { BaseAdminResolver } from "src/admin/utils/base.admin.resolver";

export class OrderFlow extends BaseAdminResolver(Order) {
    constructor(dataSource: DataSource) {
        super(dataSource)
    }
    async findOrCreateUpdateInvoice(orderNumber: string, invoiceData: any): Promise<Invoice> {
    
        // Find invoice by invoice_number and salesorder_id
        let invoice = await this.invoiceRepository.findOne({
          where: {
            invoice_number: invoiceData.invoice_number,
            order: { id: orderNumber }
          }
        });
        if (invoice) {
          this.invoiceRepository.merge(invoice, invoiceData);
        } else {
          invoice = this.invoiceRepository.create(invoiceData);
          invoice.order = orderNumber;
        }
    
        return this.invoiceRepository.save(invoice);
    }

    async updateItemsFromOrder(orderId: string, lineItems: LineItem[]) {
        const itemRepository = this.dataSource.getRepository(Item);
        console.log(orderId, lineItems);
        // Fetch all items belonging to the order in one query
        const items = await itemRepository.find({ where: { order_id: orderId } });

        // Create a map for quick lookup
        const lineItemMap = new Map(lineItems.map(item => [item.item_id, item]));

        // Iterate over the fetched items and update them
        items.forEach(item => {
            const lineItem = lineItemMap.get(item.item_id_zoho);
            if (lineItem) {
                // Update fields of the item entity
                item.quantity_delivered = lineItem.quantity_delivered.toString();
                item.quantity_backordered = lineItem.quantity_backordered.toString();
                item.quantity_invoiced = lineItem.quantity_invoiced.toString();
                item.quantity_packed = lineItem.quantity_packed.toString();
                item.item_sub_total = lineItem.item_sub_total.toString();
                item.quantity_shipped = lineItem.quantity_shipped.toString();
                item.quantity_returned = lineItem.quantity_returned.toString();
            }
        });
        // Save all updated items in one operation
        return await itemRepository.save(items);
    }

    async updatePackages(orderId: string, packages: PackagePayload[]) {
        console.log()
        const packageRepository = this.dataSource.getRepository(Package);

        for (const packageData of packages) {
            let packageEntity = await packageRepository.findOne({
                where: {
                    order_id: orderId,
                    package_id: packageData.package_id
                }
            });

            if (!packageEntity) {
                // If the package does not exist, create a new one
                packageEntity = new Package();
                packageEntity.order_id = orderId; // Set the order ID
                packageEntity.package_id = packageData.package_id;
            }

            // Update the package entity with new data
            packageEntity.status = packageData.status;
            packageEntity.quantity = packageData.quantity;
            packageEntity.shipment_id = packageData.shipment_id;
            packageEntity.package_number = packageData.package_number;
            packageEntity.shipment_status = packageData.shipment_status;
            packageEntity.tracking_number = packageData.tracking_number;
            packageEntity.shipment_number = packageData.shipment_number;
            packageEntity.shipment_date = packageData.shipment_date;


            return await packageRepository.save(packageEntity);
        }
    }

    async updateSalesOrder(order: any): Promise<Order> {

        order.paid_status = order.salesOrder_paid_status;
        order.order_status = order.salesOrder_order_status;
        order.invoiced_status = order.salesOrder_invoiced_status;
        order.shipped_status = order.salesOrder_shipped_status;
        order.status = order.salesOrder_status;
        order.shipment_date = order.shipment_date;
        return this.dataSource.getRepository(Order).save(order);

    }

    async updateOrder(orderData: any): Promise<boolean> {
        const order = await this.dataSource.getRepository(Order).findOne({
            where: {
                zoho_salesorder_id: orderData.salesOrderId,
                zoho_salesorder_number: orderData.salesOrderNumber
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }

        /* const salesOrderUpdate =  */await this.updateSalesOrder(order);
        /* const lineItemUpdate = */ await this.updateItemsFromOrder(order.id, orderData.salesOder_line_items);
       /*  const packageUpdate = */ await this.updatePackages(order.id, orderData.salesOrder_package);
        return true
    }
}

/*
1.) generate logs in case of error or missed call from webhook  
 */
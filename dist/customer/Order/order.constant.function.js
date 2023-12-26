"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderFlow = void 0;
const order_models_1 = require("./order.models");
const base_admin_resolver_1 = require("../../admin/utils/base.admin.resolver");
class OrderFlow extends (0, base_admin_resolver_1.BaseAdminResolver)(order_models_1.Order) {
    constructor(dataSource) {
        super(dataSource);
    }
    async findOrCreateUpdateInvoice(orderNumber, invoiceData) {
        let invoice = await this.invoiceRepository.findOne({
            where: {
                invoice_number: invoiceData.invoice_number,
                order: { id: orderNumber }
            }
        });
        if (invoice) {
            this.invoiceRepository.merge(invoice, invoiceData);
        }
        else {
            invoice = this.invoiceRepository.create(invoiceData);
            invoice.order = orderNumber;
        }
        return this.invoiceRepository.save(invoice);
    }
    async updateItemsFromOrder(orderId, lineItems) {
        const itemRepository = this.dataSource.getRepository(order_models_1.Item);
        console.log(orderId, lineItems);
        const items = await itemRepository.find({ where: { order_id: orderId } });
        const lineItemMap = new Map(lineItems.map(item => [item.item_id, item]));
        items.forEach(item => {
            const lineItem = lineItemMap.get(item.item_id_zoho);
            if (lineItem) {
                item.quantity_delivered = lineItem.quantity_delivered.toString();
                item.quantity_backordered = lineItem.quantity_backordered.toString();
                item.quantity_invoiced = lineItem.quantity_invoiced.toString();
                item.quantity_packed = lineItem.quantity_packed.toString();
                item.item_sub_total = lineItem.item_sub_total.toString();
                item.quantity_shipped = lineItem.quantity_shipped.toString();
                item.quantity_returned = lineItem.quantity_returned.toString();
            }
        });
        return await itemRepository.save(items);
    }
    async updatePackages(orderId, packages) {
        console.log();
        const packageRepository = this.dataSource.getRepository(order_models_1.Package);
        for (const packageData of packages) {
            let packageEntity = await packageRepository.findOne({
                where: {
                    order_id: orderId,
                    package_id: packageData.package_id
                }
            });
            if (!packageEntity) {
                packageEntity = new order_models_1.Package();
                packageEntity.order_id = orderId;
                packageEntity.package_id = packageData.package_id;
            }
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
    async updateSalesOrder(order) {
        order.paid_status = order.salesOrder_paid_status;
        order.order_status = order.salesOrder_order_status;
        order.invoiced_status = order.salesOrder_invoiced_status;
        order.shipped_status = order.salesOrder_shipped_status;
        order.status = order.salesOrder_status;
        order.shipment_date = order.shipment_date;
        return this.dataSource.getRepository(order_models_1.Order).save(order);
    }
    async updateOrder(orderData) {
        const order = await this.dataSource.getRepository(order_models_1.Order).findOne({
            where: {
                zoho_salesorder_id: orderData.salesOrderId,
                zoho_salesorder_number: orderData.salesOrderNumber
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        await this.updateSalesOrder(order);
        await this.updateItemsFromOrder(order.id, orderData.salesOder_line_items);
        await this.updatePackages(order.id, orderData.salesOrder_package);
        return true;
    }
}
exports.OrderFlow = OrderFlow;
//# sourceMappingURL=order.constant.function.js.map
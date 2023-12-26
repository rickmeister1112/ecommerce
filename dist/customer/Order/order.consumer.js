"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const product_models_1 = require("../../admin/Product/product.models");
const typeorm_1 = require("typeorm");
const cart_users_models_1 = require("../Cart/cart.users.models");
const order_models_1 = require("./order.models");
let OrderProcessor = class OrderProcessor {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async handleOrder(job) {
        const { user_id, address_id, warehouse_id } = job.data;
        console.log(job);
        try {
            let cart = await this.entityManager.getRepository(cart_users_models_1.Cart).findOne({
                where: { customer_id: user_id, address_id: address_id, warehouse_id: warehouse_id },
                relations: ['items', 'items.productWarehouse', 'items.productWarehouse.product']
            });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const productWarehouseIds = cart.items.map(item => item.productWarehouse.id);
            const productids = cart.items.map(item => item.productWarehouse.product_id);
            return await this.entityManager.transaction(async (entityManager) => {
                const lineItemsForOrder = [];
                const order = new order_models_1.Order();
                order.user_id = cart.customer_id;
                order.address_id = cart.address_id;
                order.total_amount = cart.total;
                order.zoho_contact_id = cart.zoho_contact_id;
                const savedOrder = await entityManager.save(order_models_1.Order, order);
                const warehouseProducts = await entityManager.find(product_models_1.WarehouseProduct, {
                    where: { id: (0, typeorm_1.In)(productWarehouseIds) }
                });
                const products = await entityManager.find(product_models_1.Product, {
                    where: { id: (0, typeorm_1.In)(productids) }
                });
                for (const inlineItem of cart.items) {
                    const warehouseProduct = warehouseProducts.find(wp => wp.id === inlineItem.productWarehouse.id);
                    const product = products.find(wp => wp.id === inlineItem.productWarehouse.product_id);
                    if (inlineItem.productWarehouse.is_never_out_of_stock || (inlineItem.productWarehouse.quantity >= inlineItem.quantity)) {
                        const item = new order_models_1.Item();
                        item.final_price = inlineItem.final_price;
                        item.quantity = inlineItem.quantity;
                        item.warehouse_id = inlineItem.warehouse_id;
                        item.product_warehouse_id = inlineItem.productWarehouse.id;
                        item.order_id = savedOrder.id;
                        item.item_id_zoho = inlineItem.item_id_zoho;
                        await entityManager.save(order_models_1.Item, item);
                        if (!inlineItem.productWarehouse.is_never_out_of_stock) {
                            warehouseProduct.quantity -= inlineItem.quantity;
                            product.quantity -= inlineItem.quantity;
                            await entityManager.save(product_models_1.WarehouseProduct, warehouseProduct);
                            await entityManager.save(product_models_1.Product, product);
                        }
                    }
                    await entityManager.remove(cart_users_models_1.CartInlineItem, inlineItem);
                }
                await entityManager.remove(cart_users_models_1.Cart, cart);
                const result = { status: 'success', orderId: savedOrder.id, message: 'Order processed successfully' };
                return result;
            });
        }
        catch (error) {
            const errorResult = { status: 'error', error: error.message };
            return errorResult;
        }
    }
};
exports.OrderProcessor = OrderProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderProcessor.prototype, "handleOrder", null);
exports.OrderProcessor = OrderProcessor = __decorate([
    (0, bull_1.Processor)('order-queue'),
    __metadata("design:paramtypes", [typeorm_1.EntityManager])
], OrderProcessor);
//# sourceMappingURL=order.consumer.js.map
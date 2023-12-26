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
exports.Invoice = exports.Package = exports.Item = exports.OrderTimeline = exports.Order = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
const customer_models_1 = require("../Customer/customer.models");
const product_models_1 = require("../../admin/Product/product.models");
let Order = class Order extends base_model_1.BaseModel {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, user => user.id),
    __metadata("design:type", customer_models_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Item, item => item.order),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'complete' }),
    __metadata("design:type", String)
], Order.prototype, "order_status_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 55, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "payment_mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 55, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 55, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "delivery_instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "special_instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "discount_comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_settled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_cancelled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "meta_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_total_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_service_charge", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_service_charge_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_delivery_charge_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_packaging_charge_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_total_item_discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "calc_total_tcs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "complimentary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "tip", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "cash_denomination", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.Address, address => address.id),
    (0, typeorm_1.JoinColumn)({ name: "address_id" }),
    __metadata("design:type", customer_models_1.Address)
], Order.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "address_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderTimeline, status => status.order),
    __metadata("design:type", Array)
], Order.prototype, "statusTimeline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "is_zoho_created", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "attempts_to_create_on_zoho", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "zoho_contact_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Package, packageOrder => packageOrder.order),
    __metadata("design:type", Array)
], Order.prototype, "packages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Invoice, invoice => invoice.order),
    __metadata("design:type", Array)
], Order.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.Warehouse, warehouse => warehouse.order),
    __metadata("design:type", product_models_1.Warehouse)
], Order.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "zoho_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "zoho_salesorder_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "zoho_salesorder_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paid_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "order_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "invoiced_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shipped_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shipment_date", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
let OrderTimeline = class OrderTimeline extends base_model_1.BaseModel {
};
exports.OrderTimeline = OrderTimeline;
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrderTimeline.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order, order => order.statusTimeline),
    __metadata("design:type", Order)
], OrderTimeline.prototype, "order", void 0);
exports.OrderTimeline = OrderTimeline = __decorate([
    (0, typeorm_1.Entity)()
], OrderTimeline);
let Item = class Item extends base_model_1.BaseModel {
};
exports.Item = Item;
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.WarehouseProduct),
    (0, typeorm_1.JoinColumn)({ name: 'product_warehouse_id' }),
    __metadata("design:type", product_models_1.WarehouseProduct)
], Item.prototype, "productWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Item.prototype, "product_warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order, order => order.orderItems),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Order)
], Item.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Item.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], Item.prototype, "product_warehouse_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], Item.prototype, "product_warehouse_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Item.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "final_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "total_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "item_level_discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], Item.prototype, "is_complimentary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "complimentary_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], Item.prototype, "is_discount_exempted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], Item.prototype, "is_tax_inclusive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 55, nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "group_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "cancellation_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Item.prototype, "combo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "image_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_total_agg_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_total_agg_tax_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_item_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_item_tax_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_add_on_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Item.prototype, "calc_item_discount_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "item_id_zoho", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_delivered", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_backordered", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_invoiced", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_packed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "item_sub_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_shipped", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: true }),
    __metadata("design:type", String)
], Item.prototype, "quantity_returned", void 0);
exports.Item = Item = __decorate([
    (0, typeorm_1.Entity)()
], Item);
let Package = class Package extends base_model_1.BaseModel {
};
exports.Package = Package;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Package.prototype, "package_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Package.prototype, "package_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Package.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Package.prototype, "shipment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Package.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "tracking_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Package.prototype, "shipment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "shipment_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "shipment_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "delivery_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Package.prototype, "delivery_guarantee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order, order => order.packages),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", Order)
], Package.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Package.prototype, "order_id", void 0);
exports.Package = Package = __decorate([
    (0, typeorm_1.Entity)()
], Package);
let Invoice = class Invoice extends base_model_1.BaseModel {
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "invoice_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order, order => order.packages),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", Order)
], Invoice.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Invoice.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Invoice.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Invoice.prototype, "salesorder_id", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)()
], Invoice);
//# sourceMappingURL=order.models.js.map
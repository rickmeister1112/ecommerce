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
exports.TaxBreakUp = exports.CartInlineItem = exports.Cart = void 0;
const typeorm_1 = require("typeorm");
const product_models_1 = require("../../admin/Product/product.models");
const customer_models_1 = require("../Customer/customer.models");
const base_model_1 = require("../utils/base.model");
let Cart = class Cart extends base_model_1.BaseModel {
    findOne(arg0) {
        throw new Error('Method not implemented.');
    }
};
exports.Cart = Cart;
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Cart.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Cart.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Cart.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartInlineItem, item => item.cart),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00, nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "vat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00, nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "cgst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00, nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "sgst", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00, nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00, nullable: true }),
    __metadata("design:type", Number)
], Cart.prototype, "handlingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Cart.prototype, "customer_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, user => user.carts),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_models_1.User)
], Cart.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.Address, address => address.id),
    (0, typeorm_1.JoinColumn)({ name: "address_id" }),
    __metadata("design:type", customer_models_1.Address)
], Cart.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "address_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.Outlet, outlet => outlet.cart),
    (0, typeorm_1.JoinColumn)({ name: "outlet_id" }),
    __metadata("design:type", customer_models_1.Outlet)
], Cart.prototype, "outlet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Cart.prototype, "outlet_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.Warehouse, warehouse => warehouse.cart),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", product_models_1.Warehouse)
], Cart.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "zoho_contact_id", void 0);
exports.Cart = Cart = __decorate([
    (0, typeorm_1.Entity)()
], Cart);
let CartInlineItem = class CartInlineItem extends base_model_1.BaseModel {
};
exports.CartInlineItem = CartInlineItem;
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.WarehouseProduct, productWarehouse => productWarehouse.id),
    (0, typeorm_1.JoinColumn)({ name: "product_warehouse_id" }),
    __metadata("design:type", product_models_1.WarehouseProduct)
], CartInlineItem.prototype, "productWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "product_warehouse_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "product_warehouse_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "final_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "total_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "item_level_discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, nullable: false }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], CartInlineItem.prototype, "is_complimentary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "complimentary_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], CartInlineItem.prototype, "is_discount_exempted", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false, type: "boolean" }),
    __metadata("design:type", Boolean)
], CartInlineItem.prototype, "is_tax_inclusive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 55, nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "group_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "cancellation_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "combo_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "image_link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_total_agg_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_total_agg_tax_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_item_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_item_tax_percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_add_on_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CartInlineItem.prototype, "calc_item_discount_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "saved_category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "saved_parent_category_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.Category, category => category.id),
    __metadata("design:type", product_models_1.Category)
], CartInlineItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.SubCategory, subcategory => subcategory.id),
    __metadata("design:type", product_models_1.SubCategory)
], CartInlineItem.prototype, "subcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "subcategory_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.SSubCategory, ssubcategory => ssubcategory.id),
    __metadata("design:type", product_models_1.SSubCategory)
], CartInlineItem.prototype, "ssubcategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "ssubcategory_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.CollectionReference, collectionRefernce => collectionRefernce.id),
    __metadata("design:type", product_models_1.CollectionReference)
], CartInlineItem.prototype, "collectionReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "collectionReference_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cart, cart => cart.items),
    (0, typeorm_1.JoinColumn)({ name: "cart_id" }),
    __metadata("design:type", Cart)
], CartInlineItem.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "cart_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CartInlineItem.prototype, "item_id_zoho", void 0);
exports.CartInlineItem = CartInlineItem = __decorate([
    (0, typeorm_1.Entity)()
], CartInlineItem);
let TaxBreakUp = class TaxBreakUp extends base_model_1.BaseModel {
};
exports.TaxBreakUp = TaxBreakUp;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], TaxBreakUp.prototype, "tax_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], TaxBreakUp.prototype, "tax_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], TaxBreakUp.prototype, "tax_amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CartInlineItem, CartInlineItem => CartInlineItem.id, { onDelete: 'CASCADE' }),
    __metadata("design:type", CartInlineItem)
], TaxBreakUp.prototype, "CartInlineItem", void 0);
exports.TaxBreakUp = TaxBreakUp = __decorate([
    (0, typeorm_1.Entity)()
], TaxBreakUp);
//# sourceMappingURL=cart.users.models.js.map
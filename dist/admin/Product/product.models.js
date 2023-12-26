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
exports.UserSpecificPricing = exports.BasePricing = exports.CollectionWarehouseProduct = exports.CollectionReference = exports.PincodeGroup = exports.Pincode = exports.Warehouse = exports.Product = exports.WarehouseProduct = exports.SSubCategory = exports.SubCategory = exports.Category = exports.TaxSlab = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
const customer_models_1 = require("../../customer/Customer/customer.models");
const voucher_models_1 = require("../Voucher/voucher.models");
const cart_users_models_1 = require("../../customer/Cart/cart.users.models");
const taxes_models_1 = require("../Taxes/taxes.models");
const shipping_models_1 = require("../Shipping/shipping.models");
const order_models_1 = require("../../customer/Order/order.models");
let TaxSlab = class TaxSlab extends base_model_1.BaseModel {
};
exports.TaxSlab = TaxSlab;
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], TaxSlab.prototype, "tax_percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TaxSlab.prototype, "tax_id", void 0);
exports.TaxSlab = TaxSlab = __decorate([
    (0, typeorm_1.Entity)()
], TaxSlab);
let Category = class Category extends base_model_1.BaseModel {
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Category.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubCategory, sub => sub.category),
    __metadata("design:type", Object)
], Category.prototype, "sub_categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product, p => p.category),
    __metadata("design:type", Object)
], Category.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.CategoryCoupon, categoryCoupon => categoryCoupon.category),
    __metadata("design:type", Array)
], Category.prototype, "categoryCoupons", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)()
], Category);
let SubCategory = class SubCategory extends base_model_1.BaseModel {
};
exports.SubCategory = SubCategory;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], SubCategory.prototype, "sub_category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], SubCategory.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category, category => category.id),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category)
], SubCategory.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubCategory.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SSubCategory, sub => sub.subCategory),
    __metadata("design:type", Object)
], SubCategory.prototype, "sub_categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product, p => p.sub_category),
    __metadata("design:type", Object)
], SubCategory.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.SubCategoryCoupon, subCategoryCoupon => subCategoryCoupon.subCategory),
    __metadata("design:type", Array)
], SubCategory.prototype, "subCategoryCoupons", void 0);
exports.SubCategory = SubCategory = __decorate([
    (0, typeorm_1.Entity)()
], SubCategory);
let SSubCategory = class SSubCategory extends base_model_1.BaseModel {
};
exports.SSubCategory = SSubCategory;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], SSubCategory.prototype, "ssub_category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], SSubCategory.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubCategory, (subCategory) => subCategory.id),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", String)
], SSubCategory.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SSubCategory.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product, p => p.ssub_category),
    __metadata("design:type", Object)
], SSubCategory.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.SubSubCategoryCoupon, subSubCategoryCoupon => subSubCategoryCoupon.ssubCategory),
    __metadata("design:type", Array)
], SSubCategory.prototype, "subSubCategoryCoupons", void 0);
exports.SSubCategory = SSubCategory = __decorate([
    (0, typeorm_1.Entity)()
], SSubCategory);
let WarehouseProduct = class WarehouseProduct extends base_model_1.BaseModel {
};
exports.WarehouseProduct = WarehouseProduct;
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "product_warehouse_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: '' }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "product_warehouse_description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product, (product) => product.id),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse, (warehouse) => warehouse.id),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "minimum_order_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "maximum_order_quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "increment_factor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "start_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "end_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "markup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "is_sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, (user) => user.id),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], WarehouseProduct.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], WarehouseProduct.prototype, "is_never_out_of_stock", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CollectionWarehouseProduct, (cwp) => cwp.warehouseProduct),
    __metadata("design:type", Array)
], WarehouseProduct.prototype, "collectionWarehouseProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], WarehouseProduct.prototype, "is_exempted_coupon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.ProductCoupon, productCoupon => productCoupon.warehouseProduct),
    __metadata("design:type", Array)
], WarehouseProduct.prototype, "productCoupons", void 0);
exports.WarehouseProduct = WarehouseProduct = __decorate([
    (0, typeorm_1.Entity)()
], WarehouseProduct);
let Product = class Product extends base_model_1.BaseModel {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "product_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 0 }),
    __metadata("design:type", String)
], Product.prototype, "sku_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "product_tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category, (category) => category.id),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "sub_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SubCategory, (category) => category.id),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", SubCategory)
], Product.prototype, "sub_category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "ssub_category_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SSubCategory, (category) => category.id),
    (0, typeorm_1.JoinColumn)({ name: 'ssub_category_id' }),
    __metadata("design:type", SSubCategory)
], Product.prototype, "ssub_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => taxes_models_1.Tax, (taxSlab) => taxSlab.id),
    (0, typeorm_1.JoinColumn)({ name: "inter_state_tax_id" }),
    __metadata("design:type", taxes_models_1.Tax)
], Product.prototype, "taxSlab", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "inter_state_tax_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => taxes_models_1.Tax, (taxSlab) => taxSlab.id),
    (0, typeorm_1.JoinColumn)({ name: "intra_state_tax_id" }),
    __metadata("design:type", taxes_models_1.Tax)
], Product.prototype, "taxSlabs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "intra_state_tax_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WarehouseProduct, (wp) => wp.product),
    __metadata("design:type", WarehouseProduct)
], Product.prototype, "warehouseProducts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 0 }),
    __metadata("design:type", String)
], Product.prototype, "hsn_or_sac", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 0 }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "is_synced", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "item_id_zoho", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "0" }),
    __metadata("design:type", String)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "zoho_tax_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "zoho_inter_state_tax_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Product.prototype, "zoho_intra_state_tax_id", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
let Warehouse = class Warehouse extends base_model_1.BaseModel {
};
exports.Warehouse = Warehouse;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouse_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Warehouse.prototype, "warehouse_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '0' }),
    __metadata("design:type", String)
], Warehouse.prototype, "zoho_warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PincodeGroup, group => group.warehouses),
    __metadata("design:type", Promise)
], Warehouse.prototype, "pincodeGroup", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CollectionReference, (coll) => coll.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "collections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WarehouseProduct, (prod) => prod.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CollectionWarehouseProduct, (cwp) => cwp.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "collectionWarehouseProducts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_users_models_1.Cart, cart => cart.warehouse),
    __metadata("design:type", cart_users_models_1.Cart)
], Warehouse.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shipping_models_1.Shipping, shipping => shipping.warehouse),
    __metadata("design:type", Array)
], Warehouse.prototype, "shipping", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_models_1.Order, order => order.warehouse),
    __metadata("design:type", order_models_1.Order)
], Warehouse.prototype, "order", void 0);
exports.Warehouse = Warehouse = __decorate([
    (0, typeorm_1.Entity)()
], Warehouse);
let Pincode = class Pincode extends base_model_1.BaseModel {
};
exports.Pincode = Pincode;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pincode.prototype, "pincode_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PincodeGroup, group => group.pincodes),
    __metadata("design:type", Promise)
], Pincode.prototype, "group", void 0);
exports.Pincode = Pincode = __decorate([
    (0, typeorm_1.Entity)()
], Pincode);
let PincodeGroup = class PincodeGroup extends base_model_1.BaseModel {
};
exports.PincodeGroup = PincodeGroup;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PincodeGroup.prototype, "group_name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Pincode, pincode => pincode.group),
    __metadata("design:type", Promise)
], PincodeGroup.prototype, "pincodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Warehouse, warehouse => warehouse.pincodeGroup),
    __metadata("design:type", Array)
], PincodeGroup.prototype, "warehouses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shipping_models_1.Shipping, shipping => shipping.pincodeGroup),
    __metadata("design:type", Array)
], PincodeGroup.prototype, "shipping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Object)
], PincodeGroup.prototype, "is_gst_applicable", void 0);
exports.PincodeGroup = PincodeGroup = __decorate([
    (0, typeorm_1.Entity)()
], PincodeGroup);
let CollectionReference = class CollectionReference extends base_model_1.BaseModel {
};
exports.CollectionReference = CollectionReference;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", Number)
], CollectionReference.prototype, "product_collection_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], CollectionReference.prototype, "collection_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], CollectionReference.prototype, "collection_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CollectionWarehouseProduct, (cwp) => cwp.collection),
    __metadata("design:type", Array)
], CollectionReference.prototype, "warehouse_products", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CollectionReference.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse, (warehouse) => warehouse.id),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", Warehouse)
], CollectionReference.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.CollectionCoupon, collectionCoupon => collectionCoupon.collectionReference),
    __metadata("design:type", Array)
], CollectionReference.prototype, "collectionCoupons", void 0);
exports.CollectionReference = CollectionReference = __decorate([
    (0, typeorm_1.Entity)()
], CollectionReference);
let CollectionWarehouseProduct = class CollectionWarehouseProduct extends base_model_1.BaseModel {
};
exports.CollectionWarehouseProduct = CollectionWarehouseProduct;
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CollectionWarehouseProduct.prototype, "warehouse_product_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WarehouseProduct, (wp) => wp.id),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_product_id" }),
    __metadata("design:type", WarehouseProduct)
], CollectionWarehouseProduct.prototype, "warehouseProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CollectionWarehouseProduct.prototype, "collection_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CollectionReference, (col) => col.id),
    (0, typeorm_1.JoinColumn)({ name: "collection_id" }),
    __metadata("design:type", CollectionReference)
], CollectionWarehouseProduct.prototype, "collection", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CollectionWarehouseProduct.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse, (warehouse) => warehouse.id),
    (0, typeorm_1.JoinColumn)({ name: "warehouse_id" }),
    __metadata("design:type", Warehouse)
], CollectionWarehouseProduct.prototype, "warehouse", void 0);
exports.CollectionWarehouseProduct = CollectionWarehouseProduct = __decorate([
    (0, typeorm_1.Entity)()
], CollectionWarehouseProduct);
let BasePricing = class BasePricing extends base_model_1.BaseModel {
};
exports.BasePricing = BasePricing;
__decorate([
    (0, typeorm_1.ManyToOne)(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.id),
    (0, typeorm_1.JoinColumn)({ name: 'product_warehouse_id' }),
    __metadata("design:type", WarehouseProduct)
], BasePricing.prototype, "productWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], BasePricing.prototype, "product_warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BasePricing.prototype, "slab_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], BasePricing.prototype, "min_qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BasePricing.prototype, "total_quantity_for_sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BasePricing.prototype, "total_quantity_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], BasePricing.prototype, "is_sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], BasePricing.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], BasePricing.prototype, "is_active", void 0);
exports.BasePricing = BasePricing = __decorate([
    (0, typeorm_1.Entity)()
], BasePricing);
let UserSpecificPricing = class UserSpecificPricing extends base_model_1.BaseModel {
};
exports.UserSpecificPricing = UserSpecificPricing;
__decorate([
    (0, typeorm_1.ManyToOne)(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.id),
    (0, typeorm_1.JoinColumn)({ name: 'product_warehouse_id' }),
    __metadata("design:type", WarehouseProduct)
], UserSpecificPricing.prototype, "productWarehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserSpecificPricing.prototype, "product_warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, (user) => user.id),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", customer_models_1.User)
], UserSpecificPricing.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserSpecificPricing.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Warehouse, (warehouse) => warehouse.id),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", Warehouse)
], UserSpecificPricing.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], UserSpecificPricing.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], UserSpecificPricing.prototype, "slab_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], UserSpecificPricing.prototype, "min_qty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], UserSpecificPricing.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], UserSpecificPricing.prototype, "sale_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], UserSpecificPricing.prototype, "sale_ended", void 0);
exports.UserSpecificPricing = UserSpecificPricing = __decorate([
    (0, typeorm_1.Entity)()
], UserSpecificPricing);
//# sourceMappingURL=product.models.js.map
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
exports.ExcludeCoupon = exports.UserCoupon = exports.SubSubCategoryCoupon = exports.SubCategoryCoupon = exports.CategoryCoupon = exports.CollectionCoupon = exports.ProductCoupon = exports.Coupon = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
const product_models_1 = require("../Product/product.models");
const customer_models_1 = require("../../customer/Customer/customer.models");
let Coupon = class Coupon extends base_model_1.BaseModel {
};
exports.Coupon = Coupon;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Coupon.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "couponType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Coupon.prototype, "coupounValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Coupon.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "counter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxUsage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "dailyLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "couponCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductCoupon, productCoupon => productCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "productCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CollectionCoupon, collectionCoupon => collectionCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "collectionCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CategoryCoupon, categoryCoupon => categoryCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "categoryCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubCategoryCoupon, subCategoryCoupon => subCategoryCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "subCategoryCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SubSubCategoryCoupon, subSubCategoryCoupon => subSubCategoryCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "subSubCategoryCoupons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserCoupon, userCoupon => userCoupon.coupon),
    __metadata("design:type", Array)
], Coupon.prototype, "userCoupons", void 0);
exports.Coupon = Coupon = __decorate([
    (0, typeorm_1.Entity)()
], Coupon);
let ProductCoupon = class ProductCoupon extends base_model_1.BaseModel {
};
exports.ProductCoupon = ProductCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.productCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], ProductCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProductCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.WarehouseProduct, warehouseProduct => warehouseProduct.id),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_product_id' }),
    __metadata("design:type", product_models_1.WarehouseProduct)
], ProductCoupon.prototype, "warehouseProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProductCoupon.prototype, "warehouse_product_id", void 0);
exports.ProductCoupon = ProductCoupon = __decorate([
    (0, typeorm_1.Entity)()
], ProductCoupon);
let CollectionCoupon = class CollectionCoupon extends base_model_1.BaseModel {
};
exports.CollectionCoupon = CollectionCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.collectionCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], CollectionCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CollectionCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.CollectionReference, collectionReference => collectionReference.id),
    (0, typeorm_1.JoinColumn)({ name: 'collection_id' }),
    __metadata("design:type", product_models_1.CollectionReference)
], CollectionCoupon.prototype, "collectionReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CollectionCoupon.prototype, "collection_id", void 0);
exports.CollectionCoupon = CollectionCoupon = __decorate([
    (0, typeorm_1.Entity)()
], CollectionCoupon);
let CategoryCoupon = class CategoryCoupon extends base_model_1.BaseModel {
};
exports.CategoryCoupon = CategoryCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.categoryCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], CategoryCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CategoryCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.Category, category => category.id),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", product_models_1.Category)
], CategoryCoupon.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], CategoryCoupon.prototype, "category_id", void 0);
exports.CategoryCoupon = CategoryCoupon = __decorate([
    (0, typeorm_1.Entity)()
], CategoryCoupon);
let SubCategoryCoupon = class SubCategoryCoupon extends base_model_1.BaseModel {
};
exports.SubCategoryCoupon = SubCategoryCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.subCategoryCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], SubCategoryCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubCategoryCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.SubCategory, subCategory => subCategory.id),
    (0, typeorm_1.JoinColumn)({ name: 'sub_category_id' }),
    __metadata("design:type", product_models_1.SubCategory)
], SubCategoryCoupon.prototype, "subCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubCategoryCoupon.prototype, "sub_category_id", void 0);
exports.SubCategoryCoupon = SubCategoryCoupon = __decorate([
    (0, typeorm_1.Entity)()
], SubCategoryCoupon);
let SubSubCategoryCoupon = class SubSubCategoryCoupon extends base_model_1.BaseModel {
};
exports.SubSubCategoryCoupon = SubSubCategoryCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.subSubCategoryCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], SubSubCategoryCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubSubCategoryCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.SSubCategory, sSubCategory => sSubCategory.id),
    (0, typeorm_1.JoinColumn)({ name: 'sub_sub_category_id' }),
    __metadata("design:type", product_models_1.SSubCategory)
], SubSubCategoryCoupon.prototype, "ssubCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], SubSubCategoryCoupon.prototype, "sub_sub_category_id", void 0);
exports.SubSubCategoryCoupon = SubSubCategoryCoupon = __decorate([
    (0, typeorm_1.Entity)()
], SubSubCategoryCoupon);
let UserCoupon = class UserCoupon extends base_model_1.BaseModel {
};
exports.UserCoupon = UserCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Coupon, coupon => coupon.userCoupons),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", Coupon)
], UserCoupon.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserCoupon.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, user => user.id),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", customer_models_1.User)
], UserCoupon.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserCoupon.prototype, "customer_id", void 0);
exports.UserCoupon = UserCoupon = __decorate([
    (0, typeorm_1.Entity)()
], UserCoupon);
let ExcludeCoupon = class ExcludeCoupon extends base_model_1.BaseModel {
};
exports.ExcludeCoupon = ExcludeCoupon;
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.WarehouseProduct, warehouseProduct => warehouseProduct.id),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_product_id' }),
    __metadata("design:type", product_models_1.WarehouseProduct)
], ExcludeCoupon.prototype, "warehouseProduct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ExcludeCoupon.prototype, "warehouse_product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], ExcludeCoupon.prototype, "is_Active", void 0);
exports.ExcludeCoupon = ExcludeCoupon = __decorate([
    (0, typeorm_1.Entity)()
], ExcludeCoupon);
//# sourceMappingURL=voucher.models.js.map
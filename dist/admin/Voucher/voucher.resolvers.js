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
exports.CouponUserResolver = exports.CouponCollectionResolver = exports.CouponSubCategoryResolver = exports.CouponCategoryResolver = exports.CouponProductResolver = exports.CouponSubSubCategoryResolver = exports.CouponResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_resolver_1 = require("../../customer/utils/base.resolver");
const typeorm_1 = require("typeorm");
const voucher_models_1 = require("./voucher.models");
let CouponResolver = class CouponResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.Coupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponResolver = CouponResolver;
exports.CouponResolver = CouponResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.Coupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponResolver);
let CouponSubSubCategoryResolver = class CouponSubSubCategoryResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.SubSubCategoryCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponSubSubCategoryResolver = CouponSubSubCategoryResolver;
exports.CouponSubSubCategoryResolver = CouponSubSubCategoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.SubSubCategoryCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponSubSubCategoryResolver);
let CouponProductResolver = class CouponProductResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.ProductCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponProductResolver = CouponProductResolver;
exports.CouponProductResolver = CouponProductResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.ProductCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponProductResolver);
let CouponCategoryResolver = class CouponCategoryResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.CategoryCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponCategoryResolver = CouponCategoryResolver;
exports.CouponCategoryResolver = CouponCategoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.CategoryCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponCategoryResolver);
let CouponSubCategoryResolver = class CouponSubCategoryResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.SubCategoryCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponSubCategoryResolver = CouponSubCategoryResolver;
exports.CouponSubCategoryResolver = CouponSubCategoryResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.SubCategoryCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponSubCategoryResolver);
let CouponCollectionResolver = class CouponCollectionResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.CollectionCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponCollectionResolver = CouponCollectionResolver;
exports.CouponCollectionResolver = CouponCollectionResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.CollectionCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponCollectionResolver);
let CouponUserResolver = class CouponUserResolver extends (0, base_resolver_1.BaseResolver)(voucher_models_1.UserCoupon) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CouponUserResolver = CouponUserResolver;
exports.CouponUserResolver = CouponUserResolver = __decorate([
    (0, graphql_1.Resolver)(() => voucher_models_1.UserCoupon),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CouponUserResolver);
//# sourceMappingURL=voucher.resolvers.js.map
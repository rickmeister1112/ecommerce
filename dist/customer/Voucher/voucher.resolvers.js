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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const voucher_models_1 = require("../../admin/Voucher/voucher.models");
const typeorm_1 = require("typeorm");
const cart_users_models_1 = require("../Cart/cart.users.models");
const typeorm_2 = require("@nestjs/typeorm");
const voucher_models_2 = require("./voucher.models");
const customer_models_1 = require("../Customer/customer.models");
let CouponResolver = class CouponResolver {
    constructor(couponRepository, cartRepository, productCouponRepository, categoryCouponRepository, subCategoryCouponRepository, subSubCategoryCouponRepository, collectionCouponRepository, userRepository, couponCustomerRepository, excludeCouponRepository, UserCouponRepository) {
        this.couponRepository = couponRepository;
        this.cartRepository = cartRepository;
        this.productCouponRepository = productCouponRepository;
        this.categoryCouponRepository = categoryCouponRepository;
        this.subCategoryCouponRepository = subCategoryCouponRepository;
        this.subSubCategoryCouponRepository = subSubCategoryCouponRepository;
        this.collectionCouponRepository = collectionCouponRepository;
        this.userRepository = userRepository;
        this.couponCustomerRepository = couponCustomerRepository;
        this.excludeCouponRepository = excludeCouponRepository;
        this.UserCouponRepository = UserCouponRepository;
    }
    async fetchCoupon(userId, warehouseId) {
        console.log("Redeeming coupon for UserID:", userId, "and WarehouseID:", warehouseId);
        const excludedProductIds = (await this.excludeCouponRepository.find({
            where: { is_Active: true },
            select: ['warehouse_product_id']
        })).map(ep => ep.warehouse_product_id);
        console.log("Excluded Product IDs:", excludedProductIds);
        const cart = await this.cartRepository.findOne({
            where: { customer_id: userId, warehouse_id: warehouseId },
            relations: ['items', 'items.productWarehouse', 'items.productWarehouse.product']
        });
        if (!cart) {
            throw new Error('Cart not found');
        }
        const filteredCartItems = cart.items.filter(item => !excludedProductIds.includes(item.warehouse_id));
        const productIds = filteredCartItems.map(item => item.warehouse_id);
        const categoryIds = filteredCartItems.map(item => item.category_id);
        const subCategoryIds = filteredCartItems.map(item => item.subcategory_id);
        const SSubCategoryIds = filteredCartItems.map(item => item.ssubcategory_id);
        const CollectionIds = filteredCartItems.map(item => item.collectionReference);
        const couponProductIds = (await this.productCouponRepository.find({ select: ['coupon_id'], where: { warehouse_product_id: (0, typeorm_1.In)(productIds) } })).map(ep => ep.coupon_id);
        const couponCategoryIds = (await this.categoryCouponRepository.find({ select: ['coupon_id'], where: { category_id: (0, typeorm_1.In)(categoryIds) } })).map(ep => ep.coupon_id);
        const couponSubCategoryIds = (await this.subCategoryCouponRepository.find({ select: ['coupon_id'], where: { sub_category_id: (0, typeorm_1.In)(subCategoryIds) } })).map(ep => ep.coupon_id);
        const couponSSubCategoryIds = (await this.subSubCategoryCouponRepository.find({ select: ['coupon_id'], where: { sub_sub_category_id: (0, typeorm_1.In)(SSubCategoryIds) } })).map(ep => ep.coupon_id);
        const couponCollectionIds = (await this.collectionCouponRepository.find({ select: ['coupon_id'], where: { collection_id: (0, typeorm_1.In)(CollectionIds) } })).map(ep => ep.coupon_id);
        const couponUserIds = (await this.UserCouponRepository.find({ select: ['coupon_id'], where: { customer_id: userId } })).map(ep => ep.coupon_id);
        const allCouponIds = [...couponProductIds, ...couponCategoryIds, ...couponSubCategoryIds, ...couponSSubCategoryIds, ...couponUserIds, ...couponCollectionIds];
        const uniqueCouponIds = [...new Set(allCouponIds)];
        console.log(uniqueCouponIds);
        const coupons = await this.couponRepository.find({
            where: {
                id: (0, typeorm_1.In)(uniqueCouponIds),
                isActive: true,
                expiryDate: (0, typeorm_1.MoreThan)(new Date()),
                maxUsage: (0, typeorm_1.MoreThan)(0)
            }
        });
        console.log("Applicable Coupons:", coupons);
        return coupons;
    }
    async redeemCoupon(couponId, userId) {
        const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
        if (!coupon) {
            throw new Error('Coupon not found');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        coupon.counter = (coupon.counter || 0) + 1;
        await this.couponRepository.save(coupon);
        const couponCustomer = new voucher_models_2.CouponCustomer();
        couponCustomer.coupon = coupon;
        couponCustomer.user = user;
        await this.couponCustomerRepository.save(couponCustomer);
        return coupon;
    }
};
exports.CouponResolver = CouponResolver;
__decorate([
    (0, graphql_1.Mutation)(() => voucher_models_1.Coupon),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "fetchCoupon", null);
__decorate([
    (0, graphql_1.Mutation)(() => voucher_models_1.Coupon),
    __param(0, (0, graphql_1.Args)('couponId')),
    __param(1, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CouponResolver.prototype, "redeemCoupon", null);
exports.CouponResolver = CouponResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(0, (0, typeorm_2.InjectRepository)(voucher_models_1.Coupon)),
    __param(1, (0, typeorm_2.InjectRepository)(cart_users_models_1.Cart)),
    __param(2, (0, typeorm_2.InjectRepository)(voucher_models_1.ProductCoupon)),
    __param(3, (0, typeorm_2.InjectRepository)(voucher_models_1.CategoryCoupon)),
    __param(4, (0, typeorm_2.InjectRepository)(voucher_models_1.SubCategoryCoupon)),
    __param(5, (0, typeorm_2.InjectRepository)(voucher_models_1.SubSubCategoryCoupon)),
    __param(6, (0, typeorm_2.InjectRepository)(voucher_models_1.CollectionCoupon)),
    __param(7, (0, typeorm_2.InjectRepository)(customer_models_1.User)),
    __param(8, (0, typeorm_2.InjectRepository)(voucher_models_2.CouponCustomer)),
    __param(9, (0, typeorm_2.InjectRepository)(voucher_models_1.ExcludeCoupon)),
    __param(10, (0, typeorm_2.InjectRepository)(voucher_models_1.UserCoupon)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], CouponResolver);
//# sourceMappingURL=voucher.resolvers.js.map
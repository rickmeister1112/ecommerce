"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const voucher_models_1 = require("../../admin/Voucher/voucher.models");
const voucher_resolvers_1 = require("./voucher.resolvers");
const cart_users_models_1 = require("../Cart/cart.users.models");
const voucher_models_2 = require("./voucher.models");
const customer_models_1 = require("../Customer/customer.models");
let VoucherModule = class VoucherModule {
};
exports.VoucherModule = VoucherModule;
exports.VoucherModule = VoucherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([voucher_models_1.CategoryCoupon, voucher_models_1.CollectionCoupon, voucher_models_1.Coupon, voucher_models_1.ProductCoupon, voucher_models_1.SubCategoryCoupon, voucher_models_1.SubSubCategoryCoupon, voucher_models_1.UserCoupon, cart_users_models_1.Cart, cart_users_models_1.CartInlineItem, voucher_models_2.CouponCustomer, customer_models_1.User, voucher_models_1.ExcludeCoupon]),
        ],
        providers: [
            voucher_resolvers_1.CouponResolver
        ],
        exports: [
            voucher_resolvers_1.CouponResolver
        ]
    })
], VoucherModule);
//# sourceMappingURL=voucher.module.js.map
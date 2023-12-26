"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherAdminModule = void 0;
const common_1 = require("@nestjs/common");
const voucher_resolvers_1 = require("./voucher.resolvers");
let VoucherAdminModule = class VoucherAdminModule {
};
exports.VoucherAdminModule = VoucherAdminModule;
exports.VoucherAdminModule = VoucherAdminModule = __decorate([
    (0, common_1.Module)({
        providers: [
            voucher_resolvers_1.CouponUserResolver,
            voucher_resolvers_1.CouponCollectionResolver,
            voucher_resolvers_1.CouponSubCategoryResolver,
            voucher_resolvers_1.CouponCategoryResolver,
            voucher_resolvers_1.CouponProductResolver,
            voucher_resolvers_1.CouponSubSubCategoryResolver,
            voucher_resolvers_1.CouponResolver
        ],
        exports: [
            voucher_resolvers_1.CouponUserResolver,
            voucher_resolvers_1.CouponCollectionResolver,
            voucher_resolvers_1.CouponSubCategoryResolver,
            voucher_resolvers_1.CouponCategoryResolver,
            voucher_resolvers_1.CouponProductResolver,
            voucher_resolvers_1.CouponSubSubCategoryResolver,
            voucher_resolvers_1.CouponResolver
        ]
    })
], VoucherAdminModule);
//# sourceMappingURL=voucher.module.js.map
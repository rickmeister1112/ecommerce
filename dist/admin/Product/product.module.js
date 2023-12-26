"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAdminModule = void 0;
const common_1 = require("@nestjs/common");
const product_resolvers_1 = require("./product.resolvers");
let ProductAdminModule = class ProductAdminModule {
};
exports.ProductAdminModule = ProductAdminModule;
exports.ProductAdminModule = ProductAdminModule = __decorate([
    (0, common_1.Module)({
        providers: [
            product_resolvers_1.TaxSlabAdminResolver,
            product_resolvers_1.CategoryResolver,
            product_resolvers_1.SubCategoryResolver,
            product_resolvers_1.SSubCategoryResolver,
            product_resolvers_1.ProductResolver,
            product_resolvers_1.WarehouseProductResolver,
            product_resolvers_1.CollectionReferenceResolver,
            product_resolvers_1.WarehouseIdsResolver,
            product_resolvers_1.CollectionWarehouseProductResolver,
            product_resolvers_1.BasePricingResolver,
            product_resolvers_1.UserSpecificPricingResolver,
            product_resolvers_1.PincodeGroupResolver,
            product_resolvers_1.PincodeResolver
        ],
        exports: [
            product_resolvers_1.TaxSlabAdminResolver,
            product_resolvers_1.CategoryResolver,
            product_resolvers_1.SubCategoryResolver,
            product_resolvers_1.SSubCategoryResolver,
            product_resolvers_1.ProductResolver,
            product_resolvers_1.WarehouseProductResolver,
            product_resolvers_1.CollectionReferenceResolver,
            product_resolvers_1.WarehouseIdsResolver,
            product_resolvers_1.CollectionWarehouseProductResolver,
            product_resolvers_1.BasePricingResolver,
            product_resolvers_1.UserSpecificPricingResolver,
        ]
    })
], ProductAdminModule);
//# sourceMappingURL=product.module.js.map
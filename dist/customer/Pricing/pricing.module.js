"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSlabModule = void 0;
const common_1 = require("@nestjs/common");
const pricing_resolvers_1 = require("./pricing.resolvers");
const typeorm_1 = require("@nestjs/typeorm");
const product_models_1 = require("../../admin/Product/product.models");
let ProductSlabModule = class ProductSlabModule {
};
exports.ProductSlabModule = ProductSlabModule;
exports.ProductSlabModule = ProductSlabModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_models_1.BasePricing, product_models_1.UserSpecificPricing]),
        ],
        providers: [
            pricing_resolvers_1.ProductSlabsResolver
        ],
        exports: [
            pricing_resolvers_1.ProductSlabsResolver
        ]
    })
], ProductSlabModule);
//# sourceMappingURL=pricing.module.js.map
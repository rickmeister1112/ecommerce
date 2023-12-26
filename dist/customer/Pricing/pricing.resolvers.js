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
exports.ProductSlabsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const product_models_1 = require("../../admin/Product/product.models");
const product_models_2 = require("../../admin/Product/product.models");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let ProductSlabsResolver = class ProductSlabsResolver {
    constructor(basePricingRepository, userSpecificPricingRepository) {
        this.basePricingRepository = basePricingRepository;
        this.userSpecificPricingRepository = userSpecificPricingRepository;
    }
    async getProductPricing(productWarehouseIds, userId) {
        const userSpecificPricings = await this.userSpecificPricingRepository.find({
            where: {
                user_id: userId,
                product_warehouse_id: (0, typeorm_2.In)(productWarehouseIds),
                is_active: true,
                sale_start: (0, typeorm_2.LessThan)(new Date()),
                sale_ended: (0, typeorm_2.MoreThan)(new Date())
            },
            relations: ['productWarehouse', 'productWarehouse.product']
        });
        const foundIds = userSpecificPricings.map(usp => usp.product_warehouse_id);
        const remainingIds = productWarehouseIds.filter(id => !foundIds.includes(id));
        const basePricings = await this.basePricingRepository.find({
            where: {
                product_warehouse_id: (0, typeorm_2.In)(remainingIds),
                is_active: true
            },
            relations: ['productWarehouse', 'productWarehouse.product']
        });
        const combinedPricings = [...userSpecificPricings, ...basePricings];
        if (combinedPricings.length === 0) {
            throw new Error("Product pricing not found");
        }
        return combinedPricings.map(pricing => transformToBasePricing(pricing));
    }
};
exports.ProductSlabsResolver = ProductSlabsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => [product_models_1.BasePricing]),
    __param(0, (0, graphql_1.Args)('productWarehouseIds')),
    __param(1, (0, graphql_1.Args)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], ProductSlabsResolver.prototype, "getProductPricing", null);
exports.ProductSlabsResolver = ProductSlabsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_models_1.BasePricing)),
    __param(1, (0, typeorm_1.InjectRepository)(product_models_2.UserSpecificPricing)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductSlabsResolver);
function transformToBasePricing(pricing) {
    var _a, _b, _c, _d;
    return {
        id: pricing.id,
        created_at: pricing.created_at,
        updated_at: pricing.updated_at,
        product_warehouse_id: pricing.product_warehouse_id,
        slab_price: pricing.slab_price,
        min_qty: pricing.min_qty,
        total_quantity_for_sale: (_a = pricing.total_quantity_for_sale) !== null && _a !== void 0 ? _a : 0,
        total_quantity_user: (_b = pricing.total_quantity_user) !== null && _b !== void 0 ? _b : 0,
        is_sale: (_c = pricing.is_sale) !== null && _c !== void 0 ? _c : false,
        is_default: (_d = pricing.is_default) !== null && _d !== void 0 ? _d : false,
        is_active: pricing.is_active,
        productWarehouse: pricing.productWarehouse,
    };
}
//# sourceMappingURL=pricing.resolvers.js.map
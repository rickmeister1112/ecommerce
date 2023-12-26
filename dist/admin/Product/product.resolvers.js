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
exports.PincodeGroupResolver = exports.PincodeResolver = exports.CollectionWarehouseProductResolver = exports.UserSpecificPricingResolver = exports.BasePricingResolver = exports.WarehouseIdsResolver = exports.CollectionReferenceResolver = exports.WarehouseProductResolver = exports.ProductResolver = exports.SSubCategoryResolver = exports.SubCategoryResolver = exports.CategoryResolver = exports.TaxSlabAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_admin_resolver_1 = require("../utils/base.admin.resolver");
const typeorm_1 = require("typeorm");
const product_models_1 = require("./product.models");
let TaxSlabAdminResolver = class TaxSlabAdminResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.TaxSlab) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.TaxSlabAdminResolver = TaxSlabAdminResolver;
exports.TaxSlabAdminResolver = TaxSlabAdminResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TaxSlabAdminResolver);
let CategoryResolver = class CategoryResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.Category) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
    async deleteCategory(id) {
        const categoryToDelete = await this.dataSource.findOne(product_models_1.Category, { where: { id } });
        if (!categoryToDelete) {
            throw new Error(`Category with id: ${id} not found`);
        }
        const productsToUpdate = await this.dataSource.find(product_models_1.Product, { where: { category: categoryToDelete.id } });
        for (let product of productsToUpdate) {
            product.is_synced = 0;
            await this.dataSource.save(product);
        }
        await this.dataSource.remove(product_models_1.Category, categoryToDelete);
        return categoryToDelete;
    }
};
exports.CategoryResolver = CategoryResolver;
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
exports.CategoryResolver = CategoryResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CategoryResolver);
let SubCategoryResolver = class SubCategoryResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.SubCategory) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
    async addSubCategory(row) {
        const associatedCategory = await this.dataSource.findOne(product_models_1.Category, { where: { id: row.category_id } });
        if (!associatedCategory) {
            throw new Error(`Category with id: ${row.category_id} not found`);
        }
        const newSubCategory = this.dataSource.create(product_models_1.SubCategory, Object.assign(Object.assign({}, row), { category: associatedCategory }));
        return await this.dataSource.save(newSubCategory);
    }
    async listSubCategory(categoryId, page = 1, limit = 10, order_by = ['created_at']) {
        const skip = (page - 1) * limit;
        const orderByParsed = this.parseOrderBy(order_by);
        if (categoryId) {
            const categoryExists = await this.dataSource.findOne(product_models_1.Category, { where: { id: categoryId } });
            if (!categoryExists) {
                throw new Error(`Category with id: ${categoryId} not found`);
            }
        }
        return await this.dataSource.find(product_models_1.SubCategory, {
            where: categoryId ? { category_id: categoryId } : undefined,
            skip,
            take: limit,
            order: orderByParsed
        });
    }
    parseOrderBy(orderBy) {
        let parsed = {};
        orderBy.forEach(item => {
            let [field, direction] = item.split(':');
            if (!direction)
                direction = 'ASC';
            parsed[field] = direction.toUpperCase();
        });
        return parsed;
    }
};
exports.SubCategoryResolver = SubCategoryResolver;
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_models_1.SubCategory]),
    __metadata("design:returntype", Promise)
], SubCategoryResolver.prototype, "addSubCategory", null);
__decorate([
    (0, graphql_1.Query)(returns => [product_models_1.SubCategory]),
    __param(0, (0, graphql_1.Args)('category_id', { type: () => String, nullable: true })),
    __param(1, (0, graphql_1.Args)('page', { type: () => graphql_1.Int, nullable: true })),
    __param(2, (0, graphql_1.Args)('limit', { type: () => graphql_1.Int, nullable: true })),
    __param(3, (0, graphql_1.Args)('order_by', { type: () => [String], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Array]),
    __metadata("design:returntype", Promise)
], SubCategoryResolver.prototype, "listSubCategory", null);
exports.SubCategoryResolver = SubCategoryResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SubCategoryResolver);
let SSubCategoryResolver = class SSubCategoryResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.SSubCategory) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
    async addSSubCategory(row) {
        const subCategoryExists = await this.dataSource.findOne(product_models_1.SubCategory, { where: { id: row.sub_category_id } });
        if (!subCategoryExists) {
            throw new Error(`SubCategory with id: ${row.sub_category_id} not found`);
        }
        const newSSubCategory = this.dataSource.create(product_models_1.SSubCategory, Object.assign(Object.assign({}, row), { subCategory: subCategoryExists }));
        return await this.dataSource.save(newSSubCategory);
    }
};
exports.SSubCategoryResolver = SSubCategoryResolver;
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_models_1.SSubCategory]),
    __metadata("design:returntype", Promise)
], SSubCategoryResolver.prototype, "addSSubCategory", null);
exports.SSubCategoryResolver = SSubCategoryResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SSubCategoryResolver);
let ProductResolver = class ProductResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.Product) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.ProductResolver = ProductResolver;
exports.ProductResolver = ProductResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ProductResolver);
let WarehouseProductResolver = class WarehouseProductResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.WarehouseProduct) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.WarehouseProductResolver = WarehouseProductResolver;
exports.WarehouseProductResolver = WarehouseProductResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WarehouseProductResolver);
let CollectionReferenceResolver = class CollectionReferenceResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.CollectionReference) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.CollectionReferenceResolver = CollectionReferenceResolver;
exports.CollectionReferenceResolver = CollectionReferenceResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CollectionReferenceResolver);
let WarehouseIdsResolver = class WarehouseIdsResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.Warehouse) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.WarehouseIdsResolver = WarehouseIdsResolver;
exports.WarehouseIdsResolver = WarehouseIdsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], WarehouseIdsResolver);
let BasePricingResolver = class BasePricingResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.BasePricing) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.BasePricingResolver = BasePricingResolver;
exports.BasePricingResolver = BasePricingResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BasePricingResolver);
let UserSpecificPricingResolver = class UserSpecificPricingResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.UserSpecificPricing) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.UserSpecificPricingResolver = UserSpecificPricingResolver;
exports.UserSpecificPricingResolver = UserSpecificPricingResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserSpecificPricingResolver);
let CollectionWarehouseProductResolver = class CollectionWarehouseProductResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.CollectionWarehouseProduct) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.CollectionWarehouseProductResolver = CollectionWarehouseProductResolver;
exports.CollectionWarehouseProductResolver = CollectionWarehouseProductResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CollectionWarehouseProductResolver);
let PincodeResolver = class PincodeResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.Pincode) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.PincodeResolver = PincodeResolver;
exports.PincodeResolver = PincodeResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PincodeResolver);
let PincodeGroupResolver = class PincodeGroupResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(product_models_1.PincodeGroup) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.PincodeGroupResolver = PincodeGroupResolver;
exports.PincodeGroupResolver = PincodeGroupResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PincodeGroupResolver);
//# sourceMappingURL=product.resolvers.js.map
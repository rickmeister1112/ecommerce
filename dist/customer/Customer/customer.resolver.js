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
exports.AddressResolver = exports.BusinessResolver = exports.OutletResolver = exports.UserResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_resolver_1 = require("../utils/base.resolver");
const typeorm_1 = require("typeorm");
const customer_models_1 = require("./customer.models");
const common_1 = require("@nestjs/common");
let UserResolver = class UserResolver extends (0, base_resolver_1.BaseResolver)(customer_models_1.User) {
    constructor(dataSource) {
        super(dataSource, true, new Set(["password_hash"]));
    }
    async hasAddPermission(rows, user) {
        throw new common_1.ForbiddenException("Not allowed from here");
    }
    async hasUpdatePermission(currentObj, newObj, user) {
        if (user.id != currentObj.id)
            throw new common_1.ForbiddenException("Cannot update different user's information");
        return newObj;
    }
};
exports.UserResolver = UserResolver;
exports.UserResolver = UserResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_models_1.User),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserResolver);
let OutletResolver = class OutletResolver extends (0, base_resolver_1.BaseResolver)(customer_models_1.Outlet) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.OutletResolver = OutletResolver;
exports.OutletResolver = OutletResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_models_1.Outlet),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OutletResolver);
let BusinessResolver = class BusinessResolver extends (0, base_resolver_1.BaseResolver)(customer_models_1.Business) {
    constructor(dataSource) {
        super(dataSource, undefined, undefined, new Set(["user_id", "user"]));
    }
};
exports.BusinessResolver = BusinessResolver;
exports.BusinessResolver = BusinessResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_models_1.Business),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], BusinessResolver);
let AddressResolver = class AddressResolver extends (0, base_resolver_1.BaseResolver)(customer_models_1.Address) {
    constructor(dataSource) {
        super(dataSource, undefined, undefined, new Set(["user_id", "user"]));
    }
    async addInegratedAddress(row) {
        console.log("the code entered this line");
        const pincode = { row };
        const newAddress = await this.dataSource.getRepository(customer_models_1.Address).create(row);
        const saveAddress = await this.dataSource.getRepository(customer_models_1.Address).save(newAddress);
        await this.dataSource.getRepository(customer_models_1.Address).save(saveAddress);
        return saveAddress;
    }
};
exports.AddressResolver = AddressResolver;
__decorate([
    (0, graphql_1.Mutation)(() => customer_models_1.Address),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressResolver.prototype, "addInegratedAddress", null);
exports.AddressResolver = AddressResolver = __decorate([
    (0, graphql_1.Resolver)(() => customer_models_1.Address),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AddressResolver);
//# sourceMappingURL=customer.resolver.js.map
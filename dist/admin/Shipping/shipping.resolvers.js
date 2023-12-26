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
exports.ShippingResolver = exports.DefaultShippingResolver = exports.SlotResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const base_admin_resolver_1 = require("../utils/base.admin.resolver");
const shipping_models_1 = require("./shipping.models");
let SlotResolver = class SlotResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(shipping_models_1.Slot) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.SlotResolver = SlotResolver;
exports.SlotResolver = SlotResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SlotResolver);
let DefaultShippingResolver = class DefaultShippingResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(shipping_models_1.DefaultShipping) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.DefaultShippingResolver = DefaultShippingResolver;
exports.DefaultShippingResolver = DefaultShippingResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DefaultShippingResolver);
let ShippingResolver = class ShippingResolver extends (0, base_admin_resolver_1.BaseAdminResolver)(shipping_models_1.Shipping) {
    constructor(dataSource) {
        super(dataSource, true, undefined, undefined, true);
    }
};
exports.ShippingResolver = ShippingResolver;
exports.ShippingResolver = ShippingResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ShippingResolver);
//# sourceMappingURL=shipping.resolvers.js.map
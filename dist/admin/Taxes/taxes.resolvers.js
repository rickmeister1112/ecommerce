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
exports.TaxResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_resolver_1 = require("../../customer/utils/base.resolver");
const typeorm_1 = require("typeorm");
const taxes_models_1 = require("./taxes.models");
let TaxResolver = class TaxResolver extends (0, base_resolver_1.BaseResolver)(taxes_models_1.Tax) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.TaxResolver = TaxResolver;
exports.TaxResolver = TaxResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TaxResolver);
//# sourceMappingURL=taxes.resolvers.js.map
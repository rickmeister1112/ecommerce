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
exports.ProductPricingInput = exports.UserWarehouseInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let UserWarehouseInput = class UserWarehouseInput {
};
exports.UserWarehouseInput = UserWarehouseInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UserWarehouseInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UserWarehouseInput.prototype, "warehouseId", void 0);
exports.UserWarehouseInput = UserWarehouseInput = __decorate([
    (0, graphql_1.InputType)()
], UserWarehouseInput);
let ProductPricingInput = class ProductPricingInput {
};
exports.ProductPricingInput = ProductPricingInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ProductPricingInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Array)
], ProductPricingInput.prototype, "productWarehouseIds", void 0);
exports.ProductPricingInput = ProductPricingInput = __decorate([
    (0, graphql_1.InputType)()
], ProductPricingInput);
//# sourceMappingURL=pricing.models.js.map
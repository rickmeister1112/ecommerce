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
exports.Shipping = exports.DefaultShipping = exports.Slot = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
const product_models_1 = require("../Product/product.models");
let Slot = class Slot extends base_model_1.BaseModel {
};
exports.Slot = Slot;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Slot.prototype, "slotName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Slot.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Slot.prototype, "endTime", void 0);
exports.Slot = Slot = __decorate([
    (0, typeorm_1.Entity)()
], Slot);
let DefaultShipping = class DefaultShipping extends base_model_1.BaseModel {
};
exports.DefaultShipping = DefaultShipping;
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DefaultShipping.prototype, "orderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DefaultShipping.prototype, "amount", void 0);
exports.DefaultShipping = DefaultShipping = __decorate([
    (0, typeorm_1.Entity)()
], DefaultShipping);
let Shipping = class Shipping extends base_model_1.BaseModel {
};
exports.Shipping = Shipping;
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Shipping.prototype, "orderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Shipping.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", product_models_1.Warehouse)
], Shipping.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Shipping.prototype, "warehouse_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_models_1.PincodeGroup, group => group.shipping),
    __metadata("design:type", product_models_1.PincodeGroup)
], Shipping.prototype, "pincodeGroup", void 0);
exports.Shipping = Shipping = __decorate([
    (0, typeorm_1.Entity)()
], Shipping);
//# sourceMappingURL=shipping.models.js.map
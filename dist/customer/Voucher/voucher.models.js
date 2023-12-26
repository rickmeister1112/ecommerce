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
exports.CouponCustomer = void 0;
const voucher_models_1 = require("../../admin/Voucher/voucher.models");
const typeorm_1 = require("typeorm");
const customer_models_1 = require("../Customer/customer.models");
const base_model_1 = require("../utils/base.model");
let CouponCustomer = class CouponCustomer extends base_model_1.BaseModel {
};
exports.CouponCustomer = CouponCustomer;
__decorate([
    (0, typeorm_1.ManyToOne)(() => voucher_models_1.Coupon, coupon => coupon.id),
    (0, typeorm_1.JoinColumn)({ name: 'coupon_id' }),
    __metadata("design:type", voucher_models_1.Coupon)
], CouponCustomer.prototype, "coupon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CouponCustomer.prototype, "coupon_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User, user => user.id),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", customer_models_1.User)
], CouponCustomer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], CouponCustomer.prototype, "user_id", void 0);
exports.CouponCustomer = CouponCustomer = __decorate([
    (0, typeorm_1.Entity)()
], CouponCustomer);
//# sourceMappingURL=voucher.models.js.map
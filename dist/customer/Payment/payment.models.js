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
exports.PaymentTransactionHistory = exports.OrderTransactionHistory = exports.UserWallet = void 0;
const typeorm_1 = require("typeorm");
const customer_models_1 = require("../Customer/customer.models");
const base_model_1 = require("../utils/base.model");
const order_models_1 = require("../Order/order.models");
let UserWallet = class UserWallet extends base_model_1.BaseModel {
};
exports.UserWallet = UserWallet;
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_models_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", customer_models_1.User)
], UserWallet.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserWallet.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserWallet.prototype, "cashWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserWallet.prototype, "rewardWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserWallet.prototype, "joiningBonus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserWallet.prototype, "promotionalBonus", void 0);
exports.UserWallet = UserWallet = __decorate([
    (0, typeorm_1.Entity)()
], UserWallet);
let OrderTransactionHistory = class OrderTransactionHistory extends base_model_1.BaseModel {
};
exports.OrderTransactionHistory = OrderTransactionHistory;
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", customer_models_1.User)
], OrderTransactionHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_models_1.Order),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", order_models_1.Order)
], OrderTransactionHistory.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false }),
    __metadata("design:type", Number)
], OrderTransactionHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "paymentMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1, nullable: false }),
    __metadata("design:type", Number)
], OrderTransactionHistory.prototype, "transactionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0, nullable: false }),
    __metadata("design:type", Number)
], OrderTransactionHistory.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0 }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "orderStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: false }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "transactionMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "transactionLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], OrderTransactionHistory.prototype, "reference_id", void 0);
exports.OrderTransactionHistory = OrderTransactionHistory = __decorate([
    (0, typeorm_1.Entity)()
], OrderTransactionHistory);
let PaymentTransactionHistory = class PaymentTransactionHistory extends base_model_1.BaseModel {
};
exports.PaymentTransactionHistory = PaymentTransactionHistory;
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_models_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", customer_models_1.User)
], PaymentTransactionHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], PaymentTransactionHistory.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false }),
    __metadata("design:type", Number)
], PaymentTransactionHistory.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], PaymentTransactionHistory.prototype, "transactionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], PaymentTransactionHistory.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 1 }),
    __metadata("design:type", Number)
], PaymentTransactionHistory.prototype, "transactionNumberReason", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => OrderTransactionHistory),
    (0, typeorm_1.JoinColumn)({ name: "order_transaction_history_id" }),
    __metadata("design:type", OrderTransactionHistory)
], PaymentTransactionHistory.prototype, "orderTransactionHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PaymentTransactionHistory.prototype, "order_transaction_history_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint', default: 0, nullable: false }),
    __metadata("design:type", Number)
], PaymentTransactionHistory.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', nullable: false }),
    __metadata("design:type", String)
], PaymentTransactionHistory.prototype, "transactionMessage", void 0);
exports.PaymentTransactionHistory = PaymentTransactionHistory = __decorate([
    (0, typeorm_1.Entity)()
], PaymentTransactionHistory);
//# sourceMappingURL=payment.models.js.map
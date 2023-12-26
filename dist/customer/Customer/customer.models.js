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
exports.Outlet = exports.Cuisine = exports.Business = exports.UserOtp = exports.Address = exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
const payment_models_1 = require("../Payment/payment.models");
const cart_users_models_1 = require("../Cart/cart.users.models");
const voucher_models_1 = require("../../admin/Voucher/voucher.models");
let User = class User extends base_model_1.BaseModel {
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "is_admin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Business, business => business.user),
    __metadata("design:type", Array)
], User.prototype, "businesses", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => payment_models_1.UserWallet, userWallet => userWallet.user),
    __metadata("design:type", payment_models_1.UserWallet)
], User.prototype, "userWallet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '', unique: true }),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gst_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'business_none' }),
    __metadata("design:type", String)
], User.prototype, "gst_treatment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Address, address => address.user),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_users_models_1.Cart, cart => cart.customer),
    __metadata("design:type", Array)
], User.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => voucher_models_1.UserCoupon, userCoupon => userCoupon.user),
    __metadata("design:type", Array)
], User.prototype, "userCoupons", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
let Address = class Address extends base_model_1.BaseModel {
};
exports.Address = Address;
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, user => user.addresses),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User)
], Address.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Outlet, outlet => outlet.shippingAddress),
    __metadata("design:type", Promise)
], Address.prototype, "shippingOutlet", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Outlet, outlet => outlet.billingAddress),
    __metadata("design:type", Promise)
], Address.prototype, "billingOutlet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "address_line1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: "" }),
    __metadata("design:type", String)
], Address.prototype, "address_line2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: "" }),
    __metadata("design:type", String)
], Address.prototype, "address_line3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "postalcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Address.prototype, "longitude", void 0);
exports.Address = Address = __decorate([
    (0, typeorm_1.Entity)()
], Address);
let UserOtp = class UserOtp extends base_model_1.BaseModel {
};
exports.UserOtp = UserOtp;
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: false, default: 0 }),
    __metadata("design:type", Number)
], UserOtp.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], UserOtp.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserOtp.prototype, "is_Active", void 0);
exports.UserOtp = UserOtp = __decorate([
    (0, typeorm_1.Entity)()
], UserOtp);
let Business = class Business extends base_model_1.BaseModel {
};
exports.Business = Business;
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'Unregistered Business' }),
    __metadata("design:type", String)
], Business.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '' }),
    __metadata("design:type", String)
], Business.prototype, "business_website", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User)
], Business.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Business.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Outlet, outlet => outlet.id),
    __metadata("design:type", Array)
], Business.prototype, "outlets", void 0);
exports.Business = Business = __decorate([
    (0, typeorm_1.Entity)()
], Business);
let Cuisine = class Cuisine extends base_model_1.BaseModel {
};
exports.Cuisine = Cuisine;
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Cuisine.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Cuisine.prototype, "image", void 0);
exports.Cuisine = Cuisine = __decorate([
    (0, typeorm_1.Entity)()
], Cuisine);
let Outlet = class Outlet extends base_model_1.BaseModel {
};
exports.Outlet = Outlet;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "address_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: "" }),
    __metadata("design:type", String)
], Outlet.prototype, "outlet_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "outlet_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "fssai", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: "" }),
    __metadata("design:type", String)
], Outlet.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Business, (business) => business.outlets),
    (0, typeorm_1.JoinColumn)({ name: "business_id" }),
    __metadata("design:type", Business)
], Outlet.prototype, "business", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Outlet.prototype, "business_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Outlet.prototype, "couponApplicable", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Address),
    (0, typeorm_1.JoinColumn)({ name: "shipping_address_id" }),
    __metadata("design:type", Promise)
], Outlet.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "shipping_address_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "zoho_shipping_address_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Address),
    (0, typeorm_1.JoinColumn)({ name: "billing_address_id" }),
    __metadata("design:type", Promise)
], Outlet.prototype, "billingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "billing_address_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "zoho_billing_address_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "zoho_contact_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Outlet.prototype, "attempts_to_create_on_zoho", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Outlet.prototype, "sales_poc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Outlet.prototype, "is_zoho_created", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Address, address => address.id),
    (0, typeorm_1.JoinColumn)({ name: "address_id" }),
    __metadata("design:type", Address)
], Outlet.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Cuisine),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Outlet.prototype, "cuisines", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cart_users_models_1.Cart, cart => cart.outlet),
    __metadata("design:type", cart_users_models_1.Cart)
], Outlet.prototype, "cart", void 0);
exports.Outlet = Outlet = __decorate([
    (0, typeorm_1.Entity)()
], Outlet);
//# sourceMappingURL=customer.models.js.map
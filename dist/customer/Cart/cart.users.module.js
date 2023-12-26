"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartUserModule = void 0;
const common_1 = require("@nestjs/common");
const cart_users_resolvers_1 = require("./cart.users.resolvers");
const typeorm_1 = require("@nestjs/typeorm");
const cart_users_models_1 = require("./cart.users.models");
const customer_models_1 = require("../Customer/customer.models");
let CartUserModule = class CartUserModule {
};
exports.CartUserModule = CartUserModule;
exports.CartUserModule = CartUserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cart_users_models_1.Cart, cart_users_models_1.CartInlineItem, cart_users_models_1.TaxBreakUp, customer_models_1.Outlet]),
        ],
        providers: [
            cart_users_resolvers_1.CartResolver,
            cart_users_resolvers_1.CartInlineItemResolver,
            cart_users_resolvers_1.TaxBreakUpResolver
        ],
        exports: [
            cart_users_resolvers_1.CartResolver,
            cart_users_resolvers_1.CartInlineItemResolver,
            cart_users_resolvers_1.TaxBreakUpResolver
        ],
    })
], CartUserModule);
//# sourceMappingURL=cart.users.module.js.map
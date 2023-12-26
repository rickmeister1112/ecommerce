"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const customer_resolver_1 = require("./customer.resolver");
const typeorm_1 = require("@nestjs/typeorm");
const customer_models_1 = require("./customer.models");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const product_models_1 = require("../../admin/Product/product.models");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_models_1.User, customer_models_1.Outlet, customer_models_1.Business, customer_models_1.Address, product_models_1.Warehouse]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60d' },
                }),
            }),
        ],
        providers: [
            customer_resolver_1.UserResolver,
            customer_resolver_1.OutletResolver,
            customer_resolver_1.BusinessResolver,
            customer_resolver_1.AddressResolver
        ]
    })
], UserModule);
//# sourceMappingURL=customer.module.js.map
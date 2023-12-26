"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentUserModule = void 0;
const common_1 = require("@nestjs/common");
const payment_resolvers_1 = require("./payment.resolvers");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const declarations = [
    payment_resolvers_1.UserWalletResolver,
    payment_resolvers_1.OrderTransactionHistoryResolver,
    payment_resolvers_1.PaymentTransactionHistoryResolver,
    payment_resolvers_1.PostpaidTransactionsResolver,
];
let PaymentUserModule = class PaymentUserModule {
};
exports.PaymentUserModule = PaymentUserModule;
exports.PaymentUserModule = PaymentUserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature(declarations),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60d' },
                }),
            }),
        ],
        providers: declarations,
        exports: declarations,
    })
], PaymentUserModule);
//# sourceMappingURL=payment.module.js.map
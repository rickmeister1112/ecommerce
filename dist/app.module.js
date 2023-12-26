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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const typeorm_1 = require("@nestjs/typeorm");
const uuid_1 = require("./admin/utils/uuid");
const graphql_type_json_1 = require("graphql-type-json");
const jwt_1 = require("@nestjs/jwt");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const auth_module_1 = require("./customer/auth/auth.module");
const auth_module_2 = require("./admin/auth/auth.module");
const product_module_1 = require("./admin/Product/product.module");
const admin_module_1 = require("./admin/Admin/admin.module");
const cart_users_module_1 = require("./customer/Cart/cart.users.module");
const customer_module_1 = require("./customer/Customer/customer.module");
const order_module_1 = require("./customer/Order/order.module");
const payment_module_1 = require("./customer/Payment/payment.module");
const schedule_1 = require("@nestjs/schedule");
const cron_module_1 = require("./cron/cron.module");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const pricing_module_1 = require("./customer/Pricing/pricing.module");
const banner_module_1 = require("./admin/Banner/banner.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const voucher_module_1 = require("./admin/Voucher/voucher.module");
const voucher_module_2 = require("./customer/Voucher/voucher.module");
const taxes_module_1 = require("./admin/Taxes/taxes.module");
const shipping_module_1 = require("./admin/Shipping/shipping.module");
let AppModule = class AppModule {
    constructor(configService) {
        this.configService = configService;
        console.log('TEST_ENV_VAR:', this.configService.get('TEST_ENV_VAR'));
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60d' },
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    entities: ['dist/**/*.js'],
                    synchronize: true,
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            cron_module_1.TasksModule,
            customer_module_1.UserModule,
            voucher_module_2.VoucherModule,
            cart_users_module_1.CartUserModule,
            product_module_1.ProductAdminModule,
            banner_module_1.BannerAdminModule,
            payment_module_1.PaymentUserModule,
            voucher_module_1.VoucherAdminModule,
            order_module_1.OrderUserModule,
            admin_module_1.AdminUsersModule,
            shipping_module_1.ShippingAdminModule,
            auth_module_2.AuthAdminModule,
            pricing_module_1.ProductSlabModule,
            taxes_module_1.TaxModule,
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                playground: false,
                plugins: [(0, default_1.ApolloServerPluginLandingPageLocalDefault)()],
                context: ({ req }) => ({ headers: req.headers }),
                typePaths: ['./**/*.graphql'],
                resolvers: { UUID: uuid_1.CustomUuidScalar, JSON: graphql_type_json_1.default },
            }),
            webhooks_module_1.WebhooksModule,
        ]
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map
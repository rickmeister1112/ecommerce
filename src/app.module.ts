import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomUuidScalar } from './admin/utils/uuid';
import GraphQLJSON from 'graphql-type-json';
import { JwtModule } from '@nestjs/jwt';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule} from './customer/auth/auth.module';
import { AuthAdminModule } from './admin/auth/auth.module';
import { ProductAdminModule } from './admin/Product/product.module';
import { AdminUsersModule } from './admin/Admin/admin.module';
import { CartUserModule } from './customer/Cart/cart.users.module';
import { UserModule } from './customer/Customer/customer.module';
import { OrderUserModule } from './customer/Order/order.module';
import { PaymentUserModule } from './customer/Payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule} from './cron/cron.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ProductSlabModule } from './customer/Pricing/pricing.module';
import { BannerAdminModule } from './admin/Banner/banner.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { VoucherAdminModule } from './admin/Voucher/voucher.module';
import { VoucherModule } from './customer/Voucher/voucher.module';
import { TaxModule } from './admin/Taxes/taxes.module';
import { ShippingAdminModule } from './admin/Shipping/shipping.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        entities: ['dist/**/*.js'],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TasksModule,
    UserModule,
    VoucherModule,
    CartUserModule,
    ProductAdminModule,
    BannerAdminModule,
    PaymentUserModule,
    VoucherAdminModule,
    OrderUserModule,
    AdminUsersModule,
    ShippingAdminModule,
    AuthAdminModule,
    ProductSlabModule,
    TaxModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ headers: req.headers }),
      typePaths: ['./**/*.graphql'],
      resolvers: { UUID: CustomUuidScalar, JSON: GraphQLJSON },
    }),
    WebhooksModule,
  ]
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('TEST_ENV_VAR:', this.configService.get('TEST_ENV_VAR'));
  }

}

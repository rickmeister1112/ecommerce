import { Module } from '@nestjs/common';
import { UserWalletResolver, OrderTransactionHistoryResolver, PaymentTransactionHistoryResolver, PostpaidTransactionsResolver } from './payment.resolvers';
import { OrderTransactionHistory, PaymentTransactionHistory, UserWallet } from './payment.models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const declarations = [
  UserWalletResolver,
  OrderTransactionHistoryResolver,
  PaymentTransactionHistoryResolver,
  PostpaidTransactionsResolver,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(declarations),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
    }),
  ],
  providers: declarations,
  exports: declarations,
})
export class PaymentUserModule { }

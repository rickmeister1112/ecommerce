import { Module } from '@nestjs/common';
import {
  UserResolver, OutletResolver, BusinessResolver, AddressResolver,
} from './customer.resolver'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Business, Outlet, User } from './customer.models';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Warehouse } from 'src/admin/Product/product.models';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Outlet, Business, Address, Warehouse]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
    }),
  ],
  providers: [
    UserResolver,
    OutletResolver,
    BusinessResolver,
    AddressResolver
  ]
})
export class UserModule { }

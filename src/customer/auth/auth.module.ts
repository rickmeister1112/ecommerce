import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthResolver } from './auth.resolvers';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../Customer/customer.models';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60d' },
      }),
    }),
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [JwtStrategy, AuthResolver],
})
export class AuthModule {}

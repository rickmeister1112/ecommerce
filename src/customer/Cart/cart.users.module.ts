import { Module } from '@nestjs/common';
import { CartInlineItemResolver, CartResolver, TaxBreakUpResolver} from './cart.users.resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartInlineItem, TaxBreakUp } from './cart.users.models';
import { Outlet } from '../Customer/customer.models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartInlineItem, TaxBreakUp, Outlet]),

  ],
  providers: [
    CartResolver,
    CartInlineItemResolver,
    TaxBreakUpResolver
  ],
  exports: [
    CartResolver,
    CartInlineItemResolver,
    TaxBreakUpResolver
  ],
})
export class CartUserModule {}

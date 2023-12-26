import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryCoupon, CollectionCoupon, Coupon, ExcludeCoupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon, UserCoupon } from 'src/admin/Voucher/voucher.models';
import { CouponResolver } from './voucher.resolvers';
import { Cart, CartInlineItem } from '../Cart/cart.users.models';
import { CouponCustomer } from './voucher.models';
import { User } from '../Customer/customer.models';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryCoupon, CollectionCoupon, Coupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon, UserCoupon, Cart, CartInlineItem, CouponCustomer, User, ExcludeCoupon]),
    
      ],
  providers: [
    CouponResolver
  ],
  exports: [
    CouponResolver
  ]
})
export class VoucherModule {}

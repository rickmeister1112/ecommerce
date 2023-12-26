import { Module } from '@nestjs/common';
import { CouponUserResolver, CouponCollectionResolver, CouponSubCategoryResolver, CouponCategoryResolver, CouponProductResolver, CouponSubSubCategoryResolver, CouponResolver } from './voucher.resolvers';

@Module({
  providers: [
    CouponUserResolver,
    CouponCollectionResolver,
    CouponSubCategoryResolver,
    CouponCategoryResolver,
    CouponProductResolver,
    CouponSubSubCategoryResolver,
    CouponResolver
  ],
  exports: [
    CouponUserResolver,
    CouponCollectionResolver,
    CouponSubCategoryResolver,
    CouponCategoryResolver,
    CouponProductResolver,
    CouponSubSubCategoryResolver,
    CouponResolver
  ]
})
export class VoucherAdminModule { }

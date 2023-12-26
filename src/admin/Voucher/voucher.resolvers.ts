import { Resolver } from "@nestjs/graphql";
import { BaseResolver } from "src/customer/utils/base.resolver";
import { DataSource } from "typeorm";
import { CategoryCoupon, CollectionCoupon, Coupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon, UserCoupon } from "./voucher.models";


@Resolver(() => Coupon)
export class CouponResolver extends BaseResolver(Coupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => SubSubCategoryCoupon)
export class CouponSubSubCategoryResolver extends BaseResolver(SubSubCategoryCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => ProductCoupon)
export class CouponProductResolver extends BaseResolver(ProductCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => CategoryCoupon)
export class CouponCategoryResolver extends BaseResolver(CategoryCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => SubCategoryCoupon)
export class CouponSubCategoryResolver extends BaseResolver(SubCategoryCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => CollectionCoupon)
export class CouponCollectionResolver extends BaseResolver(CollectionCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver(() => UserCoupon)
export class CouponUserResolver extends BaseResolver(UserCoupon) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}


import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { CategoryCoupon, CollectionCoupon, Coupon, ExcludeCoupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon, UserCoupon } from "src/admin/Voucher/voucher.models";
import { Brackets, In, MoreThan, Repository } from "typeorm";
import { Cart, CartInlineItem } from "../Cart/cart.users.models";
import { InjectRepository } from "@nestjs/typeorm";
import { CouponCustomer } from "./voucher.models";
import { User } from "../Customer/customer.models";

@Resolver()
export class CouponResolver {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(ProductCoupon)
    private productCouponRepository: Repository<ProductCoupon>,

    @InjectRepository(CategoryCoupon)
    private categoryCouponRepository: Repository<CategoryCoupon>,

    @InjectRepository(SubCategoryCoupon)
    private subCategoryCouponRepository: Repository<SubCategoryCoupon>,

    @InjectRepository(SubSubCategoryCoupon)
    private subSubCategoryCouponRepository: Repository<SubSubCategoryCoupon>,

    @InjectRepository(CollectionCoupon)
    private collectionCouponRepository: Repository<CollectionCoupon>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(CouponCustomer)
    private couponCustomerRepository: Repository<CouponCustomer>,

    @InjectRepository(ExcludeCoupon)
    private excludeCouponRepository: Repository<ExcludeCoupon>,
    
    @InjectRepository(UserCoupon)
    private UserCouponRepository: Repository<UserCoupon>
    
  ) {}
  @Mutation(() => Coupon)
  async fetchCoupon(@Args('userId') userId: string, @Args('warehouseId') warehouseId: string): Promise<Coupon[]> {
    console.log("Redeeming coupon for UserID:", userId, "and WarehouseID:", warehouseId);
  
  // Fetch non-excludable products
  const excludedProductIds = (await this.excludeCouponRepository.find({
    where: { is_Active: true },
    select: ['warehouse_product_id']
  })).map(ep => ep.warehouse_product_id);
  console.log("Excluded Product IDs:", excludedProductIds);

  // Fetch the cart, excluding items that are in the non-applicable list
  const cart = await this.cartRepository.findOne({
    where: { customer_id: userId, warehouse_id: warehouseId },
    relations: ['items', 'items.productWarehouse', 'items.productWarehouse.product']
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Filter out excluded products from cart items
  const filteredCartItems = cart.items.filter(item => !excludedProductIds.includes(item.warehouse_id));

    // Step 2: Extract necessary IDs from cart items
    const productIds = filteredCartItems.map(item => item.warehouse_id);
    const categoryIds = filteredCartItems.map(item => item.category_id);
    const subCategoryIds = filteredCartItems.map(item => item.subcategory_id);
    const SSubCategoryIds = filteredCartItems.map(item => item.ssubcategory_id);
    const CollectionIds = filteredCartItems.map(item => item.collectionReference);

    // Step 3: Fetch all applicable coupon IDs
    const couponProductIds = (await this.productCouponRepository.find({ select: ['coupon_id'],where: { warehouse_product_id: In(productIds) } })).map(ep => ep.coupon_id);
    const couponCategoryIds = (await this.categoryCouponRepository.find({select: ['coupon_id'], where: { category_id: In(categoryIds) } })).map(ep => ep.coupon_id);
    const couponSubCategoryIds = (await this.subCategoryCouponRepository.find({ select: ['coupon_id'] ,where: { sub_category_id: In(subCategoryIds) } })).map(ep => ep.coupon_id);
    const couponSSubCategoryIds = (await this.subSubCategoryCouponRepository.find({ select: ['coupon_id'] ,where: { sub_sub_category_id: In(SSubCategoryIds) } })).map(ep => ep.coupon_id);
    const couponCollectionIds = (await this.collectionCouponRepository.find({ select: ['coupon_id'] ,where: { collection_id: In(CollectionIds) } })).map(ep => ep.coupon_id);
    const couponUserIds = (await this.UserCouponRepository.find({ select: ['coupon_id'], where: { customer_id: userId } })).map(ep => ep.coupon_id)
    // Combine and deduplicate coupon IDs
    const allCouponIds = [...couponProductIds, ...couponCategoryIds, ...couponSubCategoryIds, ...couponSSubCategoryIds, ...couponUserIds, ...couponCollectionIds]/* .map(coupon => coupon.id) */;
    const uniqueCouponIds = [...new Set(allCouponIds)];
    
    console.log(uniqueCouponIds);
    //Step 4: Search for coupons in the Coupon table
    const coupons = await this.couponRepository.find({
      where: {
        id: In(uniqueCouponIds),
        isActive: true,
        expiryDate: MoreThan(new Date()),
        maxUsage: MoreThan(0)
      }
    });

    console.log("Applicable Coupons:", coupons);
    return coupons;
  }
  
  @Mutation(() => Coupon)
  async redeemCoupon(@Args('couponId') couponId: string, @Args('userId') userId: string): Promise<Coupon> {
    // Find the coupon
    const coupon = await this.couponRepository.findOne({ where: { id: couponId } });
    if (!coupon) {
        throw new Error('Coupon not found');
    }

    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    // Update the counter
    coupon.counter = (coupon.counter || 0) + 1;
    await this.couponRepository.save(coupon);

    // Create a new CouponCustomer entry
    const couponCustomer = new CouponCustomer();
    couponCustomer.coupon = coupon;
    couponCustomer.user = user; // Use the fetched user
    await this.couponCustomerRepository.save(couponCustomer);

    return coupon;
  }
}



/* 
@TODO
1.) total coupon count
2.) check if a user is eligible for coupon or not
3.) assign coupon in transactions */
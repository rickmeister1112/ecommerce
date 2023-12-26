import { CategoryCoupon, CollectionCoupon, Coupon, ExcludeCoupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon, UserCoupon } from "src/admin/Voucher/voucher.models";
import { Repository } from "typeorm";
import { Cart } from "../Cart/cart.users.models";
import { CouponCustomer } from "./voucher.models";
import { User } from "../Customer/customer.models";
export declare class CouponResolver {
    private couponRepository;
    private cartRepository;
    private productCouponRepository;
    private categoryCouponRepository;
    private subCategoryCouponRepository;
    private subSubCategoryCouponRepository;
    private collectionCouponRepository;
    private userRepository;
    private couponCustomerRepository;
    private excludeCouponRepository;
    private UserCouponRepository;
    constructor(couponRepository: Repository<Coupon>, cartRepository: Repository<Cart>, productCouponRepository: Repository<ProductCoupon>, categoryCouponRepository: Repository<CategoryCoupon>, subCategoryCouponRepository: Repository<SubCategoryCoupon>, subSubCategoryCouponRepository: Repository<SubSubCategoryCoupon>, collectionCouponRepository: Repository<CollectionCoupon>, userRepository: Repository<User>, couponCustomerRepository: Repository<CouponCustomer>, excludeCouponRepository: Repository<ExcludeCoupon>, UserCouponRepository: Repository<UserCoupon>);
    fetchCoupon(userId: string, warehouseId: string): Promise<Coupon[]>;
    redeemCoupon(couponId: string, userId: string): Promise<Coupon>;
}

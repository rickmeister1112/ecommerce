import { BaseModel } from '../utils/base.model';
import { Category, CollectionReference, SSubCategory, SubCategory, WarehouseProduct } from '../Product/product.models';
import { User } from 'src/customer/Customer/customer.models';
export declare class Coupon extends BaseModel {
    name: string;
    code: string;
    couponType: number;
    coupounValue: number;
    expiryDate: Date;
    counter: number;
    maxUsage: number;
    dailyLimit: number;
    isActive: boolean;
    couponCategory: number;
    productCoupons: ProductCoupon[];
    collectionCoupons: CollectionCoupon[];
    categoryCoupons: CategoryCoupon[];
    subCategoryCoupons: SubCategoryCoupon[];
    subSubCategoryCoupons: SubSubCategoryCoupon[];
    userCoupons: UserCoupon[];
}
export declare class ProductCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    warehouseProduct: WarehouseProduct;
    warehouse_product_id: string;
}
export declare class CollectionCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    collectionReference: CollectionReference;
    collection_id: string;
}
export declare class CategoryCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    category: Category;
    category_id: string;
}
export declare class SubCategoryCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    subCategory: SubCategory;
    sub_category_id: string;
}
export declare class SubSubCategoryCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    ssubCategory: SSubCategory;
    sub_sub_category_id: string;
}
export declare class UserCoupon extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    user: User;
    customer_id: string;
}
export declare class ExcludeCoupon extends BaseModel {
    warehouseProduct: WarehouseProduct;
    warehouse_product_id: string;
    is_Active: boolean;
}

import { Coupon } from "src/admin/Voucher/voucher.models";
import { User } from "../Customer/customer.models";
import { BaseModel } from "../utils/base.model";
export declare class CouponCustomer extends BaseModel {
    coupon: Coupon;
    coupon_id: string;
    user: User;
    user_id: string;
}

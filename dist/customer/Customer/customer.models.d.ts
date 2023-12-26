import { BaseModel } from '../utils/base.model';
import { UserWallet } from '../Payment/payment.models';
import { Cart } from '../Cart/cart.users.models';
import { UserCoupon } from 'src/admin/Voucher/voucher.models';
import { Warehouse } from 'src/admin/Product/product.models';
export declare class User extends BaseModel {
    password_hash: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: Number;
    is_active: Number;
    businesses: Business[];
    userWallet: UserWallet;
    mobile: string;
    gst_no: string;
    gst_treatment: string;
    addresses: Address[];
    carts: Cart[];
    userCoupons: UserCoupon[];
}
export declare class Address extends BaseModel {
    user: User;
    shippingOutlet: Promise<Outlet>;
    billingOutlet: Promise<Outlet>;
    address_line1: string;
    address_line2: string;
    address_line3: string;
    postalcode: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
}
export declare class UserOtp extends BaseModel {
    otp: Number;
    mobile: String;
    is_Active: Boolean;
}
export declare class Business extends BaseModel {
    business_name: string;
    business_website: string;
    user: User;
    user_id: string;
    outlets: Outlet[];
}
export declare class Cuisine extends BaseModel {
    name: string;
    image: string;
}
export declare class Outlet extends BaseModel {
    address_id: string;
    outlet_image: string;
    outlet_name: string;
    fssai: string;
    name: string;
    business: Business;
    business_id: string;
    couponApplicable: boolean;
    shippingAddress: Promise<Address>;
    shipping_address_id: string;
    zoho_shipping_address_id: string;
    billingAddress: Promise<Address>;
    billing_address_id: string;
    zoho_billing_address_id: string;
    zoho_contact_id: string;
    attempts_to_create_on_zoho: number;
    sales_poc: string;
    is_zoho_created: number;
    address: Address;
    cuisines: Cuisine[];
    cart: Cart;
}
export interface OutletInput {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    address_id?: string;
    outlet_image?: string;
    outlet_name?: string;
    gst?: string;
    fssai?: string;
    business_id?: string;
    coupon_applicable?: boolean;
    shipping_address_id?: string;
    billing_address_id?: string;
}
export interface AddressInput {
    user: User;
    warehouse: Warehouse;
    warehouse_id: string;
    address_line1: string;
    address_line2?: string;
    address_line3?: string;
    postalcode: string;
    stateName?: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
}

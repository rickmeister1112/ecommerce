import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { UserWallet } from '../Payment/payment.models';
import { Cart } from '../Cart/cart.users.models';
import { UserCoupon } from 'src/admin/Voucher/voucher.models';
import { Warehouse } from 'src/admin/Product/product.models';


@Entity()
export class User extends BaseModel {
  @Column({ type: 'text', unique: true })
  password_hash: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'integer', default: 0 })
  is_admin: Number;

  @Column({ type: 'integer', default: 0 })
  is_active: Number;

  @OneToMany(() => Business, business => business.user)
  businesses: Business[];

  @OneToOne(() => UserWallet, userWallet => userWallet.user)
  userWallet: UserWallet;

  @Column({ type: 'text', default: '', unique: true })
  mobile: string;

  @Column({ type: 'uuid', nullable : true})
  gst_no: string;

  @Column({ type : 'text', default : 'business_none'})
  gst_treatment: string;

  @OneToMany(() => Address, address => address.user)
  addresses: Address[];

  @OneToMany(() => Cart, cart => cart.customer)
  carts: Cart[];

  @OneToMany(() => UserCoupon, userCoupon => userCoupon.user)
  userCoupons: UserCoupon[];
}

@Entity()
export class Address extends BaseModel {
  @ManyToOne(() => User, user => user.addresses)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => Outlet, outlet => outlet.shippingAddress)
  shippingOutlet: Promise<Outlet>;

  @OneToOne(() => Outlet, outlet => outlet.billingAddress)
  billingOutlet: Promise<Outlet>;

  @Column({ type: 'text' })
  address_line1: string;

  @Column({ type: 'text', default: "" })
  address_line2: string;

  @Column({ type: 'text', default: "" })
  address_line3: string;

  @Column({ type: 'text' })
  postalcode: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text' })
  state: string;

  @Column({ type: 'text' })
  country: string;

  @Column({ type: 'text' })
  latitude: string;

  @Column({ type: 'text' })
  longitude: string;
}

@Entity()
export class UserOtp extends BaseModel {
  @Column({ type: 'integer', nullable: false, default: 0 })
  otp: Number;

  @Column({ type: 'text' })
  mobile: String;

  @Column({ type: 'boolean', default: false })
  is_Active: Boolean;
}

@Entity()
export class Business extends BaseModel {

  @Column({ type: 'text', default: 'Unregistered Business' })
  business_name: string;

  @Column({ type : 'text', default : ''})
  business_website: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;

  @OneToMany(() => Outlet, outlet => outlet.id)
  outlets: Outlet[];
}

@Entity()
export class Cuisine extends BaseModel {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  image: string;
}

@Entity()
export class Outlet extends BaseModel {
  @Column({ type: 'uuid', nullable: true })
  address_id: string;

  @Column({ type: 'text', default: "" })
  outlet_image: string;

  @Column({ type: 'text', nullable: true })
  outlet_name: string;

  @Column({ type: 'text', nullable: true })
  fssai: string;

  @Column({ type: 'text', default: "" })
  name: string;

  @ManyToOne(() => Business, (business) => business.outlets)
  @JoinColumn({ name: "business_id" })
  business: Business;

  @Column({ type: "uuid" })
  business_id: string;

  @Column({ type: 'boolean', default: true })
  couponApplicable: boolean;

  @OneToOne(() => Address)
  @JoinColumn({ name: "shipping_address_id" })
  shippingAddress: Promise<Address>;

  @Column({ type: 'uuid', nullable: true })
  shipping_address_id: string;

  @Column({ type: 'text', nullable :true})
  zoho_shipping_address_id: string;

  @OneToOne(() => Address)
  @JoinColumn({ name: "billing_address_id" })
  billingAddress: Promise<Address>;

  @Column({ type: 'uuid', nullable: true })
  billing_address_id: string;

  @Column({ type: 'text', nullable: true})
  zoho_billing_address_id: string;

  @Column({ type: 'text', nullable: true})
  zoho_contact_id: string;

  @Column({ type: 'int', default :0})
  attempts_to_create_on_zoho: number;

  @Column({ type: 'text', nullable: true})
  sales_poc: string;

  @Column({ type: 'int', default: 0})
  is_zoho_created: number;

  @OneToOne(() => Address, address => address.id)
  @JoinColumn({ name: "address_id" })
  address: Address;

  @ManyToMany(() => Cuisine)
  @JoinTable()
  cuisines: Cuisine[]

  @OneToOne(() => Cart, cart => cart.outlet)
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

export interface AddressInput{
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
import { Coupon } from "src/admin/Voucher/voucher.models";
import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { User } from "../Customer/customer.models";
import { BaseModel } from "../utils/base.model";

@Entity()
export class CouponCustomer extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.id)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @Column({ type: "uuid" })
  coupon_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;
}
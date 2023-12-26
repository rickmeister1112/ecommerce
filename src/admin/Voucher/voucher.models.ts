import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { Category, CollectionReference, Product, SSubCategory, SubCategory, WarehouseProduct } from '../Product/product.models';
import { User } from 'src/customer/Customer/customer.models';

@Entity()
export class Coupon extends BaseModel {
  // createQueryBuilder(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'int', default: 1 }) // 1: fixed for Rupeee , 2: discount percentage
  couponType: number;

  @Column({ type: 'decimal', precision: 2, default: 0.00 })
  coupounValue: number;

  @Column({ type: 'timestamptz' })
  expiryDate: Date;

  @Column({ type: 'int', default: 0 })
  counter: number;

  @Column({ type: "int", nullable: true })
  maxUsage: number; // Total number of coupons available

  @Column({  type: "int", nullable: true })
  dailyLimit: number; // Daily usage limit

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  couponCategory: number; // 1: product, 2: category, 3: sub-category, 4: sub-sub-category, 5-collection

  @OneToMany(() => ProductCoupon, productCoupon => productCoupon.coupon)
  productCoupons: ProductCoupon[];

  @OneToMany(() => CollectionCoupon, collectionCoupon => collectionCoupon.coupon)
  collectionCoupons: CollectionCoupon[];

  @OneToMany(() => CategoryCoupon, categoryCoupon => categoryCoupon.coupon)
  categoryCoupons: CategoryCoupon[];

  @OneToMany(() => SubCategoryCoupon, subCategoryCoupon => subCategoryCoupon.coupon)
  subCategoryCoupons: SubCategoryCoupon[];

  @OneToMany(() => SubSubCategoryCoupon, subSubCategoryCoupon => subSubCategoryCoupon.coupon)
  subSubCategoryCoupons: SubSubCategoryCoupon[];

  @OneToMany(() => UserCoupon, userCoupon => userCoupon.coupon)
  userCoupons: UserCoupon[];
}

@Entity()
export class ProductCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.productCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => WarehouseProduct, warehouseProduct => warehouseProduct.id)
  @JoinColumn({ name: 'warehouse_product_id' })
  warehouseProduct: WarehouseProduct;
  @Column({type: 'uuid'})
  warehouse_product_id : string;
}

@Entity()
export class CollectionCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.collectionCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => CollectionReference, collectionReference => collectionReference.id)
  @JoinColumn({ name: 'collection_id' })
  collectionReference: CollectionReference;
  @Column({type : 'uuid'})
  collection_id : string;
}

@Entity()
export class CategoryCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.categoryCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;
  @Column({type : 'uuid'})
  category_id : string;
}

@Entity()
export class SubCategoryCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.subCategoryCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => SubCategory, subCategory => subCategory.id)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;
  @Column({type : 'uuid'})
  sub_category_id : string;
}

@Entity()
export class SubSubCategoryCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.subSubCategoryCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => SSubCategory, sSubCategory => sSubCategory.id)
  @JoinColumn({ name: 'sub_sub_category_id' })
  ssubCategory: SSubCategory;
  @Column({type : 'uuid'})
  sub_sub_category_id : string;
}

@Entity()
export class UserCoupon extends BaseModel {
  @ManyToOne(() => Coupon, coupon => coupon.userCoupons)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;
  @Column({type: 'uuid'})
  coupon_id : string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({type : 'uuid'})
  customer_id : string;
}

@Entity()
export class ExcludeCoupon extends BaseModel {
  @ManyToOne(() => WarehouseProduct, warehouseProduct => warehouseProduct.id)
  @JoinColumn({ name: 'warehouse_product_id' })
  warehouseProduct: WarehouseProduct;
  @Column({type: 'uuid'})
  warehouse_product_id : string;

  @Column({ type : 'boolean'})
  is_Active : boolean;
  // if the future condition comes where specific coupon needs to be blacklisted for a specific product it can be acheived through this table
}
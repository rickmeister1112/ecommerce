import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index, ManyToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { BaseModel } from '../utils/base.model';
import { Address, User } from 'src/customer/Customer/customer.models';
import { CategoryCoupon, CollectionCoupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon } from '../Voucher/voucher.models';
import { Cart } from 'src/customer/Cart/cart.users.models';
import { Tax } from '../Taxes/taxes.models';
import { Shipping } from '../Shipping/shipping.models';
import { Order } from 'src/customer/Order/order.models';

@Entity()
export class TaxSlab extends BaseModel {
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  tax_percentage: number;

  @Column({ type: 'int' })
  tax_id: number;
}

@Entity()
export class Category extends BaseModel {
  @Column({ type: 'text', default: '' })
  name: string;

  @Column({ type: 'text', default: '' })
  images: string;

  @OneToMany(() => SubCategory, sub => sub.category)
  sub_categories;

  @OneToMany(() => Product, p => p.category)
  products;

  @OneToMany(() => CategoryCoupon, categoryCoupon => categoryCoupon.category)
  categoryCoupons: CategoryCoupon[];

}

@Entity()
export class SubCategory extends BaseModel {
  @Column({ type: 'text', default: '' })
  sub_category_name: string;

  @Column({ type: 'text', default: '' })
  images: string;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'uuid' })
  category_id: string;  // Assuming you're using string UUIDs  

  @OneToMany(() => SSubCategory, sub => sub.subCategory)
  sub_categories;

  @OneToMany(() => Product, p => p.sub_category)
  products;

  @OneToMany(() => SubCategoryCoupon, subCategoryCoupon => subCategoryCoupon.subCategory)
  subCategoryCoupons: SubCategoryCoupon[];
}

@Entity()
export class SSubCategory extends BaseModel {
  @Column({ type: 'text', default: '' })
  ssub_category_name: string;

  @Column({ type: 'text', default: '' })
  images: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.id)
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: String;

  @Column({ type: 'uuid' })
  sub_category_id: string;

  @OneToMany(() => Product, p => p.ssub_category)
  products;

  @OneToMany(() => SubSubCategoryCoupon, subSubCategoryCoupon => subSubCategoryCoupon.ssubCategory)
  subSubCategoryCoupons: SubSubCategoryCoupon[];
}


@Entity()
export class WarehouseProduct extends BaseModel {

  @Column({ type: "text", default: '' })
  product_warehouse_name: string;

  @Column({ type: "text", default: '' })
  product_warehouse_description: string;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: number;

  @Column({ type: "text" })
  product_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: number;

  @Column({ type: "uuid" })
  warehouse_id: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'integer', default: 0 })
  minimum_order_quantity: number;

  @Column({ type: 'integer', default: 0 })
  maximum_order_quantity: number;

  @Column({ type: 'integer', default: 0 })
  increment_factor: number;

  @Column({ type: 'integer', default: 0 })
  start_value: Number;

  @Column({ type: 'integer', default: 0 })
  end_value: Number;

  @Column({ type: 'integer', default: 0 })
  markup: Number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  percentage: number;

  @Column({ type: 'integer', default: 0 })
  is_sale: number;

  @Column({ type: 'text', default: '' })
  unit: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: String;

  @Column({ type: "boolean", default: true })
  is_never_out_of_stock: boolean;

  @OneToMany(() => CollectionWarehouseProduct, (cwp) => cwp.warehouseProduct)
  collectionWarehouseProducts: CollectionWarehouseProduct[];

  @Column({ type: 'int', default: 0 })
  is_exempted_coupon: number;

  @OneToMany(() => ProductCoupon, productCoupon => productCoupon.warehouseProduct)
  productCoupons: ProductCoupon[];
}

@Entity()
export class Product extends BaseModel {
  @Column({ type: 'text', default: '' })
  product_name: string;

  @Column({ type: 'text', default: '' })
  product_description: string;

  @Column({ type: 'text', default: 0 })
  sku_number: string;

  @Column({ type: 'text', default: '' })
  images: string;

  @Column({ type: 'text', default: '' })
  brand: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'text', default: '' })
  unit: string;

  @Column({ type: 'text', default: '' })
  product_tag: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;  // Assuming you're using string UUIDs  

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  sub_category_id: string;  // Assuming you're using string UUIDs  

  @ManyToOne(() => SubCategory, (category) => category.id)
  @JoinColumn({ name: 'sub_category_id' })
  sub_category: SubCategory;

  @Column({ type: 'uuid', nullable: true })
  ssub_category_id: string;  // Assuming you're using string UUIDs  

  @ManyToOne(() => SSubCategory, (category) => category.id)
  @JoinColumn({ name: 'ssub_category_id' })
  ssub_category: SSubCategory;

  @ManyToOne(() => Tax, (taxSlab) => taxSlab.id)
  @JoinColumn({ name: "inter_state_tax_id" })
  taxSlab: Tax;

  @Column({ type: "text" ,  nullable : true})
  inter_state_tax_id: string;

  @ManyToOne(() => Tax, (taxSlab) => taxSlab.id)
  @JoinColumn({ name: "intra_state_tax_id" })
  taxSlabs: Tax;

  @Column({ type: 'text', nullable : true})
  intra_state_tax_id: string;

  @OneToMany(() => WarehouseProduct, (wp) => wp.product)
  warehouseProducts: WarehouseProduct;

  @Column({ type: 'text', default: 0 })
  hsn_or_sac: string;

  @Column({ type: 'text', default: 0 })
  status: string;

  @Column({ type: 'text', default: '' })
  tags: string;

  @Column({ type: 'int', default: 0 })
  is_synced: number;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true })
  item_id_zoho: string;

  @Column({ type: "text", default: "0" })
  price: string;
  @Column({type: 'int', default: 0})
  zoho_tax_type: number; //1: inter, 2: intra

  @Column({ type : 'text', default: ''})
  zoho_inter_state_tax_id: string;

  @Column({ type: 'text', default: ''})
  zoho_intra_state_tax_id: string;
}


@Entity()
export class Warehouse extends BaseModel {
  @Column({ type: 'text', default: '' })
  warehouse_name: string;

  @Column({ type: 'text', nullable: true })
  warehouse_location: string;

  @Column({ type: 'text', default: '0' })
  zoho_warehouse_id: string;

  @ManyToOne(() => PincodeGroup, group => group.warehouses)
  pincodeGroup: Promise<PincodeGroup>;

  @OneToMany(() => CollectionReference, (coll) => coll.warehouse)
  collections: CollectionReference[];

  @OneToMany(() => WarehouseProduct, (prod) => prod.warehouse)
  products: WarehouseProduct[];

  @OneToMany(() => CollectionWarehouseProduct, (cwp) => cwp.warehouse)
  collectionWarehouseProducts: CollectionWarehouseProduct[];

  @OneToMany(() => Cart, cart => cart.warehouse)
  cart: Cart;

  @OneToMany(() => Shipping, shipping => shipping.warehouse)
  shipping: Shipping[];

  @ManyToOne(()=> Order, order => order.warehouse)
  order: Order;
}


@Entity()
export class Pincode extends BaseModel{

    @Column()
    pincode_name: string;

    @ManyToOne(() => PincodeGroup, group => group.pincodes)
    group: Promise<PincodeGroup>;
}

@Entity()
export class PincodeGroup extends BaseModel{

    @Column()
    group_name: string;

    @OneToMany(() => Pincode, pincode => pincode.group)
    pincodes: Promise<Pincode[]>;

    @OneToMany(() => Warehouse, warehouse => warehouse.pincodeGroup)
    warehouses: Warehouse[];

    @OneToMany(() => Shipping, shipping => shipping.pincodeGroup)
    shipping: Shipping[];

    @Column({type: 'boolean', default: false})
    is_gst_applicable;
}


@Entity()
export class CollectionReference extends BaseModel {
  @Column({ type: 'text', default: '' })
  product_collection_status: number;

  @Column({ type: "text", default: "" })
  collection_name: string;

  @Column({ type: "text", default: "" })
  collection_type: string;

  @OneToMany(() => CollectionWarehouseProduct, (cwp) => cwp.collection)
  warehouse_products: CollectionWarehouseProduct[];

  @Column({ type: "uuid" })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;

  @OneToMany(() => CollectionCoupon, collectionCoupon => collectionCoupon.collectionReference)
  collectionCoupons: CollectionCoupon[];
}

@Entity()
export class CollectionWarehouseProduct extends BaseModel {
  @Column({ type: "uuid" })
  warehouse_product_id: string;

  @ManyToOne(() => WarehouseProduct, (wp) => wp.id)
  @JoinColumn({ name: "warehouse_product_id" })
  warehouseProduct: WarehouseProduct;

  @Column({ type: "uuid" })
  collection_id: string;

  @ManyToOne(() => CollectionReference, (col) => col.id)
  @JoinColumn({ name: "collection_id" })
  collection: CollectionReference;

  @Column({ type: "uuid" })
  warehouse_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;
}


@Entity()
export class BasePricing extends BaseModel {
  @ManyToOne(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.id)
  @JoinColumn({ name: 'product_warehouse_id' })
  productWarehouse: WarehouseProduct;

  @Column({ type: "uuid" })
  product_warehouse_id: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  slab_price: number;

  @Column({ type: 'integer' })
  min_qty: number;

  @Column({ type: 'int', default: 0 })
  total_quantity_for_sale: number;

  @Column({ type: 'int', default: 0 })
  total_quantity_user: number;

  @Column({ type: 'boolean' })
  is_sale: boolean;

  @Column({ type: 'boolean' })
  is_default: boolean;

  @Column({ type: 'boolean' })
  is_active: boolean;
}

@Entity()
export class UserSpecificPricing extends BaseModel {
  @ManyToOne(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.id)
  @JoinColumn({ name: 'product_warehouse_id' })
  productWarehouse: WarehouseProduct;

  @Column({ type: "uuid" })
  product_warehouse_id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.id)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ type: "text" })
  warehouse_id: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  slab_price: number;

  @Column({ type: 'integer' })
  min_qty: number;

  @Column({ type: 'boolean' })
  is_active: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  sale_start: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sale_ended: Date;
}
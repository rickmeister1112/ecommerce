import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category, CollectionReference, SSubCategory, SubCategory, Warehouse, WarehouseProduct } from '../../admin/Product/product.models';
import { Address, User, Outlet } from '../Customer/customer.models';
import { BaseModel } from '../utils/base.model';


@Entity()
export class Cart extends BaseModel {
  findOne(arg0: { where: { id: string; }; relations: string[]; }) {
    throw new Error('Method not implemented.');
  }
  @Column({ type: 'float', default: 0.00 })
  total: number;

  @Column({ type: 'float', default: 0.00 })
  subtotal: number;

  @Column({ type: 'float', default: 0.00 })
  discount: number;

  @Column({ type: "text", nullable: true })
  coupon: string;

  @OneToMany(() => CartInlineItem, item => item.cart)
  items: CartInlineItem[];

  @Column({ type: 'float', default: 0.00, nullable: true })
  vat: number;

  @Column({ type: 'float', default: 0.00, nullable: true })
  cgst: number;

  @Column({ type: 'float', default: 0.00, nullable: true })
  sgst: number;

  @Column({ type: 'float', default: 0.00, nullable: true })
  shippingCost: number;

  @Column({ type: 'float', default: 0.00, nullable: true })
  handlingCost: number;

  @Column({ type: "text" })
  customer_id: string;

  @ManyToOne(() => User, user => user.carts)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ManyToOne(() => Address, address => address.id)
  @JoinColumn({ name: "address_id" })
  address: Address;

  @Column({ type: 'text', nullable: true })
  address_id: string;

  @ManyToOne(() => Outlet, outlet => outlet.cart)
  @JoinColumn({ name: "outlet_id" })
  outlet: Outlet

  @Column({ type: 'text' })
  outlet_id: string;

  @ManyToOne(() => Warehouse, warehouse => warehouse.cart)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse

  @Column({ type: 'uuid' , nullable : true})
  warehouse_id: string;

  @Column({ type: 'text', nullable: true})
  zoho_contact_id: string;

}

@Entity()
export class CartInlineItem extends BaseModel {
  @ManyToOne(() => WarehouseProduct, productWarehouse => productWarehouse.id)
  @JoinColumn({ name: "product_warehouse_id" })
  productWarehouse: WarehouseProduct;

  @Column({ type: "text", default : ''})
  product_warehouse_name: string;

  @Column({ type: "text", default: ''})
  product_warehouse_description: string;

  @Column({ type: "uuid", nullable : true })
  warehouse_id: string;

  @Column({ type: 'float', default: 0.00 })
  final_price: number;

  @Column({ type: 'float', default: 0.00 })
  total_price: number;

  @Column({ type: 'float', default: 0.00 })
  item_level_discount: number;

  @Column({ type: 'int', default: 0, nullable: false })
  quantity: number;

  @Column({ type: 'text', default: '' })
  unit: string;

  @Column({ default: false, type: "boolean" })
  is_complimentary: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complimentary_message: string;

  @Column({ default: false, type: "boolean" })
  is_discount_exempted: boolean;

  @Column({ default: false, type: "boolean" })
  is_tax_inclusive: boolean;

  @Column({ type: 'varchar', length: 55, nullable: true })
  group_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancellation_message: string;

  @Column({ type: 'int', nullable: true })
  combo_id: number;

  @Column({ type: 'text', nullable: true })
  image_link: string;

  @Column({ type: 'int', nullable: true })
  invoice_number: number;

  @Column({ type: 'float', default: 0.00 })
  calc_total_agg_tax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  calc_total_agg_tax_percent: number;

  @Column({ type: 'float', default: 0.00 })
  calc_item_tax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  calc_item_tax_percent: number;

  @Column({ type: 'float', default: 0.00 })
  calc_add_on_total: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  calc_item_discount_percentage: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  saved_category_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  saved_parent_category_name: string;

  @ManyToOne(()=>Category, category => category.id)
  category: Category;

  @Column({ type : 'uuid', nullable : true})
  category_id: string;

  @ManyToOne(()=>SubCategory, subcategory => subcategory.id)
  subcategory: SubCategory;

  @Column({ type : 'uuid', nullable : true})
  subcategory_id: string;

  @ManyToOne(()=>SSubCategory, ssubcategory => ssubcategory.id)
  ssubcategory: SSubCategory;

  @Column({ type : 'uuid', nullable : true})
  ssubcategory_id: string;

  @ManyToOne(()=>CollectionReference, collectionRefernce => collectionRefernce.id)
  collectionReference : CollectionReference;

  @Column({ type : 'uuid', nullable : true})
  collectionReference_id: string;

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: "cart_id" })
  cart: Cart;

  @Column({ type: 'text', nullable: true })
  cart_id: string;

  @Column({ type : 'text', nullable : true})
  item_id_zoho : string;
}

@Entity()
export class TaxBreakUp extends BaseModel {
  @Column({ type: 'varchar', length: 64, nullable: true })
  tax_name: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  tax_value: number;

  @Column({ type: 'float', default: 0.00 })
  tax_amount: number;

  @ManyToOne(() => CartInlineItem, CartInlineItem => CartInlineItem.id, { onDelete: 'CASCADE' })
  CartInlineItem: CartInlineItem;
}

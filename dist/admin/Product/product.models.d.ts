import { BaseModel } from '../utils/base.model';
import { User } from 'src/customer/Customer/customer.models';
import { CategoryCoupon, CollectionCoupon, ProductCoupon, SubCategoryCoupon, SubSubCategoryCoupon } from '../Voucher/voucher.models';
import { Cart } from 'src/customer/Cart/cart.users.models';
import { Tax } from '../Taxes/taxes.models';
import { Shipping } from '../Shipping/shipping.models';
import { Order } from 'src/customer/Order/order.models';
export declare class TaxSlab extends BaseModel {
    tax_percentage: number;
    tax_id: number;
}
export declare class Category extends BaseModel {
    name: string;
    images: string;
    sub_categories: any;
    products: any;
    categoryCoupons: CategoryCoupon[];
}
export declare class SubCategory extends BaseModel {
    sub_category_name: string;
    images: string;
    category: Category;
    category_id: string;
    sub_categories: any;
    products: any;
    subCategoryCoupons: SubCategoryCoupon[];
}
export declare class SSubCategory extends BaseModel {
    ssub_category_name: string;
    images: string;
    subCategory: String;
    sub_category_id: string;
    products: any;
    subSubCategoryCoupons: SubSubCategoryCoupon[];
}
export declare class WarehouseProduct extends BaseModel {
    product_warehouse_name: string;
    product_warehouse_description: string;
    product: number;
    product_id: string;
    warehouse: number;
    warehouse_id: string;
    quantity: number;
    minimum_order_quantity: number;
    maximum_order_quantity: number;
    increment_factor: number;
    start_value: Number;
    end_value: Number;
    markup: Number;
    percentage: number;
    is_sale: number;
    unit: string;
    user: String;
    is_never_out_of_stock: boolean;
    collectionWarehouseProducts: CollectionWarehouseProduct[];
    is_exempted_coupon: number;
    productCoupons: ProductCoupon[];
}
export declare class Product extends BaseModel {
    product_name: string;
    product_description: string;
    sku_number: string;
    images: string;
    brand: string;
    quantity: number;
    unit: string;
    product_tag: string;
    category_id: string;
    category: Category;
    sub_category_id: string;
    sub_category: SubCategory;
    ssub_category_id: string;
    ssub_category: SSubCategory;
    taxSlab: Tax;
    inter_state_tax_id: string;
    taxSlabs: Tax;
    intra_state_tax_id: string;
    warehouseProducts: WarehouseProduct;
    hsn_or_sac: string;
    status: string;
    tags: string;
    is_synced: number;
    type: string;
    item_id_zoho: string;
    price: string;
    zoho_tax_type: number;
    zoho_inter_state_tax_id: string;
    zoho_intra_state_tax_id: string;
}
export declare class Warehouse extends BaseModel {
    warehouse_name: string;
    warehouse_location: string;
    zoho_warehouse_id: string;
    pincodeGroup: Promise<PincodeGroup>;
    collections: CollectionReference[];
    products: WarehouseProduct[];
    collectionWarehouseProducts: CollectionWarehouseProduct[];
    cart: Cart;
    shipping: Shipping[];
    order: Order;
}
export declare class Pincode extends BaseModel {
    pincode_name: string;
    group: Promise<PincodeGroup>;
}
export declare class PincodeGroup extends BaseModel {
    group_name: string;
    pincodes: Promise<Pincode[]>;
    warehouses: Warehouse[];
    shipping: Shipping[];
    is_gst_applicable: any;
}
export declare class CollectionReference extends BaseModel {
    product_collection_status: number;
    collection_name: string;
    collection_type: string;
    warehouse_products: CollectionWarehouseProduct[];
    warehouse_id: string;
    warehouse: Warehouse;
    collectionCoupons: CollectionCoupon[];
}
export declare class CollectionWarehouseProduct extends BaseModel {
    warehouse_product_id: string;
    warehouseProduct: WarehouseProduct;
    collection_id: string;
    collection: CollectionReference;
    warehouse_id: string;
    warehouse: Warehouse;
}
export declare class BasePricing extends BaseModel {
    productWarehouse: WarehouseProduct;
    product_warehouse_id: string;
    slab_price: number;
    min_qty: number;
    total_quantity_for_sale: number;
    total_quantity_user: number;
    is_sale: boolean;
    is_default: boolean;
    is_active: boolean;
}
export declare class UserSpecificPricing extends BaseModel {
    productWarehouse: WarehouseProduct;
    product_warehouse_id: string;
    user: User;
    user_id: string;
    warehouse: Warehouse;
    warehouse_id: string;
    slab_price: number;
    min_qty: number;
    is_active: boolean;
    sale_start: Date;
    sale_ended: Date;
}

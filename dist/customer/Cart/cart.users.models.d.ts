import { Category, CollectionReference, SSubCategory, SubCategory, Warehouse, WarehouseProduct } from '../../admin/Product/product.models';
import { Address, User, Outlet } from '../Customer/customer.models';
import { BaseModel } from '../utils/base.model';
export declare class Cart extends BaseModel {
    findOne(arg0: {
        where: {
            id: string;
        };
        relations: string[];
    }): void;
    total: number;
    subtotal: number;
    discount: number;
    coupon: string;
    items: CartInlineItem[];
    vat: number;
    cgst: number;
    sgst: number;
    shippingCost: number;
    handlingCost: number;
    customer_id: string;
    customer: User;
    address: Address;
    address_id: string;
    outlet: Outlet;
    outlet_id: string;
    warehouse: Warehouse;
    warehouse_id: string;
    zoho_contact_id: string;
}
export declare class CartInlineItem extends BaseModel {
    productWarehouse: WarehouseProduct;
    product_warehouse_name: string;
    product_warehouse_description: string;
    warehouse_id: string;
    final_price: number;
    total_price: number;
    item_level_discount: number;
    quantity: number;
    unit: string;
    is_complimentary: boolean;
    complimentary_message: string;
    is_discount_exempted: boolean;
    is_tax_inclusive: boolean;
    group_name: string;
    cancellation_message: string;
    combo_id: number;
    image_link: string;
    invoice_number: number;
    calc_total_agg_tax: number;
    calc_total_agg_tax_percent: number;
    calc_item_tax: number;
    calc_item_tax_percent: number;
    calc_add_on_total: number;
    calc_item_discount_percentage: number;
    saved_category_name: string;
    saved_parent_category_name: string;
    category: Category;
    category_id: string;
    subcategory: SubCategory;
    subcategory_id: string;
    ssubcategory: SSubCategory;
    ssubcategory_id: string;
    collectionReference: CollectionReference;
    collectionReference_id: string;
    cart: Cart;
    cart_id: string;
    item_id_zoho: string;
}
export declare class TaxBreakUp extends BaseModel {
    tax_name: string;
    tax_value: number;
    tax_amount: number;
    CartInlineItem: CartInlineItem;
}

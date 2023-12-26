import { Order } from "./order.models";

export interface LineItem {
    quantity_invoiced: string;
    item_id: string;
    quantity_delivered: string;
    quantity_backordered: string;
    quantity_packed: string;
    item_sub_total: string;
    quantity_shipped: string;
    quantity_returned: string;
  }
  
export  interface PackagePayload {
    date: string;
    status_message: string;
    quantity: string;
    shipment_order: string;
    package_id: string;
    status: string;
    shipment_id: string;
    package_number: string;
    shipment_status: string;
    tracking_number: string;
    shipment_number: string;
    shipment_date: string;
  }

  export interface CreateOrderResponse {
    status: string;
    message: string;
  }

  export interface OrderStatusResponse{
    status: string;
    order: Order;
  }

  export interface ItemInput {
    name: string;
    final_price: number;
    total_price: number;
    item_level_discount: number;
    quantity: number;
    is_complimentary: boolean;
    complimentary_message?: string;
    is_discount_exempted: boolean;
    is_tax_inclusive: boolean;
    group_name?: string;
    cancellation_message?: string;
    combo_id?: number;
    image_link?: string;
    calc_total_agg_tax: number;
    calc_total_agg_tax_percent: number;
    calc_item_tax: number;
    calc_item_tax_percent: number;
    calc_add_on_total: number;
    calc_item_discount_percentage: number;
  }
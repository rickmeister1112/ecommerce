import { AxiosResponse } from 'axios';
interface RequestOptions {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    baseURL: string;
    endpoint: string;
    params: any;
}
interface ItemDetails {
    code: string;
    name: string;
}
interface TokenParamsRefreshToken {
    grant_type: string;
    refresh_token: string;
    client_id: string;
    client_secret: string;
}
interface LineItem {
    item_id: string;
    name: string;
    description: string;
    rate: number;
    quantity: number;
    unit: string;
    tax_name: string;
    tax_type: string;
    tax_percentage: number;
    item_total: number;
}
export interface ZohoContact {
    contact_name?: string;
    company_name?: string;
    payment_terms?: number;
    currency_id?: string;
    website?: string;
    contact_type?: string;
    custom_fields?: Array<{
        value: string;
        index: number;
    }>;
    billing_address?: object;
    shipping_address?: object;
    contact_persons?: object;
    default_templates?: object;
    language_code?: string;
    notes?: string;
    vat_reg_no?: string;
    tax_reg_no?: string;
    country_code?: string;
    vat_treatment?: string;
    tax_treatment?: string;
    tax_regime?: string;
    is_tds_registered?: boolean;
    avatax_exempt_no?: string;
    avatax_use_code?: string;
    tax_exemption_id?: string;
    tax_authority_id?: string;
    tax_id?: boolean;
    is_taxable?: boolean;
    facebook?: string;
    twitter?: string;
    place_of_contact?: string;
    gst_no?: string;
    gst_treatment?: string;
    tax_authority_name?: string;
    tax_exemption_code?: string;
    fssai?: string;
}
export declare class ZohoHelper {
    constructor();
    generateAccessToken: (options?: RequestOptions) => Promise<AxiosResponse<any>>;
    tokenParamsRefresh: TokenParamsRefreshToken;
    optionsRefresh: RequestOptions;
    private getAuthHeaders;
    getTaxes(): Promise<{
        code: number;
        message: string;
        taxes: {
            tax_id: number;
            tax_percentage: number;
        }[];
        page_context: any;
    }>;
    postInventoryItem(item: any): Promise<AxiosResponse>;
    getItemDetailsAtWarehouseLevel(organizationID: string, itemIDs: string[]): Promise<ItemDetails[]>;
    incrementSalesOrderNumber(salesOrderNumber: any): Promise<string>;
    serializeBigInt(data: any): Promise<string>;
    createSalesOrder(lineItems: LineItem[], salesorder_number: any, outlet_id: any): Promise<any>;
    getInvoice(invoiceId: any): Promise<any>;
    createZohoContact(contactData: ZohoContact): Promise<any>;
}
export {};

import { BaseModel } from "../utils/base.model";
export declare class Tax extends BaseModel {
    tax_name: string;
    tax_type: number;
    tax_rate: number;
    CGST: number;
    SGST: number;
    IGST: number;
    CESS: number;
    zoho_tax_id: string;
}

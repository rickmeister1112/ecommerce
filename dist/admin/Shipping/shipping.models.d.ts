import { BaseModel } from '../utils/base.model';
import { Warehouse, PincodeGroup } from '../Product/product.models';
export declare class Slot extends BaseModel {
    slotName: string;
    startTime: string;
    endTime: string;
}
export declare class DefaultShipping extends BaseModel {
    orderValue: number;
    amount: number;
}
export declare class Shipping extends BaseModel {
    orderValue: number;
    amount: number;
    warehouse: Warehouse;
    warehouse_id: string;
    pincodeGroup: PincodeGroup;
}

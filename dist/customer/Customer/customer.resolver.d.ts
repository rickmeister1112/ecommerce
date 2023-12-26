import { DataSource } from 'typeorm';
import { User, Address, AddressInput } from './customer.models';
declare const UserResolver_base: any;
export declare class UserResolver extends UserResolver_base {
    constructor(dataSource: DataSource);
    hasAddPermission(rows: User[], user?: User): Promise<void>;
    hasUpdatePermission(currentObj: User, newObj: User, user?: User): Promise<User>;
}
declare const OutletResolver_base: any;
export declare class OutletResolver extends OutletResolver_base {
    constructor(dataSource: DataSource);
}
declare const BusinessResolver_base: any;
export declare class BusinessResolver extends BusinessResolver_base {
    constructor(dataSource: DataSource);
}
declare const AddressResolver_base: any;
export declare class AddressResolver extends AddressResolver_base {
    constructor(dataSource: DataSource);
    addInegratedAddress(row: AddressInput): Promise<Address>;
}
export {};

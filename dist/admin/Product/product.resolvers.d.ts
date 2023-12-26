import { DataSource } from 'typeorm';
import { Category, SubCategory, SSubCategory } from './product.models';
declare const TaxSlabAdminResolver_base: any;
export declare class TaxSlabAdminResolver extends TaxSlabAdminResolver_base {
    constructor(dataSource: DataSource);
}
declare const CategoryResolver_base: any;
export declare class CategoryResolver extends CategoryResolver_base {
    constructor(dataSource: DataSource);
    deleteCategory(id: string): Promise<Category>;
}
declare const SubCategoryResolver_base: any;
export declare class SubCategoryResolver extends SubCategoryResolver_base {
    constructor(dataSource: DataSource);
    addSubCategory(row: SubCategory): Promise<SubCategory>;
    listSubCategory(categoryId: string, page?: number, limit?: number, order_by?: string[]): Promise<SubCategory[]>;
    private parseOrderBy;
}
declare const SSubCategoryResolver_base: any;
export declare class SSubCategoryResolver extends SSubCategoryResolver_base {
    constructor(dataSource: DataSource);
    addSSubCategory(row: SSubCategory): Promise<SSubCategory>;
}
declare const ProductResolver_base: any;
export declare class ProductResolver extends ProductResolver_base {
    constructor(dataSource: DataSource);
}
declare const WarehouseProductResolver_base: any;
export declare class WarehouseProductResolver extends WarehouseProductResolver_base {
    constructor(dataSource: DataSource);
}
declare const CollectionReferenceResolver_base: any;
export declare class CollectionReferenceResolver extends CollectionReferenceResolver_base {
    constructor(dataSource: DataSource);
}
declare const WarehouseIdsResolver_base: any;
export declare class WarehouseIdsResolver extends WarehouseIdsResolver_base {
    constructor(dataSource: DataSource);
}
declare const BasePricingResolver_base: any;
export declare class BasePricingResolver extends BasePricingResolver_base {
    constructor(dataSource: DataSource);
}
declare const UserSpecificPricingResolver_base: any;
export declare class UserSpecificPricingResolver extends UserSpecificPricingResolver_base {
    constructor(dataSource: DataSource);
}
declare const CollectionWarehouseProductResolver_base: any;
export declare class CollectionWarehouseProductResolver extends CollectionWarehouseProductResolver_base {
    constructor(dataSource: DataSource);
}
declare const PincodeResolver_base: any;
export declare class PincodeResolver extends PincodeResolver_base {
    constructor(dataSource: DataSource);
}
declare const PincodeGroupResolver_base: any;
export declare class PincodeGroupResolver extends PincodeGroupResolver_base {
    constructor(dataSource: DataSource);
}
export {};

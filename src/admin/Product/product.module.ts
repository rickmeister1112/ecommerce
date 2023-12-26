import { Module } from '@nestjs/common';
import {TaxSlabAdminResolver, CategoryResolver, SubCategoryResolver, SSubCategoryResolver, ProductResolver, WarehouseProductResolver, CollectionReferenceResolver, WarehouseIdsResolver, CollectionWarehouseProductResolver, BasePricingResolver, UserSpecificPricingResolver, PincodeGroupResolver, PincodeResolver} from './product.resolvers';

@Module({
  providers: [
    TaxSlabAdminResolver,
    CategoryResolver,
    SubCategoryResolver,
    SSubCategoryResolver,
    ProductResolver,
    WarehouseProductResolver,
    CollectionReferenceResolver,
    WarehouseIdsResolver,
    CollectionWarehouseProductResolver,
    BasePricingResolver,
    UserSpecificPricingResolver,
    PincodeGroupResolver,
    PincodeResolver
  ],
  exports:[
    TaxSlabAdminResolver,
    CategoryResolver,
    SubCategoryResolver,
    SSubCategoryResolver,
    ProductResolver,
    WarehouseProductResolver,
    CollectionReferenceResolver,
    WarehouseIdsResolver,
    CollectionWarehouseProductResolver,
    BasePricingResolver,
    UserSpecificPricingResolver,
  ]
})
export class ProductAdminModule {}

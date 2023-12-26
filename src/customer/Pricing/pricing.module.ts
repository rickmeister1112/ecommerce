import { Module } from '@nestjs/common';
import { ProductSlabsResolver} from './pricing.resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasePricing, UserSpecificPricing } from 'src/admin/Product/product.models';

@Module({
    imports: [
        TypeOrmModule.forFeature([BasePricing, UserSpecificPricing]),
    
      ],
  providers: [
    ProductSlabsResolver
  ],
  exports: [
    ProductSlabsResolver
  ]
})
export class ProductSlabModule {}

import { Module } from '@nestjs/common';
import { DefaultShippingResolver, ShippingResolver, SlotResolver } from './shipping.resolvers';

@Module({
  providers: [
    DefaultShippingResolver,
    ShippingResolver,
    SlotResolver
  ],
  exports:[
    DefaultShippingResolver,
    ShippingResolver,
    SlotResolver
  ]
})
export class ShippingAdminModule {}

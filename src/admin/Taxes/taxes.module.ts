import { Module } from '@nestjs/common';
import { TaxResolver } from './taxes.resolvers';


@Module({
  providers: [
    TaxResolver
  ],
  exports: [
    TaxResolver
  ]
})
export class TaxModule {}

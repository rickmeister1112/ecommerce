import { Module } from '@nestjs/common';
import {BannerResolver} from './banner.resolvers'
//import {  } from './products.models';

@Module({
  providers: [
    BannerResolver
  ],
  exports:[
    BannerResolver
  ]
})
export class BannerAdminModule {}

import { Module } from '@nestjs/common';
import { OrderTrackingResolver, OrderResolver, ItemResolver, PackageResolver, InvoiceResolver} from './order.resolvers';
import { BullModule } from '@nestjs/bull';
import { SalesOrderService } from './order.producer';
import { OrderProcessor } from './order.consumer';


@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'order-queue',
    }),
  ],
  providers: [
    OrderTrackingResolver,
    OrderResolver,
    ItemResolver,
    PackageResolver,
    InvoiceResolver,
    SalesOrderService,
    OrderProcessor,
    ],
  exports: [
    OrderTrackingResolver,
    OrderResolver,
    ItemResolver,
    PackageResolver,
    InvoiceResolver,
    SalesOrderService,
    OrderProcessor
  ]
})
export class OrderUserModule {}

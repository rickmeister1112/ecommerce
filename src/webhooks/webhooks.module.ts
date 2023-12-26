import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from 'src/customer/Order/order.resolvers';
import { PaymentsController } from 'src/customer/Payment/payment.resolvers';

const declarations = [
    PaymentsController,
    OrderController
];

@Module({
    imports: [
        TypeOrmModule.forFeature(declarations),
    ],
    controllers: declarations,
})
export class WebhooksModule {}
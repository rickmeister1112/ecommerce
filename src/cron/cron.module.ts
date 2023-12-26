import { Module } from '@nestjs/common';
import { CreateZohoCustomerService, SalesOrderService, TasksService, WarehouseSyncService } from './crons.resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../admin/Product/product.models';
import { Item, Order } from 'src/customer/Order/order.models';
import { Address, Business, Outlet, User } from 'src/customer/Customer/customer.models';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, Item, Address, Business, Outlet, User])
  ],
  providers: [TasksService,WarehouseSyncService,SalesOrderService,CreateZohoCustomerService]
})
export class TasksModule {}

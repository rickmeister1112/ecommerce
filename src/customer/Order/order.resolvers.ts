import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { BaseResolver } from '../utils/base.resolver';
import { DataSource, In } from 'typeorm';
import { OrderTimeline, Order, Item, Package, Invoice } from './order.models';
import { ZohoHelper } from "src/admin/utils/zoho.helper";
import { Controller, Get, Req, Res, Post, Body, HttpStatus, Inject } from '@nestjs/common';
import { SalesOrderService } from './order.producer';
import { CreateOrderResponse, OrderStatusResponse } from './order.interface';
import { OrderFlow } from './order.constant.function';



@Resolver()
export class OrderTrackingResolver extends BaseResolver(OrderTimeline) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

@Resolver(() => Item)
export class ItemResolver extends BaseResolver(Item) {
  private zohohelper = new ZohoHelper();
  constructor(private dataSource: DataSource, @Inject(SalesOrderService) private salesOrderService: SalesOrderService) {
    super(dataSource);
  }
  @Mutation(()=> Order)
  async createSalesOrder(@Args('user_id') user_id: string, @Args('address_id') address_id: string, @Args('warehouse_id') warehouse_id: string): Promise<CreateOrderResponse> { 
    await this.salesOrderService.createSalesOrderProducer(user_id, address_id, warehouse_id)
    return { status: "pending", message: "Order creation in progress" };

  }
  @Query(()=>Order)
  async orderStatus(@Args('orderId') orderId: string): Promise<OrderStatusResponse> {
    const order = await this.salesOrderService.getOrderStatus(orderId);
    return {
      status: order ? "completed" : "processing",
      order: order
    };
  }
  
}


@Resolver(() => Order)
export class OrderResolver extends BaseResolver(Order) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }


}

@Resolver()
export class PackageResolver extends BaseResolver(Package) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

}

@Resolver()
export class InvoiceResolver extends BaseResolver(Invoice) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

/* 
@TODO
change the JWT to make sure the input are address_id , warehouse_id ,user_id , is_active and other mentioned in the whatsaap
how to maintain sanity using webhook
*/


@Controller('order')
export class OrderController {
  constructor(
    private dataSource: DataSource,
  ) { }

  @Get("ping")
  async ping(@Req() req: Request, @Res() res) {
    res.status(200).json({ msg: "Ping successful" });
  }

  @Post('salesOrderInfo')
  async salesOrderInformation(@Body() body: any, @Res() response) {
    try {
       console.log(">>>>>>>>>>",JSON.stringify(body.salesorder));
      const orderData = {
        salesOrderId: body.salesorder.salesorder_id,
        salesOrderNumber: body.salesorder.salesorder_number,
        salesOrder_paid_status: body.salesorder.paid_status,
        salesOrder_order_status: body.salesorder.order_status,
        salesOrder_invoiced_status: body.salesorder.invoiced_status,
        salesOrder_shipped_status: body.salesorder.shipped_status,
        salesOrder_status: body.salesorder.status,
        salesOder_line_items: body.salesorder.line_items,
        salesOrder_package: body.salesorder.packages
      };
      const newOrderResolver = new OrderFlow(this.dataSource)
      const updatedOrder = await newOrderResolver.updateOrder(orderData);
      if(updatedOrder)
      return response.status(HttpStatus.OK).json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  }

  @Post("invoice")
  async invoiceHistory(@Body() body: any, @Res() res) {
    console.log(">>>>>>>>>> invoices", JSON.stringify(body.invoice))
    res.send({ msg: 200 })
  }
}
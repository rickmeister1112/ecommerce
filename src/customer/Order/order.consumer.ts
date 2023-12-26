import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WarehouseProduct, Product } from 'src/admin/Product/product.models';
import {  EntityManager, In } from 'typeorm';
import { Cart, CartInlineItem } from '../Cart/cart.users.models';
import { Order, Item } from './order.models';

@Processor('order-queue')
export class OrderProcessor {
  constructor(private readonly entityManager: EntityManager) {
  }

  @Process()
  async handleOrder(job: Job) {
    //console.log("the job function",job);
    const { user_id, address_id, warehouse_id } = job.data;
     console.log(job);

    try{
        let cart = await this.entityManager.getRepository(Cart).findOne(
            {
              where: { customer_id: user_id, address_id: address_id, warehouse_id: warehouse_id },
              relations: ['items', 'items.productWarehouse', 'items.productWarehouse.product']
            });
          if (!cart) {
            throw new Error('Cart not found');
          }
          // find the  warehousae-products
          const productWarehouseIds = cart.items.map(item => item.productWarehouse.id);
          // find the product
          const productids = cart.items.map(item => item.productWarehouse.product_id);
          // Start a transaction
          return await this.entityManager.transaction(async (entityManager) => {
            // Create a new Order
            const lineItemsForOrder = [];
            const order = new Order();
            order.user_id = cart.customer_id;
            order.address_id = cart.address_id;
            order.total_amount = cart.total;
            order.zoho_contact_id = cart.zoho_contact_id;
            const savedOrder = await entityManager.save(Order, order);
      
            // Fetch WarehouseProduct entities based on productWarehouseIds
            const warehouseProducts = await entityManager.find(WarehouseProduct, {
              where: { id: In(productWarehouseIds) }
            });
            const products = await entityManager.find(Product, {
              where: { id: In(productids) }
            });
            // Create Items from cart inline items and link to the new Order
            for (const inlineItem of cart.items) {
              // Find the corresponding warehouse product
                const warehouseProduct = warehouseProducts.find(wp => wp.id === inlineItem.productWarehouse.id);
                const product = products.find(wp =>wp.id === inlineItem.productWarehouse.product_id);
              // Check if warehouse has sufficient quantity
              if (inlineItem.productWarehouse.is_never_out_of_stock || (inlineItem.productWarehouse.quantity >= inlineItem.quantity)) {
                const item = new Item();
                item.final_price = inlineItem.final_price;
                item.quantity = inlineItem.quantity;
                item.warehouse_id = inlineItem.warehouse_id;
                item.product_warehouse_id = inlineItem.productWarehouse.id
                item.order_id = savedOrder.id;
                item.item_id_zoho= inlineItem.item_id_zoho;
                await entityManager.save(Item, item);
      
                 if (!inlineItem.productWarehouse.is_never_out_of_stock) {
                  warehouseProduct.quantity -= inlineItem.quantity;
                  product.quantity -= inlineItem.quantity;
                  await entityManager.save(WarehouseProduct,warehouseProduct);
                  await entityManager.save(Product,product);
                }
      
                // NOTE: what is to be done about the quantity of the products which will never go out of stock( a question to ankit )
              }
              // remove cartItem
              await entityManager.remove(CartInlineItem, inlineItem);
            }
            // remove cart
            await entityManager.remove(Cart, cart);
            // save the order and return the data
            //console.log(savedOrder);
            //return savedOrder;
            const result = { status: 'success', orderId: savedOrder.id, message: 'Order processed successfully' };
            return result;
          });
    }
    catch(error)
    {
        const errorResult = { status: 'error', error: error.message };
        return errorResult;
    }

  }
}

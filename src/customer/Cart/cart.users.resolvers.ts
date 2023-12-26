import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseResolver } from '../utils/base.resolver';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Cart, CartInlineItem, TaxBreakUp } from './cart.users.models';
import { InjectRepository } from '@nestjs/typeorm';
import { Outlet } from '../Customer/customer.models';



@Resolver()
export class CartResolver {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartInlineItem)
    private cartInlineRepo: Repository<CartInlineItem>,
    @InjectRepository(TaxBreakUp)
    private taxRepo: Repository<TaxBreakUp>,
    @InjectRepository(Outlet)
    private outletRepo: Repository<Outlet>,
    private readonly manager: EntityManager) {
  }



  @Mutation(() => Cart)
  async addCart(
    @Args('row') input: Cart
  ): Promise<Cart> {
    // Check if the cart for the outlet exists
    let cart = await this.cartRepo.findOne({ where: { outlet_id: input.outlet_id } });
    if (cart) {
      const cartInlineItems = await this.cartInlineRepo.find({ where: { cart_id: cart.id } });
      const cartInlineItemMap = new Map(cartInlineItems.map(item => [item.warehouse_id, item]));

      for (const itemInput of input.items) {
        let cartInlineItem = cartInlineItemMap.get(itemInput.warehouse_id);

        if (!cartInlineItem) {
          // Its a new item
          cartInlineItem = new CartInlineItem();
        }
        Object.assign(cartInlineItem, itemInput);
        cartInlineItem.cart_id = cart.id;
        cartInlineItemMap.set(itemInput.warehouse_id, cartInlineItem);
      }

      // Persist any changes
      for (const [_, cartInlineItem] of cartInlineItemMap) {
        await this.cartInlineRepo.save(cartInlineItem);
      }
    } else {
      cart = new Cart();
      Object.assign(cart, input);
      // Save the Cart instance and get the saved data with ID
      cart = await this.cartRepo.save(cart);

      // Iterate over input items, create CartInlineItem instances, and save them
      for (const itemInput of input.items) {
        const cartInlineItem = new CartInlineItem();
        Object.assign(cartInlineItem, itemInput);
        // Set cart_id and cart relationship
        cartInlineItem.cart_id = cart.id;
        await this.cartInlineRepo.save(cartInlineItem);
      }
    }

    const updatedItems = await this.cartInlineRepo.find({
      where: { cart_id: cart.id }
    });
    let total = 0;
    updatedItems.map(item => total += item.final_price * item.quantity);
    cart.total = total;
    await this.cartRepo.save(cart);
    cart.items = updatedItems;
    return cart;
  }

  @Mutation(() => Boolean)
  async deleteCart(
    @Args("id") cartId: string,
    @Args("productWarehouseId") productWarehouseId: string
  ): Promise<boolean> {
    await this.manager.transaction(async transactionalEntityManager => {
      // First delete CartInlineItem(s)
      await transactionalEntityManager.delete(CartInlineItem, {
        cart: { id: cartId },
        productWarehouse: { id: productWarehouseId },
      });

      // Then delete the Cart
      // await transactionalEntityManager.delete(Cart, { id: cartId });
    });

    return true; // Transaction succeeded
  }

  @Mutation(() => Boolean)
  async deleteItemCart(@Args("id") cartId: string): Promise<boolean> {
    await this.manager.transaction(async transactionalEntityManager => {
      // First delete CartInlineItem(s)
      await transactionalEntityManager.delete(CartInlineItem, {
        cart: { id: cartId },
      });

      await transactionalEntityManager.delete(Cart, { id: cartId });
    });

    return true; // Transaction succeeded
  }

  @Query(() => Cart)
  async getCart(@Args('id') id: string): Promise<Cart> { // Assuming UUID is a type of string
    // Find one cart by ID
    let checkIfCart = await this.cartRepo.findOne({ where: { id } });
    if (!checkIfCart) {
      throw new Error('The cart does not exist.');
    }

    // Find CartInlineItems related to the cart
    let cartInlineItems = await this.cartInlineRepo.find({ where: { cart: { id } } });
    if (!cartInlineItems || cartInlineItems.length === 0) {
      throw new Error('The cart items do not exist.');
    }

    // Assuming you want to return the cart with the inline items
    checkIfCart.items = cartInlineItems; // This assumes your Cart entity has a field to hold items
    return checkIfCart;
  }

  @Query(() => Cart)
  async getCartByUser(
    @Args('customerId') customerId: string,
    @Args('outletId') outletId: string
  ): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: {
        customer_id: customerId,
        outlet_id: outletId
      },
      relations: ['customer', 'items'], // Assuming you want to load items and customer details
    });

    if (!cart) {
      throw new Error('The cart does not exist.');
    }

    // Find CartInlineItems related to the cart
    let cartInlineItems = await this.cartInlineRepo.find({ where: { cart: { id: cart.id } } });
    if (!cartInlineItems || cartInlineItems.length === 0) {
      throw new Error('The cart items do not exist.');
    }

    // Assuming you want to return the cart with the inline items
    cart.items = cartInlineItems; // This assumes your Cart entity has a field to hold items

    return cart;
  }
}

@Resolver()
export class CartInlineItemResolver extends BaseResolver(CartInlineItem) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

@Resolver()
export class TaxBreakUpResolver extends BaseResolver(TaxBreakUp) {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }
}

/* 
@TODO
1.) change and compute the cart logic
2.) add the basic code to the base controller */
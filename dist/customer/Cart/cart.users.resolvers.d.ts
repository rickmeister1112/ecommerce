import { DataSource, EntityManager, Repository } from 'typeorm';
import { Cart, CartInlineItem, TaxBreakUp } from './cart.users.models';
import { Outlet } from '../Customer/customer.models';
export declare class CartResolver {
    private cartRepo;
    private cartInlineRepo;
    private taxRepo;
    private outletRepo;
    private readonly manager;
    constructor(cartRepo: Repository<Cart>, cartInlineRepo: Repository<CartInlineItem>, taxRepo: Repository<TaxBreakUp>, outletRepo: Repository<Outlet>, manager: EntityManager);
    addCart(input: Cart): Promise<Cart>;
    deleteCart(cartId: string, productWarehouseId: string): Promise<boolean>;
    deleteItemCart(cartId: string): Promise<boolean>;
    getCart(id: string): Promise<Cart>;
    getCartByUser(customerId: string, outletId: string): Promise<Cart>;
}
declare const CartInlineItemResolver_base: any;
export declare class CartInlineItemResolver extends CartInlineItemResolver_base {
    constructor(dataSource: DataSource);
}
declare const TaxBreakUpResolver_base: any;
export declare class TaxBreakUpResolver extends TaxBreakUpResolver_base {
    constructor(dataSource: DataSource);
}
export {};

import { ZohoContact } from "src/admin/utils/zoho.helper";
import { Repository } from "typeorm";
import { Product } from "../admin/Product/product.models";
import { Item, Order } from "src/customer/Order/order.models";
import { Address, Business, Outlet, User } from "src/customer/Customer/customer.models";
export declare class TasksService {
    private productRepository;
    private readonly logger;
    private zohohelper;
    constructor(productRepository: Repository<Product>);
    handleCronJob(): Promise<void>;
}
export declare class WarehouseSyncService {
    private readonly logger;
    private zohoHelper;
    constructor();
}
export declare class SalesOrderService {
    private orderRepository;
    private itemRepository;
    private readonly logger;
    private zohoHelper;
    constructor(orderRepository: Repository<Order>, itemRepository: Repository<Item>);
    createSalesOrdersInZoho(): Promise<void>;
    private constructLineItem;
    private updateOrderWithZohoInfo;
    private incrementZohoCreationAttempts;
}
export declare class CreateZohoCustomerService {
    private orderRepository;
    private itemRepository;
    private addressRepository;
    private businessRepository;
    private userRepository;
    private outletRepository;
    private readonly logger;
    private zohoHelper;
    constructor(orderRepository: Repository<Order>, itemRepository: Repository<Item>, addressRepository: Repository<Address>, businessRepository: Repository<Business>, userRepository: Repository<User>, outletRepository: Repository<Outlet>);
    createZohoCOntact(): Promise<void>;
    mapOutletToZohoContact(outlet: Outlet, shippingAddress: Address, billingAddress: Address, businessDetails: Business, userDetails: User): Promise<ZohoContact>;
}

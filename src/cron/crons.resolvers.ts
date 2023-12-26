import { Injectable, Logger } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { ZohoContact, ZohoHelper } from "src/admin/utils/zoho.helper";
import { Repository } from "typeorm";
import { Product, Warehouse } from "../admin/Product/product.models";
import { Item, Order } from "src/customer/Order/order.models";
import { Address, Business, Outlet, User } from "src/customer/Customer/customer.models";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    private zohohelper = new ZohoHelper();  // Create an instance of ZohoHelper here

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    @Cron('45 * * * * *')
    async handleCronJob() {
        this.logger.debug('Called when the current second is 45');

        try {
            const unsyncedProducts = await this.productRepository.find({ where: { is_synced: 0 } });
            this.logger.debug(`Found ${unsyncedProducts.length} unsynced products`);
            const syncPromises = unsyncedProducts.map(async product => {

                const item = {
                    name: product.product_name,
                    unit: product.unit,
                    item_type: 'inventory',
                    sku: product.sku_number,
                    hsn_or_sac: product.hsn_or_sac,
                    item_tax_preferences: [
                        {
                            tax_id: product.zoho_inter_state_tax_id,
                            tax_specification: 'inter'
                        },
                        {
                            tax_id: product.zoho_intra_state_tax_id,
                            tax_specification: 'intra'
                        }
                    ]
                };
                const itemDetails = await this.zohohelper.postInventoryItem(item);
                console.log("line no 37", itemDetails);
                console.log(itemDetails.data, itemDetails.data.item.item_id);
                product.item_id_zoho = itemDetails.data.item.item_id
                product.is_synced = 1;
                await this.productRepository.save(product);
            });

            // Wait for all syncPromises to complete
            await Promise.all(syncPromises);
        } catch (error) {
            console.log(error);
            this.logger.error(`Error syncing products: ${error.message}`);
        }
    }
}


@Injectable()
export class WarehouseSyncService {
    private readonly logger = new Logger(WarehouseSyncService.name);
    private zohoHelper = new ZohoHelper();
    constructor() {
        console.log('WarehouseSyncService Initiated!');
    }

    //     @Cron('30 * * * * *')
    //     async handleWarehouseSyncCronJob() {
    //         this.logger.debug('Syncing Warehouse Items Details');

    //         const itemIDs = ['1287001000000113004', '1287001000000029002', '1287001000000016672']; // You can fetch these dynamically if needed
    //         const organizationID = '60020954918'; // This can be dynamic too

    //         try {
    //             const itemsDetails = await this.zohoHelper.getItemDetailsAtWarehouseLevel(organizationID, itemIDs);
    //             this.logger.debug(`Successfully fetched details for ${itemsDetails.length} items.`);

    //             // Handle the itemsDetails as needed. Maybe save to database, or further processing.

    //         } catch (error) {
    //             this.logger.error(`Error syncing warehouse items details: ${error.message}`);
    //         }
    //     }
}

@Injectable()
export class SalesOrderService {
    private readonly logger = new Logger(SalesOrderService.name);
    private zohoHelper = new ZohoHelper();

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) { }
    @Cron('45 * * * * *')
    async createSalesOrdersInZoho() {
        try {
            console.log("the process for creation of sales order begin");
            const orders = await this.orderRepository.find({
                where: { is_zoho_created: 0 },
                relations: ['warehouse']
            });
            for (const order of orders) {
                const items = await this.itemRepository.find({
                    where: { order_id: order.id }
                });
                const findLastSalesOrder = await this.orderRepository.find({
                    where:{
                        is_zoho_created:1
                    },
                    order: {
                        created_at: "DESC"
                    },
                    take: 1
                });
                console.log(findLastSalesOrder);
                const lineItemsForOrder = items.map(item => this.constructLineItem(item, order));
                const salesOrderResponse = await this.zohoHelper.createSalesOrder(lineItemsForOrder, findLastSalesOrder, order.zoho_contact_id);
                console.log('Sales Order Created in Zoho Inventory:', salesOrderResponse);

                if (salesOrderResponse && salesOrderResponse.salesorder && salesOrderResponse.code == 0) {
                    await this.updateOrderWithZohoInfo(order, salesOrderResponse.salesorder);
                }

                await this.incrementZohoCreationAttempts(order);
            }
        } catch (error) {
            console.log(">>>>>>>>>>>>>>>>>>>>>",error);
            this.logger.error('Error creating sales orders in Zoho', error);
        }
    }

    private constructLineItem(item: Item, order: Order) {
        return {
            item_id: item.item_id_zoho,
            name: item.product_warehouse_name,
            description: item.product_warehouse_description,
            rate: item.final_price,
            quantity: item.quantity,
            unit: item.unit,
            tax_name: "sales tax",
            tax_type: "tax",
            tax_percentage: 12,
            item_total: item.total_price,
            warehouse_id: order.warehouse.zoho_warehouse_id
        };
    }

    private async updateOrderWithZohoInfo(order: Order, zohoSalesOrder: any) {
        order.zoho_salesorder_id = zohoSalesOrder.salesorder_id;
        order.zoho_salesorder_number = zohoSalesOrder.salesorder_number;
        order.zoho_status = zohoSalesOrder.status;
        order.is_zoho_created = 1;
        await this.orderRepository.save(order);
    }

    private async incrementZohoCreationAttempts(order: Order) {
        order.attempts_to_create_on_zoho += 1;
        await this.orderRepository.save(order);
    }
}


@Injectable()
export class CreateZohoCustomerService {
    private readonly logger = new Logger(CreateZohoCustomerService.name);
    private zohoHelper = new ZohoHelper();
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
        @InjectRepository(Business)
        private businessRepository: Repository<Business>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Outlet)
        private outletRepository: Repository<Outlet>
    ) {
        console.log('createZohoCustomer Initiated!');
    }
    @Cron('45 * * * * *')
    async createZohoCOntact() {
        try {
            const outletsToProcess = await this.outletRepository.find({
                where: { is_zoho_created: 0 }
            });
            console.log("the outlet",outletsToProcess);
            for (const outlet of outletsToProcess) {
                // Fetch related addresses
                const shippingAddress = await this.addressRepository.findOne({ where: { id: outlet.shipping_address_id } });
                console.log("line number 69", shippingAddress);
                const billingAddress = await this.addressRepository.findOne({ where: { id: outlet.billing_address_id } });
                console.log("line number 71", billingAddress);
                const businessDetails = await this.businessRepository.findOne({ where: { id: outlet.business_id } });
                console.log("line number 87", businessDetails);
                const userDetails = await this.userRepository.findOne({ where: { id: businessDetails.user_id } });
                console.log("line number 89", userDetails);

                // Map outlet data to Zoho contact format
                const zohoContactData = await this.mapOutletToZohoContact(outlet, shippingAddress, billingAddress, businessDetails, userDetails);
                // Send data to Zoho
                const zohoHelper = new ZohoHelper();
                const zohoData = await zohoHelper.createZohoContact(zohoContactData);
                console.log(zohoData.contact.contact_id);
                if (zohoData.contact.contact_id)
                    outlet.zoho_contact_id = zohoData.contact.contact_id;
                    outlet.is_zoho_created = 1
                    outlet.attempts_to_create_on_zoho += 1;
                await this.outletRepository.save(outlet);
            }
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Duplicate value');
            }
            throw error;
        }
    }
    async mapOutletToZohoContact(outlet: Outlet, shippingAddress: Address, billingAddress: Address, businessDetails: Business, userDetails: User): Promise<ZohoContact> {

        // Address mapping
        const mapAddress = (address: Address) => {
            return {
                street: `${address.address_line1} ${address.address_line2}`,
                city: address.city,
                state: address.state,
                zip: address.postalcode,
                country: address.country,
            };
        };

        const mapDetails = (userDetails: User) => {
            return {
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                email: userDetails.email,
                phone: userDetails.mobile,
                is_primary_contact: true
            }
        }

        return {
            contact_name: outlet.outlet_name,
            company_name: businessDetails.business_name,
            payment_terms: 0, // kitne din me payment settle hogi
            website: businessDetails.business_website,
            contact_type: "customer",
            billing_address: mapAddress(billingAddress),
            shipping_address: mapAddress(shippingAddress),
            contact_persons: [mapDetails(userDetails)],
            language_code: "en",
            is_taxable: true,
            gst_no: userDetails.gst_no,
            gst_treatment: userDetails.gst_treatment
        };
    }
}

/* 
@TODO
1.) create outlet
2.) create sales order */
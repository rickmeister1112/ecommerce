"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TasksService_1, WarehouseSyncService_1, SalesOrderService_1, CreateZohoCustomerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateZohoCustomerService = exports.SalesOrderService = exports.WarehouseSyncService = exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const zoho_helper_1 = require("../admin/utils/zoho.helper");
const typeorm_2 = require("typeorm");
const product_models_1 = require("../admin/Product/product.models");
const order_models_1 = require("../customer/Order/order.models");
const customer_models_1 = require("../customer/Customer/customer.models");
let TasksService = TasksService_1 = class TasksService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.logger = new common_1.Logger(TasksService_1.name);
        this.zohohelper = new zoho_helper_1.ZohoHelper();
    }
    async handleCronJob() {
        this.logger.debug('Called when the current second is 45');
        try {
            const unsyncedProducts = await this.productRepository.find({ where: { is_synced: 0 } });
            this.logger.debug(`Found ${unsyncedProducts.length} unsynced products`);
            const syncPromises = unsyncedProducts.map(async (product) => {
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
                product.item_id_zoho = itemDetails.data.item.item_id;
                product.is_synced = 1;
                await this.productRepository.save(product);
            });
            await Promise.all(syncPromises);
        }
        catch (error) {
            console.log(error);
            this.logger.error(`Error syncing products: ${error.message}`);
        }
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)('45 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "handleCronJob", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_models_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
let WarehouseSyncService = WarehouseSyncService_1 = class WarehouseSyncService {
    constructor() {
        this.logger = new common_1.Logger(WarehouseSyncService_1.name);
        this.zohoHelper = new zoho_helper_1.ZohoHelper();
        console.log('WarehouseSyncService Initiated!');
    }
};
exports.WarehouseSyncService = WarehouseSyncService;
exports.WarehouseSyncService = WarehouseSyncService = WarehouseSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WarehouseSyncService);
let SalesOrderService = SalesOrderService_1 = class SalesOrderService {
    constructor(orderRepository, itemRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.logger = new common_1.Logger(SalesOrderService_1.name);
        this.zohoHelper = new zoho_helper_1.ZohoHelper();
    }
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
                    where: {
                        is_zoho_created: 1
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
        }
        catch (error) {
            console.log(">>>>>>>>>>>>>>>>>>>>>", error);
            this.logger.error('Error creating sales orders in Zoho', error);
        }
    }
    constructLineItem(item, order) {
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
    async updateOrderWithZohoInfo(order, zohoSalesOrder) {
        order.zoho_salesorder_id = zohoSalesOrder.salesorder_id;
        order.zoho_salesorder_number = zohoSalesOrder.salesorder_number;
        order.zoho_status = zohoSalesOrder.status;
        order.is_zoho_created = 1;
        await this.orderRepository.save(order);
    }
    async incrementZohoCreationAttempts(order) {
        order.attempts_to_create_on_zoho += 1;
        await this.orderRepository.save(order);
    }
};
exports.SalesOrderService = SalesOrderService;
__decorate([
    (0, schedule_1.Cron)('45 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesOrderService.prototype, "createSalesOrdersInZoho", null);
exports.SalesOrderService = SalesOrderService = SalesOrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_models_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_models_1.Item)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SalesOrderService);
let CreateZohoCustomerService = CreateZohoCustomerService_1 = class CreateZohoCustomerService {
    constructor(orderRepository, itemRepository, addressRepository, businessRepository, userRepository, outletRepository) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.addressRepository = addressRepository;
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.outletRepository = outletRepository;
        this.logger = new common_1.Logger(CreateZohoCustomerService_1.name);
        this.zohoHelper = new zoho_helper_1.ZohoHelper();
        console.log('createZohoCustomer Initiated!');
    }
    async createZohoCOntact() {
        try {
            const outletsToProcess = await this.outletRepository.find({
                where: { is_zoho_created: 0 }
            });
            console.log("the outlet", outletsToProcess);
            for (const outlet of outletsToProcess) {
                const shippingAddress = await this.addressRepository.findOne({ where: { id: outlet.shipping_address_id } });
                console.log("line number 69", shippingAddress);
                const billingAddress = await this.addressRepository.findOne({ where: { id: outlet.billing_address_id } });
                console.log("line number 71", billingAddress);
                const businessDetails = await this.businessRepository.findOne({ where: { id: outlet.business_id } });
                console.log("line number 87", businessDetails);
                const userDetails = await this.userRepository.findOne({ where: { id: businessDetails.user_id } });
                console.log("line number 89", userDetails);
                const zohoContactData = await this.mapOutletToZohoContact(outlet, shippingAddress, billingAddress, businessDetails, userDetails);
                const zohoHelper = new zoho_helper_1.ZohoHelper();
                const zohoData = await zohoHelper.createZohoContact(zohoContactData);
                console.log(zohoData.contact.contact_id);
                if (zohoData.contact.contact_id)
                    outlet.zoho_contact_id = zohoData.contact.contact_id;
                outlet.is_zoho_created = 1;
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
    async mapOutletToZohoContact(outlet, shippingAddress, billingAddress, businessDetails, userDetails) {
        const mapAddress = (address) => {
            return {
                street: `${address.address_line1} ${address.address_line2}`,
                city: address.city,
                state: address.state,
                zip: address.postalcode,
                country: address.country,
            };
        };
        const mapDetails = (userDetails) => {
            return {
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                email: userDetails.email,
                phone: userDetails.mobile,
                is_primary_contact: true
            };
        };
        return {
            contact_name: outlet.outlet_name,
            company_name: businessDetails.business_name,
            payment_terms: 0,
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
};
exports.CreateZohoCustomerService = CreateZohoCustomerService;
__decorate([
    (0, schedule_1.Cron)('45 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreateZohoCustomerService.prototype, "createZohoCOntact", null);
exports.CreateZohoCustomerService = CreateZohoCustomerService = CreateZohoCustomerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_models_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_models_1.Item)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_models_1.Address)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_models_1.Business)),
    __param(4, (0, typeorm_1.InjectRepository)(customer_models_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(customer_models_1.Outlet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CreateZohoCustomerService);
//# sourceMappingURL=crons.resolvers.js.map
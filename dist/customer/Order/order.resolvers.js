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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = exports.InvoiceResolver = exports.PackageResolver = exports.OrderResolver = exports.ItemResolver = exports.OrderTrackingResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_resolver_1 = require("../utils/base.resolver");
const typeorm_1 = require("typeorm");
const order_models_1 = require("./order.models");
const zoho_helper_1 = require("../../admin/utils/zoho.helper");
const common_1 = require("@nestjs/common");
const order_producer_1 = require("./order.producer");
const order_constant_function_1 = require("./order.constant.function");
let OrderTrackingResolver = class OrderTrackingResolver extends (0, base_resolver_1.BaseResolver)(order_models_1.OrderTimeline) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.OrderTrackingResolver = OrderTrackingResolver;
exports.OrderTrackingResolver = OrderTrackingResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderTrackingResolver);
let ItemResolver = class ItemResolver extends (0, base_resolver_1.BaseResolver)(order_models_1.Item) {
    constructor(dataSource, salesOrderService) {
        super(dataSource);
        this.dataSource = dataSource;
        this.salesOrderService = salesOrderService;
        this.zohohelper = new zoho_helper_1.ZohoHelper();
    }
    async createSalesOrder(user_id, address_id, warehouse_id) {
        await this.salesOrderService.createSalesOrderProducer(user_id, address_id, warehouse_id);
        return { status: "pending", message: "Order creation in progress" };
    }
    async orderStatus(orderId) {
        const order = await this.salesOrderService.getOrderStatus(orderId);
        return {
            status: order ? "completed" : "processing",
            order: order
        };
    }
};
exports.ItemResolver = ItemResolver;
__decorate([
    (0, graphql_1.Mutation)(() => order_models_1.Order),
    __param(0, (0, graphql_1.Args)('user_id')),
    __param(1, (0, graphql_1.Args)('address_id')),
    __param(2, (0, graphql_1.Args)('warehouse_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "createSalesOrder", null);
__decorate([
    (0, graphql_1.Query)(() => order_models_1.Order),
    __param(0, (0, graphql_1.Args)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "orderStatus", null);
exports.ItemResolver = ItemResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_models_1.Item),
    __param(1, (0, common_1.Inject)(order_producer_1.SalesOrderService)),
    __metadata("design:paramtypes", [typeorm_1.DataSource, order_producer_1.SalesOrderService])
], ItemResolver);
let OrderResolver = class OrderResolver extends (0, base_resolver_1.BaseResolver)(order_models_1.Order) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.OrderResolver = OrderResolver;
exports.OrderResolver = OrderResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_models_1.Order),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderResolver);
let PackageResolver = class PackageResolver extends (0, base_resolver_1.BaseResolver)(order_models_1.Package) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.PackageResolver = PackageResolver;
exports.PackageResolver = PackageResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PackageResolver);
let InvoiceResolver = class InvoiceResolver extends (0, base_resolver_1.BaseResolver)(order_models_1.Invoice) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.InvoiceResolver = InvoiceResolver;
exports.InvoiceResolver = InvoiceResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], InvoiceResolver);
let OrderController = class OrderController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async ping(req, res) {
        res.status(200).json({ msg: "Ping successful" });
    }
    async salesOrderInformation(body, response) {
        try {
            console.log(">>>>>>>>>>", JSON.stringify(body.salesorder));
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
            const newOrderResolver = new order_constant_function_1.OrderFlow(this.dataSource);
            const updatedOrder = await newOrderResolver.updateOrder(orderData);
            if (updatedOrder)
                return response.status(common_1.HttpStatus.OK).json({ message: 'Order updated successfully', updatedOrder });
        }
        catch (error) {
            console.error(error);
            return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }
    async invoiceHistory(body, res) {
        console.log(">>>>>>>>>> invoices", JSON.stringify(body.invoice));
        res.send({ msg: 200 });
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)("ping"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)('salesOrderInfo'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "salesOrderInformation", null);
__decorate([
    (0, common_1.Post)("invoice"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "invoiceHistory", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderController);
//# sourceMappingURL=order.resolvers.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const crons_resolvers_1 = require("./crons.resolvers");
const typeorm_1 = require("@nestjs/typeorm");
const product_models_1 = require("../admin/Product/product.models");
const order_models_1 = require("../customer/Order/order.models");
const customer_models_1 = require("../customer/Customer/customer.models");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([product_models_1.Product, order_models_1.Order, order_models_1.Item, customer_models_1.Address, customer_models_1.Business, customer_models_1.Outlet, customer_models_1.User])
        ],
        providers: [crons_resolvers_1.TasksService, crons_resolvers_1.WarehouseSyncService, crons_resolvers_1.SalesOrderService, crons_resolvers_1.CreateZohoCustomerService]
    })
], TasksModule);
//# sourceMappingURL=cron.module.js.map
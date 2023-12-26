"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUserModule = void 0;
const common_1 = require("@nestjs/common");
const order_resolvers_1 = require("./order.resolvers");
const bull_1 = require("@nestjs/bull");
const order_producer_1 = require("./order.producer");
const order_consumer_1 = require("./order.consumer");
let OrderUserModule = class OrderUserModule {
};
exports.OrderUserModule = OrderUserModule;
exports.OrderUserModule = OrderUserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bull_1.BullModule.forRoot({
                redis: {
                    host: 'localhost',
                    port: 6379,
                },
            }),
            bull_1.BullModule.registerQueue({
                name: 'order-queue',
            }),
        ],
        providers: [
            order_resolvers_1.OrderTrackingResolver,
            order_resolvers_1.OrderResolver,
            order_resolvers_1.ItemResolver,
            order_resolvers_1.PackageResolver,
            order_resolvers_1.InvoiceResolver,
            order_producer_1.SalesOrderService,
            order_consumer_1.OrderProcessor,
        ],
        exports: [
            order_resolvers_1.OrderTrackingResolver,
            order_resolvers_1.OrderResolver,
            order_resolvers_1.ItemResolver,
            order_resolvers_1.PackageResolver,
            order_resolvers_1.InvoiceResolver,
            order_producer_1.SalesOrderService,
            order_consumer_1.OrderProcessor
        ]
    })
], OrderUserModule);
//# sourceMappingURL=order.module.js.map
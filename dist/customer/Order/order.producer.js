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
exports.SalesOrderService = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const order_models_1 = require("./order.models");
const typeorm_1 = require("typeorm");
let SalesOrderService = class SalesOrderService {
    constructor(orderQueue, entityManager) {
        this.orderQueue = orderQueue;
        this.entityManager = entityManager;
    }
    async createSalesOrderProducer(user_id, address_id, warehouse_id) {
        const orderData = { user_id, address_id, warehouse_id };
        return await this.orderQueue.add(orderData);
    }
    async getOrderStatus(orderId) {
        const order = await this.entityManager.getRepository(order_models_1.Order).findOne({ where: { id: orderId } });
        return order || null;
    }
};
exports.SalesOrderService = SalesOrderService;
exports.SalesOrderService = SalesOrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bull_1.InjectQueue)('order-queue')),
    __metadata("design:paramtypes", [Object, typeorm_1.EntityManager])
], SalesOrderService);
//# sourceMappingURL=order.producer.js.map
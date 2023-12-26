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
exports.TaxBreakUpResolver = exports.CartInlineItemResolver = exports.CartResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const base_resolver_1 = require("../utils/base.resolver");
const typeorm_1 = require("typeorm");
const cart_users_models_1 = require("./cart.users.models");
const typeorm_2 = require("@nestjs/typeorm");
const customer_models_1 = require("../Customer/customer.models");
let CartResolver = class CartResolver {
    constructor(cartRepo, cartInlineRepo, taxRepo, outletRepo, manager) {
        this.cartRepo = cartRepo;
        this.cartInlineRepo = cartInlineRepo;
        this.taxRepo = taxRepo;
        this.outletRepo = outletRepo;
        this.manager = manager;
    }
    async addCart(input) {
        let cart = await this.cartRepo.findOne({ where: { outlet_id: input.outlet_id } });
        if (cart) {
            const cartInlineItems = await this.cartInlineRepo.find({ where: { cart_id: cart.id } });
            const cartInlineItemMap = new Map(cartInlineItems.map(item => [item.warehouse_id, item]));
            for (const itemInput of input.items) {
                let cartInlineItem = cartInlineItemMap.get(itemInput.warehouse_id);
                if (!cartInlineItem) {
                    cartInlineItem = new cart_users_models_1.CartInlineItem();
                }
                Object.assign(cartInlineItem, itemInput);
                cartInlineItem.cart_id = cart.id;
                cartInlineItemMap.set(itemInput.warehouse_id, cartInlineItem);
            }
            for (const [_, cartInlineItem] of cartInlineItemMap) {
                await this.cartInlineRepo.save(cartInlineItem);
            }
        }
        else {
            cart = new cart_users_models_1.Cart();
            Object.assign(cart, input);
            cart = await this.cartRepo.save(cart);
            for (const itemInput of input.items) {
                const cartInlineItem = new cart_users_models_1.CartInlineItem();
                Object.assign(cartInlineItem, itemInput);
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
    async deleteCart(cartId, productWarehouseId) {
        await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.delete(cart_users_models_1.CartInlineItem, {
                cart: { id: cartId },
                productWarehouse: { id: productWarehouseId },
            });
        });
        return true;
    }
    async deleteItemCart(cartId) {
        await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.delete(cart_users_models_1.CartInlineItem, {
                cart: { id: cartId },
            });
            await transactionalEntityManager.delete(cart_users_models_1.Cart, { id: cartId });
        });
        return true;
    }
    async getCart(id) {
        let checkIfCart = await this.cartRepo.findOne({ where: { id } });
        if (!checkIfCart) {
            throw new Error('The cart does not exist.');
        }
        let cartInlineItems = await this.cartInlineRepo.find({ where: { cart: { id } } });
        if (!cartInlineItems || cartInlineItems.length === 0) {
            throw new Error('The cart items do not exist.');
        }
        checkIfCart.items = cartInlineItems;
        return checkIfCart;
    }
    async getCartByUser(customerId, outletId) {
        let cart = await this.cartRepo.findOne({
            where: {
                customer_id: customerId,
                outlet_id: outletId
            },
            relations: ['customer', 'items'],
        });
        if (!cart) {
            throw new Error('The cart does not exist.');
        }
        let cartInlineItems = await this.cartInlineRepo.find({ where: { cart: { id: cart.id } } });
        if (!cartInlineItems || cartInlineItems.length === 0) {
            throw new Error('The cart items do not exist.');
        }
        cart.items = cartInlineItems;
        return cart;
    }
};
exports.CartResolver = CartResolver;
__decorate([
    (0, graphql_1.Mutation)(() => cart_users_models_1.Cart),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_users_models_1.Cart]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "addCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)("id")),
    __param(1, (0, graphql_1.Args)("productWarehouseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "deleteCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "deleteItemCart", null);
__decorate([
    (0, graphql_1.Query)(() => cart_users_models_1.Cart),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "getCart", null);
__decorate([
    (0, graphql_1.Query)(() => cart_users_models_1.Cart),
    __param(0, (0, graphql_1.Args)('customerId')),
    __param(1, (0, graphql_1.Args)('outletId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CartResolver.prototype, "getCartByUser", null);
exports.CartResolver = CartResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(0, (0, typeorm_2.InjectRepository)(cart_users_models_1.Cart)),
    __param(1, (0, typeorm_2.InjectRepository)(cart_users_models_1.CartInlineItem)),
    __param(2, (0, typeorm_2.InjectRepository)(cart_users_models_1.TaxBreakUp)),
    __param(3, (0, typeorm_2.InjectRepository)(customer_models_1.Outlet)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.EntityManager])
], CartResolver);
let CartInlineItemResolver = class CartInlineItemResolver extends (0, base_resolver_1.BaseResolver)(cart_users_models_1.CartInlineItem) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.CartInlineItemResolver = CartInlineItemResolver;
exports.CartInlineItemResolver = CartInlineItemResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CartInlineItemResolver);
let TaxBreakUpResolver = class TaxBreakUpResolver extends (0, base_resolver_1.BaseResolver)(cart_users_models_1.TaxBreakUp) {
    constructor(dataSource) {
        super(dataSource);
    }
};
exports.TaxBreakUpResolver = TaxBreakUpResolver;
exports.TaxBreakUpResolver = TaxBreakUpResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TaxBreakUpResolver);
//# sourceMappingURL=cart.users.resolvers.js.map
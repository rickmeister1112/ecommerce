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
exports.PaymentsController = exports.PostpaidTransactionsResolver = exports.PaymentTransactionHistoryResolver = exports.OrderTransactionHistoryResolver = exports.UserWalletResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const payment_models_1 = require("./payment.models");
const axios_1 = require("axios");
const jwt_1 = require("@nestjs/jwt");
const auth_resolvers_1 = require("../../admin/auth/auth.resolvers");
const order_models_1 = require("../Order/order.models");
const dayjs_1 = require("dayjs");
const conf = require("../../admin/utils/constants");
const zoho_helper_1 = require("../../admin/utils/zoho.helper");
let UserWalletResolver = class UserWalletResolver {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getVyapWallet(id) {
        try {
            const getUserWalletData = await this.dataSource.getRepository(payment_models_1.UserWallet).findOne({
                where: { user_id: (0, typeorm_1.Equal)(id) },
                relations: ['user']
            });
            if (!getUserWalletData) {
                throw new Error('Unable To Fetch User Details!');
            }
            return getUserWalletData;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.UserWalletResolver = UserWalletResolver;
__decorate([
    (0, graphql_1.Query)(() => payment_models_1.UserWallet),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserWalletResolver.prototype, "getVyapWallet", null);
exports.UserWalletResolver = UserWalletResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserWalletResolver);
let OrderTransactionHistoryResolver = class OrderTransactionHistoryResolver {
    constructor(dataSource, manager) {
        this.dataSource = dataSource;
        this.manager = manager;
    }
    async addOrderTransactionHistory(row) {
        const userWallet = await this.getUserWallet(row.user_id);
        switch (row.transactionType) {
            case 1:
                this.handleCreditTransaction(row, userWallet);
                break;
            case 2:
                this.handleDebitTransaction(row, userWallet);
                break;
            default:
                throw new Error('Invalid Transaction Type!');
        }
    }
    async getUserWallet(userId) {
        const userWallet = await this.dataSource.getRepository(payment_models_1.UserWallet).findOne({
            where: { user_id: (0, typeorm_1.Equal)(userId) },
            relations: ['user'],
        });
        if (!userWallet) {
            throw new Error('User wallet not found!');
        }
        return userWallet;
    }
    async handleCreditTransaction(row, userWallet) {
        const amount = parseFloat(row.amount.toString());
        console.log(amount);
        let cashWallet = parseFloat(userWallet.cashWallet.toString());
        console.log("before", cashWallet);
        let rewardWallet = parseFloat(userWallet.rewardWallet.toString());
        let joiningBonus = parseFloat(userWallet.joiningBonus.toString());
        let promotionalBonus = parseFloat(userWallet.promotionalBonus.toString());
        switch (row.transactionNumberReason) {
            case 1:
                cashWallet += amount;
                break;
            case 2:
                rewardWallet += amount;
                break;
            case 3:
                joiningBonus += amount;
                break;
            case 4:
                promotionalBonus += amount;
                break;
            default:
                throw new Error('Invalid Transaction Number Reason!');
        }
        userWallet.cashWallet = cashWallet;
        userWallet.rewardWallet = rewardWallet;
        userWallet.joiningBonus = joiningBonus;
        userWallet.promotionalBonus = promotionalBonus;
        console.log(cashWallet);
        await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(payment_models_1.UserWallet, userWallet);
            const paymentHistory = transactionalEntityManager.create(payment_models_1.PaymentTransactionHistory, Object.assign(Object.assign({}, row), { amount: amount }));
            await transactionalEntityManager.save(payment_models_1.PaymentTransactionHistory, paymentHistory);
        });
        return userWallet;
    }
    async handleDebitTransaction(row, userWallet) {
        const amount = parseFloat(row.amount.toString());
        console.log(amount);
        if (amount <= 0) {
            throw new Error('Invalid amount! Amount should be greater than 0.');
        }
        const rewardWalletDebitAmount = amount * 0.10;
        console.log(rewardWalletDebitAmount);
        let cashWallet = parseFloat(userWallet.cashWallet.toString());
        let rewardWallet = parseFloat(userWallet.rewardWallet.toString());
        const actualRewardWalletDebit = Math.min(rewardWallet, rewardWalletDebitAmount);
        console.log(actualRewardWalletDebit);
        const cashWalletDebitAmount = amount - actualRewardWalletDebit;
        console.log(cashWalletDebitAmount);
        if (cashWalletDebitAmount > cashWallet) {
            throw new Error('Insufficient funds!');
        }
        userWallet.rewardWallet = rewardWallet - actualRewardWalletDebit;
        userWallet.cashWallet = cashWallet - cashWalletDebitAmount;
        await this.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(payment_models_1.UserWallet, userWallet);
            const paymentHistory = transactionalEntityManager.create(payment_models_1.PaymentTransactionHistory, Object.assign({}, row));
            await transactionalEntityManager.save(payment_models_1.PaymentTransactionHistory, paymentHistory);
        });
    }
};
exports.OrderTransactionHistoryResolver = OrderTransactionHistoryResolver;
__decorate([
    (0, graphql_1.Mutation)(() => payment_models_1.OrderTransactionHistory),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderTransactionHistoryResolver.prototype, "addOrderTransactionHistory", null);
exports.OrderTransactionHistoryResolver = OrderTransactionHistoryResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.EntityManager])
], OrderTransactionHistoryResolver);
let PaymentTransactionHistoryResolver = class PaymentTransactionHistoryResolver {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async generatePaymentLink(input) {
        const { orderId, amount } = input;
        let linkData;
        try {
            const response = await axios_1.default.get(`https://api.cashfree.com/pg/links/${orderId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-version": "2022-09-01",
                    "x-client-id": "19693554cad39819369a2cab21539691",
                    "x-client-secret": "3544c8498ee5be5704a3558da3665e3a1c44bb86"
                }
            });
            linkData = response.data;
            if (linkData.link_url) {
                return linkData.link_url;
            }
        }
        catch (error) {
            console.error(error);
        }
        const postData = {
            "customer_details": {
                "customer_phone": `8112299688`
            },
            "link_notify": {
                "send_sms": true,
                "send_email": false
            },
            "link_amount": amount,
            "link_currency": "INR",
            "link_id": orderId,
            "link_purpose": `Payment of ${amount} against order number ${orderId}`
        };
        try {
            const response = await axios_1.default.post('https://api.cashfree.com/pg/links', postData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "x-api-version": "2022-09-01",
                    "x-client-id": "19693554cad39819369a2cab21539691",
                    "x-client-secret": "3544c8498ee5be5704a3558da3665e3a1c44bb86"
                }
            });
            linkData = response.data;
            if (linkData.link_url) {
                return linkData.link_url;
            }
        }
        catch (error) {
            console.error(error);
        }
        console.error(linkData);
        return linkData;
    }
    ;
};
exports.PaymentTransactionHistoryResolver = PaymentTransactionHistoryResolver;
__decorate([
    (0, graphql_1.Query)(() => payment_models_1.PaymentTransactionHistory),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentTransactionHistoryResolver.prototype, "generatePaymentLink", null);
exports.PaymentTransactionHistoryResolver = PaymentTransactionHistoryResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaymentTransactionHistoryResolver);
let PostpaidTransactionsResolver = class PostpaidTransactionsResolver {
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async getPostpaidBalance(info, context) {
        let auth = new auth_resolvers_1.AuthFunctions(this.jwtService, this.dataSource);
        let user = (await auth.getCurrentUser(context, "customer"));
        let data = await this.fetchPostpaidBalance(user);
        if (data && data.value) {
            return {
                msg: conf.messages.creditValue(data.formatted_value),
                data,
            };
        }
        switch (data.application_status) {
            case "UNDER_REVIEW":
            case "INCOMPLETE":
                return {
                    msg: conf.messages.approvedCredit("₹" + data.approved_limit),
                    data
                };
            case "REJECTED":
                return {
                    msg: conf.messages.rupifyRejected,
                    data
                };
        }
        let shareGmv = await this.shareGMVToBNPL({ customerId: user.id, phone: user.mobile });
        if (typeof shareGmv === "string")
            return {
                msg: shareGmv
            };
        let onboarding = await this.fetchPostpaidBalance(user);
        return {
            data: onboarding,
            msg: conf.messages.rupifyStatus(onboarding.status_remark),
        };
    }
    async fetchPostpaidBalance(user) {
        let data = await axios_1.default.post(conf.apis.bnplCustomerInfo(), JSON.stringify({
            merchant_customer_id: user.id, phone: user.mobile
        }), { headers: conf.rupify.authHeaders });
        console.log(data);
        let foo = data.data.eligibility;
        if (!foo.is_eligible_for_txn) {
            return foo;
        }
        return foo.account.balance;
    }
    async getGMVData(customerId) {
        let result = await this.dataSource.getRepository(order_models_1.Order).find({
            where: {
                user_id: customerId,
                created_at: (0, typeorm_1.MoreThanOrEqual)((0, dayjs_1.default)().subtract(6, "months").toDate())
            },
            order: {
                created_at: 'ASC'
            },
        });
        let monthlyGmv = {};
        for (let dat of result) {
            let date = (0, dayjs_1.default)(dat.created_at);
            let key = `${date.month() + 1}_${date.year()}`;
            if (!monthlyGmv[key]) {
                monthlyGmv[key] = {
                    month_year: key,
                    value: 0,
                    count: 0,
                };
            }
            monthlyGmv[key].count += 1;
            monthlyGmv[key].value += dat.total_amount;
        }
        return Object.values(monthlyGmv);
    }
    async getFirstOrderDate(customerId) {
        try {
            let firstOrder = await this.dataSource.getRepository(order_models_1.Order).findOne({
                where: {
                    user_id: customerId,
                },
                order: {
                    created_at: "ASC"
                }
            });
            return firstOrder.created_at;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async shareGMVToBNPL({ customerId, phone }) {
        let firstOrderDate = await this.getFirstOrderDate(customerId);
        if (!firstOrderDate) {
            return conf.messages.noFirstOrder;
        }
        else if (Date.now() - new Date(firstOrderDate).getTime() < conf.defaults.bnplQualifyDuration) {
            let qualifyDate = new Date(new Date(firstOrderDate).getTime() + conf.defaults.bnplQualifyDuration);
            return conf.messages.beforeQualify(`${qualifyDate.getDate()}/${qualifyDate.getMonth() + 1}/${qualifyDate.getFullYear()}`);
        }
        let gmv = await this.getGMVData(customerId);
        if (!(gmv && gmv.length))
            return conf.messages.noFirstOrder;
        return this.shareGMV({ customerId, phone, firstOrderDate, gmv });
    }
    async shareGMV({ customerId, phone, firstOrderDate, gmv }) {
        let data = {
            gmv_data: [{
                    merchant_customer_id: customerId,
                    phone,
                    first_transaction_date: firstOrderDate,
                    monthly_gmv: gmv,
                }],
        };
        let shareResult = await axios_1.default.post(conf.apis.bnplShareGMV(), JSON.stringify(data), { headers: conf.rupify.authHeaders });
        try {
            let foo = shareResult.data.share_gmv_response[0];
            if (foo.status == "Success" && foo.message == "User Gmv Data Created")
                return true;
        }
        catch (error) { }
        console.error("Share GMV API error", shareResult);
        return false;
    }
    async createPostpaidPayment({ amount, orderId, address, redirectUrl }, info, context) {
        let auth = new auth_resolvers_1.AuthFunctions(this.jwtService, this.dataSource);
        let user = (await auth.getCurrentUser(context, "customer"));
        address.country = "IN";
        address.type = "Office";
        let result = await axios_1.default.post(conf.apis.bnplPaymentOrder(), JSON.stringify({
            amount: Math.floor(amount),
            currency: "INR",
            customer: {
                merchant_customer_id: user.id,
                phone: user.mobile,
            },
            delivery_address: address,
            merchant_order_id: orderId,
            capture_method: "delayed",
            redirect_url: redirectUrl || undefined,
        }), { headers: conf.rupify.authHeaders });
        return result.data;
    }
    async bnplAccountStatement(info, context) {
        let auth = new auth_resolvers_1.AuthFunctions(this.jwtService, this.dataSource);
        let user = (await auth.getCurrentUser(context, "customer"));
        let result = await axios_1.default.post(conf.apis.bnplAccountStatement(), JSON.stringify({
            merchant_customer_id: user.id,
        }), { headers: conf.rupify.authHeaders });
        return result.data.statement;
    }
};
exports.PostpaidTransactionsResolver = PostpaidTransactionsResolver;
__decorate([
    (0, graphql_1.Query)("getPostpaidBalance"),
    __param(0, (0, graphql_1.Info)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostpaidTransactionsResolver.prototype, "getPostpaidBalance", null);
__decorate([
    (0, graphql_1.Mutation)("newPostpaidPayment"),
    __param(0, (0, graphql_1.Args)("input")),
    __param(1, (0, graphql_1.Info)()),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostpaidTransactionsResolver.prototype, "createPostpaidPayment", null);
__decorate([
    (0, graphql_1.Query)("getPostpaidStatement"),
    __param(0, (0, graphql_1.Info)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostpaidTransactionsResolver.prototype, "bnplAccountStatement", null);
exports.PostpaidTransactionsResolver = PostpaidTransactionsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.DataSource])
], PostpaidTransactionsResolver);
let PaymentsController = class PaymentsController {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async ping(req, res) {
        res.status(200).json({ msg: "Ping successful" });
    }
    async completePostpaidPayment(req, res) {
        let event = (await req.json()).event;
        switch (event.name) {
            case "payment.authorized":
                let payment = event.payload.payment;
                console.log("Making postpaid payment", payment.order_id, payment.amount);
                let result = await axios_1.default.post(conf.apis.bnplCompletePayment(payment.order_id), JSON.stringify({ amount: payment.amount }), { headers: conf.rupify.authHeaders });
                if (result.data.status == "completed") {
                    return true;
                }
                break;
        }
        return false;
    }
    async refund(req, res) {
        let { invoice_id, total } = (await req.json()).creditnote;
        let zoho = new zoho_helper_1.ZohoHelper();
        let invoice = await zoho.getInvoice(invoice_id);
        let { salesorder_number } = invoice;
        if (await this.refundPostpaidPayment({ orderId: salesorder_number, amount: total })) {
            return true;
        }
    }
    async refundPostpaidPayment({ orderId, amount }) {
        let payment = await this.fetchPostpaidPayments(orderId);
        if (!(payment && payment.payments && payment.payments.length))
            return null;
        payment = payment.payments[0];
        let result = await axios_1.default.post(conf.apis.bnplRefundPayment(), JSON.stringify({
            payment_id: payment.id, amount: amount * 100, currency: "INR", speed: "normal"
        }), { headers: conf.rupify.authHeaders });
        if (result.data.refund.status == "processed")
            return true;
        console.error("error in refund", JSON.stringify(result));
        return false;
    }
    async fetchPostpaidPayments(orderId) {
        let order = await this.dataSource.getRepository(payment_models_1.OrderTransactionHistory).findOne({
            where: { order_id: orderId }
        });
        if (!order)
            return null;
        let result = await axios_1.default.get(conf.apis.bnplFetchPayment(order.reference_id), { headers: conf.rupify.authHeaders });
        result.data.order = order;
        return result.data;
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)("ping"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)("capture"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Response]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "completePostpaidPayment", null);
__decorate([
    (0, common_1.Post)("refund"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Response]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refund", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('postpaid'),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaymentsController);
//# sourceMappingURL=payment.resolvers.js.map
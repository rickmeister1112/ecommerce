/// <reference types="node" />
import { GraphQLExecutionContext } from '@nestjs/graphql';
import { DataSource, EntityManager } from 'typeorm';
import { UserWallet, LinkDataResponse, PaymentLinkParams, PaymentTransactionHistoryInput } from './payment.models';
import { UUID } from 'crypto';
import { GraphQLResolveInfo } from 'graphql';
import { JwtService } from '@nestjs/jwt';
export declare class UserWalletResolver {
    private dataSource;
    constructor(dataSource: DataSource);
    getVyapWallet(id: UUID): Promise<UserWallet>;
}
export declare class OrderTransactionHistoryResolver {
    private dataSource;
    private readonly manager;
    constructor(dataSource: DataSource, manager: EntityManager);
    addOrderTransactionHistory(row: PaymentTransactionHistoryInput): Promise<void>;
    private getUserWallet;
    private handleCreditTransaction;
    private handleDebitTransaction;
}
export declare class PaymentTransactionHistoryResolver {
    private dataSource;
    constructor(dataSource: DataSource);
    generatePaymentLink(input: PaymentLinkParams): Promise<string | LinkDataResponse>;
}
export declare class PostpaidTransactionsResolver {
    private jwtService;
    private dataSource;
    constructor(jwtService: JwtService, dataSource: DataSource);
    getPostpaidBalance(info?: GraphQLResolveInfo, context?: GraphQLExecutionContext): Promise<{
        msg: string;
        data?: undefined;
    } | {
        data: any;
        msg: any;
    }>;
    private fetchPostpaidBalance;
    private getGMVData;
    private getFirstOrderDate;
    private shareGMVToBNPL;
    private shareGMV;
    createPostpaidPayment({ amount, orderId, address, redirectUrl }: {
        amount: any;
        orderId: any;
        address: any;
        redirectUrl: any;
    }, info?: GraphQLResolveInfo, context?: GraphQLExecutionContext): Promise<any>;
    bnplAccountStatement(info?: GraphQLResolveInfo, context?: GraphQLExecutionContext): Promise<any>;
}
export declare class PaymentsController {
    private dataSource;
    constructor(dataSource: DataSource);
    ping(req: Request, res: any): Promise<void>;
    completePostpaidPayment(req: Request, res: Response): Promise<boolean>;
    refund(req: Request, res: Response): Promise<boolean>;
    private refundPostpaidPayment;
    private fetchPostpaidPayments;
}

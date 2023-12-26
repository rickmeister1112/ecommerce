import { User } from '../Customer/customer.models';
import { BaseModel } from '../utils/base.model';
import { Order } from '../Order/order.models';
export declare class UserWallet extends BaseModel {
    user: User;
    user_id: string;
    cashWallet: number;
    rewardWallet: number;
    joiningBonus: number;
    promotionalBonus: number;
}
export declare class OrderTransactionHistory extends BaseModel {
    user: User;
    user_id: string;
    order: Order;
    order_id: string;
    amount: number;
    paymentMode: string;
    transactionNumber: number;
    transactionType: number;
    orderStatus: string;
    transactionMessage: string;
    transactionLink: string;
    reference_id: string;
}
export declare class PaymentTransactionHistory extends BaseModel {
    user: User;
    user_id: string;
    amount: number;
    transactionNumber: number;
    transactionId: string;
    transactionNumberReason: number;
    orderTransactionHistory: OrderTransactionHistory;
    order_transaction_history_id: string;
    transactionType: number;
    transactionMessage: string;
}
export interface PaymentLinkParams {
    orderId: string;
    amount: number;
}
export interface LinkDataResponse {
    link_url?: string;
    [key: string]: any;
}
export interface PaymentTransactionHistoryInput {
    user_id: string;
    amount: number;
    transactionNumber: number;
    transactionId: string;
    transactionNumberReason: number;
    order_transaction_history_id: string;
    transactionType: number;
    transactionMessage: string;
}

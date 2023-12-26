import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../Customer/customer.models';
import { BaseModel } from '../utils/base.model';
import { Order } from '../Order/order.models';

@Entity()
export class UserWallet extends BaseModel {
  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cashWallet: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  rewardWallet: number; // spent wallet

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  joiningBonus: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  promotionalBonus: number; // festive wallet
}

@Entity()
export class OrderTransactionHistory extends BaseModel {
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;

  @OneToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order;

  @Column({ type: "uuid" })
  order_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  amount: number;

  @Column({ type: 'text', default: '' })
  paymentMode: string;

  @Column({ type: 'smallint', default: 1, nullable: false })
  transactionNumber: number; // cashWallet:1,rewardWallet:2,joiningBonus:3,promotionalBonus:4,cash:5,rupify:6

  @Column({ type: 'smallint', default: 0, nullable: false })
  transactionType: number; // 1 for debit, 2 for credit, 3 for refund

  @Column({ type: 'smallint', default: 0 })
  orderStatus: string;

  @Column({ type: 'text', default: '', nullable: false })
  transactionMessage: string;

  @Column({ type: 'text', nullable: true })
  transactionLink: string;  // to be used for direct link payments

  @Column({ type: "text" })
  reference_id: string;
}


@Entity()
export class PaymentTransactionHistory extends BaseModel {
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: false })
  amount: number;

  @Column({ type: 'smallint', default: 1 })
  transactionNumber: number; // cashWallet:1,rewardWallet:2,joiningBonus:3,promotionalBonus:4,cash:5,rupify:6

  @Column({ type: 'text', default: '' })
  transactionId: string; // this will be the id generated in any case rupify, cashfree etc etc

  @Column({ type: 'smallint', default: 1 })
  transactionNumberReason: number; // promotional:1, rewardwork:2, festiveBonus:3 etc etc

  @OneToOne(() => OrderTransactionHistory)
  @JoinColumn({ name: "order_transaction_history_id" })
  orderTransactionHistory: OrderTransactionHistory;

  @Column({ type: 'text', nullable: true })
  order_transaction_history_id: string;

  @Column({ type: 'smallint', default: 0, nullable: false })
  transactionType: number; // 1 for debit, 2 for credit, 3 for refund

  @Column({ type: 'text', default: '', nullable: false })
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

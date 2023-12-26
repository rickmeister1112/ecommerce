import { Args, Context, GraphQLExecutionContext, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Controller, Post, Req, Res, Get} from '@nestjs/common';
import {  DataSource, EntityManager, Equal, MoreThanOrEqual} from 'typeorm';
import { UserWallet, OrderTransactionHistory, PaymentTransactionHistory, LinkDataResponse, PaymentLinkParams, PaymentTransactionHistoryInput } from './payment.models';
import { UUID } from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { GraphQLResolveInfo } from 'graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthFunctions } from 'src/admin/auth/auth.resolvers';
import { Order } from '../Order/order.models';
import dayjs from 'dayjs';
import * as conf from '../../admin/utils/constants';
import { User } from '../Customer/customer.models';
import { ZohoHelper } from 'src/admin/utils/zoho.helper';



@Resolver()
export class UserWalletResolver {
  constructor(
    private dataSource: DataSource,
  ) { }
  @Query(() => UserWallet)
  async getVyapWallet(@Args('id') id: UUID) {
    try {
      const getUserWalletData = await this.dataSource.getRepository(UserWallet).findOne({
        where: { user_id: Equal(id) },
        relations: ['user']
      });
      if (!getUserWalletData) {
        throw new Error('Unable To Fetch User Details!');
      }
      return getUserWalletData;
    } catch (error) {
      throw error;
    }
  }


}

@Resolver()
export class OrderTransactionHistoryResolver {
  constructor(
    private dataSource: DataSource,
    private readonly manager: EntityManager
  ) { }

  @Mutation(() => OrderTransactionHistory)
  async addOrderTransactionHistory(@Args('row') row: PaymentTransactionHistoryInput) {
    const userWallet = await this.getUserWallet(row.user_id);
    switch (row.transactionType) {
      case 1: // Credit
        this.handleCreditTransaction(row, userWallet);
        break;
      case 2: // Debit
        this.handleDebitTransaction(row, userWallet);
        break;
      default:
        throw new Error('Invalid Transaction Type!');
    }
  }

  private async getUserWallet(userId: string): Promise<UserWallet> {
    const userWallet = await this.dataSource.getRepository(UserWallet).findOne({
      where: { user_id: Equal(userId) },
      relations: ['user'],
    });

    if (!userWallet) {
      throw new Error('User wallet not found!');
    }

    return userWallet;
  }

  private async handleCreditTransaction(row: PaymentTransactionHistoryInput, userWallet: UserWallet) {
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

    // Convert numbers back to string
    userWallet.cashWallet = cashWallet;
    userWallet.rewardWallet = rewardWallet;
    userWallet.joiningBonus = joiningBonus;
    userWallet.promotionalBonus = promotionalBonus;

    console.log(cashWallet);

    await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(UserWallet, userWallet);
      const paymentHistory = transactionalEntityManager.create(PaymentTransactionHistory, {
        ...row,
        amount: amount
      });
      await transactionalEntityManager.save(PaymentTransactionHistory, paymentHistory);
    });
    return userWallet;
  }


  private async handleDebitTransaction(row: PaymentTransactionHistoryInput, userWallet: UserWallet) {
    // Ensure amount is greater than 0
    const amount = parseFloat(row.amount.toString());
    console.log(amount)
    if (amount <= 0) {
      throw new Error('Invalid amount! Amount should be greater than 0.');
    }

    // Determine the amount to be debited from rewardWallet, which is 10% of total amount
    const rewardWalletDebitAmount = amount * 0.10;
    console.log(rewardWalletDebitAmount)
    // Convert userWallet's rewardWallet and cashWallet to numbers
    let cashWallet = parseFloat(userWallet.cashWallet.toString());
    let rewardWallet = parseFloat(userWallet.rewardWallet.toString());

    // If rewardWallet has insufficient funds, take whatever is available
    const actualRewardWalletDebit = Math.min(rewardWallet, rewardWalletDebitAmount);
    console.log(actualRewardWalletDebit);
    // Compute the remaining amount to be debited from cashWallet
    const cashWalletDebitAmount = amount - actualRewardWalletDebit;
    console.log(cashWalletDebitAmount);
    if (cashWalletDebitAmount > cashWallet) {
      throw new Error('Insufficient funds!');
    }

    // Debit the amounts from respective wallets
    userWallet.rewardWallet = rewardWallet - actualRewardWalletDebit;
    userWallet.cashWallet = cashWallet - cashWalletDebitAmount;

    await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(UserWallet, userWallet);
      const paymentHistory = transactionalEntityManager.create(PaymentTransactionHistory, { ...row });
      await transactionalEntityManager.save(PaymentTransactionHistory, paymentHistory);
    });
  }



}


@Resolver()
export class PaymentTransactionHistoryResolver {
  constructor(
    private dataSource: DataSource,
  ) {
  }
  @Query(() => PaymentTransactionHistory)
  async generatePaymentLink(@Args('input') input: PaymentLinkParams) {
    const { orderId, amount } = input

    let linkData: LinkDataResponse;
    try {
      const response: AxiosResponse<LinkDataResponse> = await axios.get(`https://api.cashfree.com/pg/links/${orderId}`, {
        headers:
        {
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
    } catch (error) {
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
      const response: AxiosResponse<LinkDataResponse> = await axios.post('https://api.cashfree.com/pg/links', postData, {
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
    } catch (error) {
      console.error(error);
    }

    console.error(linkData);
    return linkData;
  };
}

@Resolver()
export class PostpaidTransactionsResolver {
  constructor(
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) { }

  @Query("getPostpaidBalance")
  async getPostpaidBalance(
    @Info() info?: GraphQLResolveInfo,
    @Context() context?: GraphQLExecutionContext
  ) {
    let auth = new AuthFunctions(this.jwtService, this.dataSource);
    let user = (await auth.getCurrentUser(context, "customer")) as User;

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

  private async fetchPostpaidBalance(user: User) {
    let data = await axios.post(conf.apis.bnplCustomerInfo(), JSON.stringify({
      merchant_customer_id: user.id, phone: user.mobile
    }), { headers: conf.rupify.authHeaders });
    console.log(data);

    let foo = data.data.eligibility;
    if (!foo.is_eligible_for_txn) {
      return foo;
    }

    return foo.account.balance;
  }

  /**
   * Get the GMV data of a particular customer
   * @param {*} customerId 
   */
  private async getGMVData(customerId) {
    let result = await this.dataSource.getRepository(Order).find({
      where: {
        user_id: customerId,
        created_at: MoreThanOrEqual(dayjs().subtract(6, "months").toDate())
      },
      order: {
        created_at: 'ASC'
      },
    });
    let monthlyGmv = {};
    for (let dat of result) {
      let date = dayjs(dat.created_at);
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

  /**
   * Get customer's first order date
   * @param {*} customerId 
   */
  private async getFirstOrderDate(customerId) {
    try {
      let firstOrder = await this.dataSource.getRepository(Order).findOne({
        where: {
          user_id: customerId,
        },
        order: {
          created_at: "ASC"
        }
      });
      return firstOrder.created_at;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
  * Fetch and share GMV data to BNPL
  * @param {*} param0 
  */
  private async shareGMVToBNPL({ customerId, phone }) {
    let firstOrderDate = await this.getFirstOrderDate(customerId);
    if (!firstOrderDate) {
      return conf.messages.noFirstOrder;
    } else if (Date.now() - new Date(firstOrderDate).getTime() < conf.defaults.bnplQualifyDuration) {
      let qualifyDate = new Date(new Date(firstOrderDate).getTime() + conf.defaults.bnplQualifyDuration);
      return conf.messages.beforeQualify(`${qualifyDate.getDate()}/${qualifyDate.getMonth() + 1}/${qualifyDate.getFullYear()}`);
    }
    let gmv = await this.getGMVData(customerId);
    if (!(gmv && gmv.length))
      return conf.messages.noFirstOrder;
    return this.shareGMV({ customerId, phone, firstOrderDate, gmv });
  }

  /**
  * Share GMV to BNPL
  * @param {*} param0 
  */
  private async shareGMV({ customerId, phone, firstOrderDate, gmv }) {
    let data = {
      gmv_data: [{
        merchant_customer_id: customerId,
        phone,
        first_transaction_date: firstOrderDate,
        monthly_gmv: gmv,
      }],
    };
    let shareResult = await axios.post(conf.apis.bnplShareGMV(), JSON.stringify(data), { headers: conf.rupify.authHeaders });
    try {
      let foo = shareResult.data.share_gmv_response[0];
      if (foo.status == "Success" && foo.message == "User Gmv Data Created")
        return true;
    } catch (error) { }
    console.error("Share GMV API error", shareResult);
    return false;
  }

  /**
  * Create a new postpaid payment order
  * @param {*} param0 : { amount, customerId, phone, orderId, address }. Address: { line1, city, state, pincode }
  */
  @Mutation("newPostpaidPayment")
  async createPostpaidPayment(
    @Args("input") { amount, orderId, address, redirectUrl },
    @Info() info?: GraphQLResolveInfo,
    @Context() context?: GraphQLExecutionContext,
  ) {
    let auth = new AuthFunctions(this.jwtService, this.dataSource);
    let user = (await auth.getCurrentUser(context, "customer")) as User;

    address.country = "IN";
    address.type = "Office";
    let result = await axios.post(conf.apis.bnplPaymentOrder(), JSON.stringify({
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

  /**
  * Fetch BNPL Account Statement and repayment URL
  */
  @Query("getPostpaidStatement")
  async bnplAccountStatement(
    @Info() info?: GraphQLResolveInfo,
    @Context() context?: GraphQLExecutionContext
  ) {
    let auth = new AuthFunctions(this.jwtService, this.dataSource);
    let user = (await auth.getCurrentUser(context, "customer")) as User;

    let result = await axios.post(conf.apis.bnplAccountStatement(), JSON.stringify({
      merchant_customer_id: user.id,
    }), { headers: conf.rupify.authHeaders });
    return result.data.statement;
  }
}


@Controller('postpaid')
export class PaymentsController {
  constructor(
    private dataSource: DataSource,
  ) { }

  @Get("ping")
  async ping(@Req() req: Request, @Res() res) {
    res.status(200).json({ msg: "Ping successful" });
  }

  /**
  * Capture the payment order created
  * Sample Payload:
  {
    "event": {
      "merchant_id": "m_cdfqb6uv08c6ieh2ie21",
      "name": "payment.authorized",
      "contains": [
        "payment"
      ],
      "payload": {
        "payment": {
          "id": "pay_cdfqb6uv9mc6teh2ieqg",
          "order_id": "ord_cdfqb5ev9mc6teh2ieq0",
          "merchant_order_id": "MER_ORD_0014",
          "amount": 3000,
          "currency": "INR",
          "payment_method": "upi",
          "upi": {
            "channel": "collect",
            "vpa": "success@razorpay"
          },
          "status": "success",
          "refunded_amount": 0,
          "created_at": 1667212699,
          "acquirer_reference": "284699955547",
          "capture_method": "instant"
        }
      }
    }
  }
  */
  @Post("capture")
  async completePostpaidPayment(@Req() req: Request, @Res() res: Response) {
    let event = (await req.json()).event;
    switch (event.name) {
      case "payment.authorized":
        let payment = event.payload.payment;
        console.log("Making postpaid payment", payment.order_id, payment.amount);
        let result = await axios.post(conf.apis.bnplCompletePayment(payment.order_id), JSON.stringify({ amount: payment.amount }), { headers: conf.rupify.authHeaders });
        if (result.data.status == "completed") {
          return true;
        }
        break;
    }
    return false;
  }

  /**
   * Refund the payment on some condition initiated from zoho inventory
   * @param req 
   * @param res 
   */
  @Post("refund")
  async refund(@Req() req: Request, @Res() res: Response) {
    let { invoice_id, total } = (await req.json()).creditnote;
    let zoho = new ZohoHelper();
    let invoice = await zoho.getInvoice(invoice_id);
    let { salesorder_number } = invoice;
    if (await this.refundPostpaidPayment({ orderId: salesorder_number, amount: total })) {
      return true;
    }
  }

  /**
  * Refund payment for an
  * @param {*} orderId 
  */
  private async refundPostpaidPayment({ orderId, amount }) {
    let payment = await this.fetchPostpaidPayments(orderId);
    if (!(payment && payment.payments && payment.payments.length))
      return null;
    payment = payment.payments[0];
    let result = await axios.post(conf.apis.bnplRefundPayment(), JSON.stringify({
      payment_id: payment.id, amount: amount * 100, currency: "INR", speed: "normal"
    }), { headers: conf.rupify.authHeaders });
    if (result.data.refund.status == "processed")
      return true;
    console.error("error in refund", JSON.stringify(result));
    return false;
  }


  /**
  * Fetch the payments made for an order using postpaid
  * @param {*} orderId 
  */
  private async fetchPostpaidPayments(orderId) {
    let order = await this.dataSource.getRepository(OrderTransactionHistory).findOne({
      where: { order_id: orderId }
    });
    if (!order)
      return null;
    let result = await axios.get(conf.apis.bnplFetchPayment(order.reference_id), { headers: conf.rupify.authHeaders });
    result.data.order = order;
    return result.data;
  }
}

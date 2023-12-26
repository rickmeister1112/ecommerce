import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { User } from '../Customer/customer.models';
interface SendSMSParams {
    number: string;
    DLT_TE_ID: string;
    authkey: string;
    otp: number;
}
export declare class AuthResolver {
    private jwtService;
    private dataSource;
    private userRepository;
    constructor(jwtService: JwtService, dataSource: DataSource, userRepository: Repository<User>);
    s3Signature(extension?: string, content_type?: string): Promise<import("@aws-sdk/s3-presigned-post").PresignedPost>;
    login(username: string, password: string): Promise<{
        access_token: string;
        user: User;
    }>;
    otpLogin(mobileNumber: string): Promise<any>;
    sendSMS: ({ otp, number, DLT_TE_ID, authkey }: SendSMSParams) => Promise<any>;
    verifyOtp(mobileNumber: string, otpInput: number): Promise<{
        msg: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: User;
        msg?: undefined;
    }>;
    checkNumber(mobile: string): Promise<User>;
    signup(userInput: User): Promise<{
        access_token: string;
        user: {
            email: string;
            first_name: string;
            last_name: string;
            is_admin: Number;
            is_active: Number;
            businesses: import("../Customer/customer.models").Business[];
            userWallet: import("../Payment/payment.models").UserWallet;
            mobile: string;
            gst_no: string;
            gst_treatment: string;
            addresses: import("../Customer/customer.models").Address[];
            carts: import("../Cart/cart.users.models").Cart[];
            userCoupons: import("../../admin/Voucher/voucher.models").UserCoupon[];
            id: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
export {};

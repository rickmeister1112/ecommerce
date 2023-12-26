import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { UserAdmin } from '../Admin/admin.models';
import { User } from 'src/customer/Customer/customer.models';
export declare class AuthResolver {
    private jwtService;
    private dataSource;
    constructor(jwtService: JwtService, dataSource: DataSource);
    s3Signature(extension?: string, content_type?: string): Promise<import("@aws-sdk/s3-presigned-post").PresignedPost>;
    loginadmin(username: string, password: string): Promise<{
        access_token: string;
        user: UserAdmin;
    }>;
}
export declare class AuthFunctions {
    private jwtService;
    private dataSource;
    constructor(jwtService: JwtService, dataSource: DataSource);
    isValidJWT(context: any): Promise<string>;
    getCurrentUser(context: any, userType: "admin" | "customer"): Promise<UserAdmin | User>;
}

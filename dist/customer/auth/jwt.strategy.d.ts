import { Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { User } from '../Customer/customer.models';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private dataSource;
    private configService;
    constructor(dataSource: DataSource, configService: ConfigService);
    validate(payload: any): Promise<User>;
}
export {};

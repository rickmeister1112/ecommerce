import { Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';
import { UserAdmin } from '../Admin/admin.models';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private dataSource;
    private configService;
    constructor(dataSource: DataSource, configService: ConfigService);
    validate(payload: any): Promise<UserAdmin>;
}
export {};

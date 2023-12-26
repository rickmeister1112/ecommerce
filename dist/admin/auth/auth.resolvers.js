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
exports.AuthFunctions = exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const admin_models_1 = require("../Admin/admin.models");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const auth_guard_1 = require("./auth.guard");
const process = require("process");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid = require("uuid");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const customer_models_1 = require("../../customer/Customer/customer.models");
let AuthResolver = class AuthResolver {
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async s3Signature(extension, content_type) {
        content_type = content_type ? content_type : 'image/png';
        return await (0, s3_presigned_post_1.createPresignedPost)(new client_s3_1.S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        }), {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${uuid.v4()}.${extension ? extension : 'png'}`,
            Conditions: [
                { acl: 'public-read' },
                { success_action_status: '201' },
                { 'Content-Type': content_type },
            ],
            Fields: {
                acl: 'public-read',
                success_action_status: '201',
                'Content-Type': content_type,
            },
            Expires: 600,
        });
    }
    async loginadmin(username, password) {
        console.log(username, password);
        const userRepository = this.dataSource.getRepository(admin_models_1.UserAdmin);
        const user = await userRepository.createQueryBuilder("user")
            .where("user.email = :username OR user.mobile = :password", { username, password })
            .andWhere("user.is_active = :is_active", { is_active: 1 })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid Username or Password');
        }
        if (user.password_hash.startsWith('$2b$')) {
            if (!(await bcrypt.compare(password, user.password_hash))) {
                throw new common_1.UnauthorizedException('Invalid Username or Password');
            }
        }
        else if (password == user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
            await userRepository.save(user);
        }
        else {
            throw new common_1.UnauthorizedException('Invalid Username or Password');
        }
        return {
            access_token: await this.jwtService.signAsync({
                sub: user.id,
                jti: uuid.v4(),
            }),
            user: user,
        };
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)('s3Signatureadmin'),
    (0, common_1.UseGuards)(auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('extension')),
    __param(1, (0, graphql_1.Args)('content_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "s3Signature", null);
__decorate([
    (0, graphql_1.Query)('loginadmin'),
    __param(0, (0, graphql_1.Args)('username')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginadmin", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, typeorm_1.DataSource])
], AuthResolver);
class AuthFunctions {
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async isValidJWT(context) {
        var _a, _b, _c;
        const [type, token] = (_c = (_b = (_a = context.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
        if (type !== 'Bearer' || !token) {
            throw new common_1.ForbiddenException('Bearer Token not found in header authorization');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            return payload.sub;
        }
        catch (_d) {
            throw new common_1.ForbiddenException('Bearer Token error');
        }
    }
    async getCurrentUser(context, userType) {
        let model = {
            admin: admin_models_1.UserAdmin,
            customer: customer_models_1.User
        }[userType];
        const user = await this.dataSource
            .getRepository(model)
            .createQueryBuilder('user')
            .where('user.id = :id', { id: await this.isValidJWT(context) })
            .getOne();
        if (!user) {
            throw new common_1.ForbiddenException('Invalid JWT User');
        }
        return user;
    }
}
exports.AuthFunctions = AuthFunctions;
//# sourceMappingURL=auth.resolvers.js.map
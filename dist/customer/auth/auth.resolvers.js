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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const customer_models_1 = require("../Customer/customer.models");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const auth_guard_1 = require("./auth.guard");
const process = require("process");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid = require("uuid");
const s3_presigned_post_1 = require("@aws-sdk/s3-presigned-post");
const axios_1 = require("axios");
const typeorm_2 = require("@nestjs/typeorm");
let AuthResolver = class AuthResolver {
    constructor(jwtService, dataSource, userRepository) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.sendSMS = async ({ otp, number, DLT_TE_ID, authkey }) => {
            const url = 'https://api.msg91.com/api/v2/sendsms';
            const headers = {
                'Content-Type': 'application/json',
                'authkey': authkey,
                'Cookie': 'PHPSESSID=4kgudnphlcd4jghqnjavcjo1f2'
            };
            const body = {
                sender: "UNMUDL",
                route: 4,
                DLT_TE_ID: DLT_TE_ID,
                sms: [
                    {
                        message: `YourOTP  is ${otp} is your account verification code to login into YourDomain\nUNMUDL`,
                        to: [number]
                    }
                ]
            };
            try {
                const response = await axios_1.default.post(url, body, { headers: headers });
                return response.data;
            }
            catch (error) {
                throw new Error(`Error sending SMS: ${error}`);
            }
        };
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
    async login(username, password) {
        const userRepository = this.dataSource.getRepository(customer_models_1.User);
        const user = await userRepository.createQueryBuilder("user")
            .where("user.mobile = :username", { username, password })
            .getOne();
        console.log(user);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid Username or Password');
        }
        if (!(await bcrypt.compare(password, user.password_hash))) {
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
    async otpLogin(mobileNumber) {
        const mobile = mobileNumber;
        const userOtpRepository = this.dataSource.getRepository(customer_models_1.UserOtp);
        const randomFourDigitNumber = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        let userOtp = await userOtpRepository.findOne({
            where: { mobile: (0, typeorm_1.Equal)(mobile), is_Active: false },
        });
        if (userOtp) {
            userOtp.otp = randomFourDigitNumber;
            userOtp.is_Active = false;
        }
        else {
            userOtp = userOtpRepository.create({
                mobile,
                otp: randomFourDigitNumber,
                is_Active: false
            });
        }
        const savedUser = await userOtpRepository.save(userOtp);
        const smsParams = {
            number: `${mobile}`,
            DLT_TE_ID: '1307163392378570875',
            authkey: '160265AXGGxn47pY1C594a554d',
            otp: randomFourDigitNumber
        };
        console.log(smsParams);
        const response = await this.sendSMS(smsParams);
        return response;
    }
    async verifyOtp(mobileNumber, otpInput) {
        const userOtpRepository = this.dataSource.getRepository(customer_models_1.UserOtp);
        const userOtp = await userOtpRepository.findOne({
            where: {
                is_Active: false,
                mobile: (0, typeorm_1.Equal)(mobileNumber)
            }
        });
        if (!userOtp) {
            throw new Error('No pending OTP found for the given mobile number.');
        }
        if (userOtp.otp !== otpInput) {
            throw new Error('Invalid OTP provided.');
        }
        else {
            userOtp.is_Active = true;
            await userOtpRepository.save(userOtp);
            let modifiedNumber;
            if (mobileNumber.startsWith('91')) {
                modifiedNumber = mobileNumber.slice(2);
            }
            else {
                modifiedNumber = mobileNumber;
            }
            const userRepository = this.dataSource.getRepository(customer_models_1.User);
            const userData = await userRepository.findOne({
                where: {
                    mobile: modifiedNumber
                }
            });
            if (!userData) {
                return {
                    msg: "Mobile number verified",
                };
            }
            else {
                return {
                    access_token: await this.jwtService.signAsync({
                        sub: userData.id,
                        jti: uuid.v4(),
                    }),
                    user: userData
                };
            }
        }
    }
    async checkNumber(mobile) {
        const userRepository = this.dataSource.getRepository(customer_models_1.User);
        const findNumber = await userRepository.findOne({
            where: {
                mobile: mobile
            }
        });
        if (!findNumber) {
            throw new Error('No User Exists');
        }
        else {
            return findNumber;
        }
    }
    async signup(userInput) {
        const { email, first_name, last_name, mobile, password_hash } = userInput;
        console.log(userInput);
        if (!password_hash || password_hash.length < 8) {
            throw new common_1.BadRequestException('Password is required and should be at least 8 characters');
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { mobile }],
        });
        if (existingUser) {
            throw new common_1.BadRequestException('A user with this email or mobile already exists');
        }
        const newUser = this.userRepository.create({
            email,
            first_name,
            last_name,
            mobile,
            password_hash: hashedPassword,
        });
        const savedUser = await this.userRepository.save(newUser);
        const { password_hash: _ } = savedUser, userWithoutPassword = __rest(savedUser, ["password_hash"]);
        return {
            access_token: await this.jwtService.signAsync({
                sub: userWithoutPassword.id,
                jti: uuid.v4(),
            }),
            user: userWithoutPassword
        };
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Query)('s3Signature'),
    (0, common_1.UseGuards)(auth_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('extension')),
    __param(1, (0, graphql_1.Args)('content_type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "s3Signature", null);
__decorate([
    (0, graphql_1.Query)('login'),
    __param(0, (0, graphql_1.Args)('username')),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Query)('otplogin'),
    __param(0, (0, graphql_1.Args)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "otpLogin", null);
__decorate([
    (0, graphql_1.Query)('verifyOtp'),
    __param(0, (0, graphql_1.Args)('mobile')),
    __param(1, (0, graphql_1.Args)('otp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "verifyOtp", null);
__decorate([
    (0, graphql_1.Query)('checkNumberValidity'),
    __param(0, (0, graphql_1.Args)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "checkNumber", null);
__decorate([
    (0, graphql_1.Mutation)('signup'),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_models_1.User]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "signup", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __param(2, (0, typeorm_2.InjectRepository)(customer_models_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.DataSource,
        typeorm_1.Repository])
], AuthResolver);
//# sourceMappingURL=auth.resolvers.js.map
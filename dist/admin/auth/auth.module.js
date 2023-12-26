"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_resolvers_1 = require("./auth.resolvers");
const jwt_strategy_1 = require("./jwt.strategy");
const admin_models_1 = require("../Admin/admin.models");
let AuthAdminModule = class AuthAdminModule {
};
exports.AuthAdminModule = AuthAdminModule;
exports.AuthAdminModule = AuthAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '60d' },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([admin_models_1.UserAdmin]),
        ],
        providers: [jwt_strategy_1.JwtStrategy, auth_resolvers_1.AuthResolver],
    })
], AuthAdminModule);
//# sourceMappingURL=auth.module.js.map
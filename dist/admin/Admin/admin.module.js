"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersModule = void 0;
const common_1 = require("@nestjs/common");
const admin_resolver_1 = require("./admin.resolver");
const admin_models_1 = require("./admin.models");
const typeorm_1 = require("@nestjs/typeorm");
let AdminUsersModule = class AdminUsersModule {
};
exports.AdminUsersModule = AdminUsersModule;
exports.AdminUsersModule = AdminUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([admin_models_1.UserAdmin, admin_models_1.Role, admin_models_1.UserRole])
        ],
        providers: [
            admin_resolver_1.UserAdminResolver,
            admin_resolver_1.RoleResolver,
            admin_resolver_1.UserRoleResolver,
        ],
        exports: [
            admin_resolver_1.UserAdminResolver,
            admin_resolver_1.RoleResolver,
            admin_resolver_1.UserRoleResolver,
        ]
    })
], AdminUsersModule);
//# sourceMappingURL=admin.module.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const customer_models_1 = require("../Customer/customer.models");
const base_admin_resolver_1 = require("../../admin/utils/base.admin.resolver");
const admin_models_1 = require("../../admin/Admin/admin.models");
function BaseResolver(model) {
    let BaseResolverHost = class BaseResolverHost extends (0, base_admin_resolver_1.BaseAdminResolver)(model) {
        constructor(dataSource, auth_required = true, exclude_select_columns = new Set(), exclude_update_columns = new Set(), open_to_all = false) {
            super(dataSource, auth_required, exclude_select_columns, exclude_update_columns, open_to_all);
            this.dataSource = dataSource;
            this.auth_required = auth_required;
            this.exclude_select_columns = exclude_select_columns;
            this.exclude_update_columns = exclude_update_columns;
            this.open_to_all = open_to_all;
        }
        async hasDeletePermission(qs, user) {
            throw new common_1.ForbiddenException();
        }
        async getCurrentUser(context) {
            const user = await Promise.all([
                this.dataSource.getRepository(customer_models_1.User).createQueryBuilder('user').where('user.id = :id', { id: await super.isValidJWT(context) }).getOne(),
                this.dataSource.getRepository(admin_models_1.UserAdmin).createQueryBuilder('user').where('user.id = :id', { id: await super.isValidJWT(context) }).getOne(),
            ]);
            if (user[0] || user[1])
                return user[0] || user[1];
            throw new common_1.ForbiddenException('Invalid JWT User');
        }
    };
    BaseResolverHost = __decorate([
        (0, graphql_1.Resolver)({ isAbstract: true }),
        __metadata("design:paramtypes", [typeorm_1.DataSource, Object, Object, Object, Object])
    ], BaseResolverHost);
    return BaseResolverHost;
}
exports.BaseResolver = BaseResolver;
//# sourceMappingURL=base.resolver.js.map
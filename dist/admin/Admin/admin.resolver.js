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
exports.UserRoleResolver = exports.RoleResolver = exports.UserAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin_models_1 = require("./admin.models");
let UserAdminResolver = class UserAdminResolver {
    constructor(userAdminRepository) {
        this.userAdminRepository = userAdminRepository;
    }
    async getUserAdmin(id) {
        return this.userAdminRepository.findOne({ where: { id } });
    }
    async listUserAdmin() {
        return this.userAdminRepository.find();
    }
    async addUserAdmin(row) {
        const newUserAdmin = this.userAdminRepository.create(row);
        try {
            return await this.userAdminRepository.save(newUserAdmin);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Duplicate value');
            }
            throw error;
        }
    }
    async updateUserAdmin(id, input) {
        await this.userAdminRepository.update(id, input);
        return this.userAdminRepository.findOne({ where: { id } });
    }
    async deleteUserAdmin(id) {
        const userAdminToDelete = await this.userAdminRepository.findOne({ where: { id } });
        return this.userAdminRepository.remove(userAdminToDelete);
    }
};
exports.UserAdminResolver = UserAdminResolver;
__decorate([
    (0, graphql_1.Query)(returns => admin_models_1.UserAdmin, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserAdminResolver.prototype, "getUserAdmin", null);
__decorate([
    (0, graphql_1.Query)(returns => [admin_models_1.UserAdmin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserAdminResolver.prototype, "listUserAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.UserAdmin),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAdminResolver.prototype, "addUserAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.UserAdmin),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserAdminResolver.prototype, "updateUserAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.UserAdmin),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserAdminResolver.prototype, "deleteUserAdmin", null);
exports.UserAdminResolver = UserAdminResolver = __decorate([
    (0, graphql_1.Resolver)(of => admin_models_1.UserAdmin),
    __param(0, (0, typeorm_1.InjectRepository)(admin_models_1.UserAdmin)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserAdminResolver);
let RoleResolver = class RoleResolver {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async getRole(id) {
        return this.roleRepository.findOne({ where: { id } });
    }
    async listRole(page, limit) {
        return this.roleRepository.find({
            skip: page,
            take: limit,
        });
    }
    async addRole(row) {
        const newRole = this.roleRepository.create(row);
        try {
            return await this.roleRepository.save(newRole);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Duplicate value');
            }
            throw error;
        }
    }
    async addMultipleRole(rows) {
        const newRoles = this.roleRepository.create(rows);
        return this.roleRepository.save(newRoles);
    }
    async updateRole(id, input) {
        await this.roleRepository.update(id, input);
        return this.roleRepository.findOne({ where: { id } });
    }
    async deleteRole(id) {
        const roleToDelete = await this.roleRepository.findOne({ where: { id } });
        return this.roleRepository.remove(roleToDelete);
    }
};
exports.RoleResolver = RoleResolver;
__decorate([
    (0, graphql_1.Query)(returns => admin_models_1.Role, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "getRole", null);
__decorate([
    (0, graphql_1.Query)(returns => [admin_models_1.Role]),
    __param(0, (0, graphql_1.Args)('page', { nullable: true })),
    __param(1, (0, graphql_1.Args)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "listRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.Role),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "addRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => [admin_models_1.Role]),
    __param(0, (0, graphql_1.Args)('rows')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "addMultipleRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.Role),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "updateRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.Role),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "deleteRole", null);
exports.RoleResolver = RoleResolver = __decorate([
    (0, graphql_1.Resolver)(of => admin_models_1.Role),
    __param(0, (0, typeorm_1.InjectRepository)(admin_models_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoleResolver);
let UserRoleResolver = class UserRoleResolver {
    constructor(userRoleRepository, userAdminRepository, roleRepository) {
        this.userRoleRepository = userRoleRepository;
        this.userAdminRepository = userAdminRepository;
        this.roleRepository = roleRepository;
    }
    async addUserRole(row) {
        const user = await this.userAdminRepository.findOne({ where: { id: row.user_id } });
        const role = await this.roleRepository.findOne({ where: { id: (0, typeorm_2.In)(Object.values(row.role_id)) } });
        if (!user) {
            throw new Error('User not found');
        }
        if (!role) {
            throw new Error('Role not found');
        }
        const newUserRole = this.userRoleRepository.create({
            user: user,
            role: role
        });
        try {
            return await this.userRoleRepository.save(newUserRole);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Duplicate value');
            }
            throw error;
        }
    }
    async addMultipleUserRole(rows) {
        const newUserRolesPromises = rows.map(async (row) => {
            const user = await this.userAdminRepository.findOne({ where: { id: row.user_id } });
            const role = await this.roleRepository.findOne({ where: { id: row.role_id } });
            if (!user || !role) {
                throw new Error('User or Role not found');
            }
            return this.userRoleRepository.create({
                user: user,
                role: role
            });
        });
        const newUserRoles = await Promise.all(newUserRolesPromises);
        try {
            return await this.userRoleRepository.save(newUserRoles);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new Error('Duplicate value');
            }
            throw error;
        }
    }
    async deleteUserRole(id) {
        const userRoleToDelete = await this.userRoleRepository.findOne({ where: { id } });
        if (!userRoleToDelete) {
            throw new Error('UserRole not found');
        }
        return this.userRoleRepository.remove(userRoleToDelete);
    }
    async getUserRole(id) {
        return this.userRoleRepository.findOne({ where: { id } });
    }
    async listUserRole(page, limit) {
        return this.userRoleRepository.find({
            skip: page,
            take: limit,
        });
    }
};
exports.UserRoleResolver = UserRoleResolver;
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.UserRole),
    __param(0, (0, graphql_1.Args)('row')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_models_1.UserRoleInput]),
    __metadata("design:returntype", Promise)
], UserRoleResolver.prototype, "addUserRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => [admin_models_1.UserRole]),
    __param(0, (0, graphql_1.Args)('rows', { type: () => admin_models_1.UserRoleInput })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UserRoleResolver.prototype, "addMultipleUserRole", null);
__decorate([
    (0, graphql_1.Mutation)(returns => admin_models_1.UserRole),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoleResolver.prototype, "deleteUserRole", null);
__decorate([
    (0, graphql_1.Query)(returns => admin_models_1.UserRole, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoleResolver.prototype, "getUserRole", null);
__decorate([
    (0, graphql_1.Query)(returns => [admin_models_1.UserRole]),
    __param(0, (0, graphql_1.Args)('page', { nullable: true })),
    __param(1, (0, graphql_1.Args)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserRoleResolver.prototype, "listUserRole", null);
exports.UserRoleResolver = UserRoleResolver = __decorate([
    (0, graphql_1.Resolver)(of => admin_models_1.UserRole),
    __param(0, (0, typeorm_1.InjectRepository)(admin_models_1.UserRole)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_models_1.UserAdmin)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_models_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserRoleResolver);
//# sourceMappingURL=admin.resolver.js.map
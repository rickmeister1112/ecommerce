import { Repository } from 'typeorm';
import { Role, RoleInput, UserAdmin, UserAdminInput, UserRole, UserRoleInput } from './admin.models';
export declare class UserAdminResolver {
    private userAdminRepository;
    constructor(userAdminRepository: Repository<UserAdmin>);
    getUserAdmin(id: string): Promise<UserAdmin>;
    listUserAdmin(): Promise<UserAdmin[]>;
    addUserAdmin(row: UserAdminInput): Promise<UserAdmin>;
    updateUserAdmin(id: string, input: UserAdminInput): Promise<UserAdmin>;
    deleteUserAdmin(id: string): Promise<UserAdmin>;
}
export declare class RoleResolver {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    getRole(id: string): Promise<Role>;
    listRole(page: number, limit: number): Promise<Role[]>;
    addRole(row: RoleInput): Promise<Role>;
    addMultipleRole(rows: RoleInput[]): Promise<Role[]>;
    updateRole(id: string, input: RoleInput): Promise<Role>;
    deleteRole(id: string): Promise<Role>;
}
export declare class UserRoleResolver {
    private userRoleRepository;
    private userAdminRepository;
    private roleRepository;
    constructor(userRoleRepository: Repository<UserRole>, userAdminRepository: Repository<UserAdmin>, roleRepository: Repository<Role>);
    addUserRole(row: UserRoleInput): Promise<UserRole>;
    addMultipleUserRole(rows: UserRoleInput[]): Promise<UserRole[]>;
    deleteUserRole(id: string): Promise<UserRole>;
    getUserRole(id: string): Promise<UserRole>;
    listUserRole(page: number, limit: number): Promise<UserRole[]>;
}

export declare class UserAdmin {
    id: string;
    created_at: Date;
    updated_at: Date;
    password_hash: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: number;
    is_active: number;
    mobile: string;
}
export interface UserAdminInput {
    password_hash: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: number;
    is_active: number;
    mobile: string;
}
export declare class Role {
    id: string;
    created_at: Date;
    updated_at: Date;
    role_name: string;
}
export interface RoleInput {
    role_name: string;
}
export declare class UserRole {
    id: string;
    created_at: Date;
    updated_at: Date;
    user: UserAdmin;
    role: Role;
}
export declare class UserRoleInput {
    user_id: string;
    role_id: string;
}

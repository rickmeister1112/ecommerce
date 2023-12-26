import { Module } from '@nestjs/common';
import { UserAdminResolver, RoleResolver, UserRoleResolver } from './admin.resolver';
import { Role, UserAdmin, UserRole } from './admin.models';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    TypeOrmModule.forFeature([UserAdmin, Role, UserRole])
  ],
  providers: [
    UserAdminResolver,
    RoleResolver,
    UserRoleResolver,
  ],
  exports: [
    UserAdminResolver,
    RoleResolver,
    UserRoleResolver,
  ]
})
export class AdminUsersModule {}

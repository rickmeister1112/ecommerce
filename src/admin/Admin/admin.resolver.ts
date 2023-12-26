import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role, RoleInput, UserAdmin, UserAdminInput, UserRole, UserRoleInput } from './admin.models';

@Resolver(of => UserAdmin)
export class UserAdminResolver {
  constructor(
    @InjectRepository(UserAdmin)
    private userAdminRepository: Repository<UserAdmin>,
  ) { }

  @Query(returns => UserAdmin, { nullable: true })
  async getUserAdmin(@Args('id') id: string): Promise<UserAdmin> {
    return this.userAdminRepository.findOne({ where: { id } });
  }

  @Query(returns => [UserAdmin])
  async listUserAdmin(): Promise<UserAdmin[]> {
    return this.userAdminRepository.find();
  }

  @Mutation(returns => UserAdmin)
  async addUserAdmin(
    @Args('row') row: UserAdminInput,
  ): Promise<UserAdmin> {
    const newUserAdmin = this.userAdminRepository.create(row);
    try {
      return await this.userAdminRepository.save(newUserAdmin);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Duplicate value');
      }
      throw error;
    }
  }

  @Mutation(returns => UserAdmin)
  async updateUserAdmin(
    @Args('id') id: string,
    @Args('input') input: UserAdminInput,
  ): Promise<UserAdmin> {
    await this.userAdminRepository.update(id, input);
    return this.userAdminRepository.findOne({ where: { id } });
  }

  @Mutation(returns => UserAdmin)
  async deleteUserAdmin(@Args('id') id: string): Promise<UserAdmin> {
    const userAdminToDelete = await this.userAdminRepository.findOne({ where: { id } });
    return this.userAdminRepository.remove(userAdminToDelete);
  }
}


@Resolver(of => Role)
export class RoleResolver {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }

  @Query(returns => Role, { nullable: true })
  async getRole(@Args('id') id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  @Query(returns => [Role])
  async listRole(@Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number,
                 /* @Args('order_by', {nullable: true}) order_by: [String] */): Promise<Role[]> {
    return this.roleRepository.find({
      skip: page,
      take: limit,
      // order: {
      //   role_name: order_by.includes("role_name") ? "ASC" : "DESC"
      // }
    });
  }

  @Mutation(returns => Role)
  async addRole(
    @Args('row') row: RoleInput,
  ): Promise<Role> {
    const newRole = this.roleRepository.create(row);
    try {
      return await this.roleRepository.save(newRole);
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Duplicate value');
      }
      throw error;
    }
  }

  @Mutation(returns => [Role])
  async addMultipleRole(@Args('rows') rows: RoleInput[]): Promise<Role[]> {
    const newRoles = this.roleRepository.create(rows);
    return this.roleRepository.save(newRoles);
  }

  @Mutation(returns => Role)
  async updateRole(
    @Args('id') id: string,
    @Args('input') input: RoleInput,
  ): Promise<Role> {
    await this.roleRepository.update(id, input);
    return this.roleRepository.findOne({ where: { id } });
  }

  @Mutation(returns => Role)
  async deleteRole(@Args('id') id: string): Promise<Role> {
    const roleToDelete = await this.roleRepository.findOne({ where: { id } });
    return this.roleRepository.remove(roleToDelete);
  }
}


@Resolver(of => UserRole)
export class UserRoleResolver {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserAdmin)
    private userAdminRepository: Repository<UserAdmin>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  @Mutation(returns => UserRole)
  async addUserRole(
    @Args('row') row: UserRoleInput,
  ): Promise<UserRole> {
 
    const user = await this.userAdminRepository.findOne({ where: { id: row.user_id } });
    const role = await this.roleRepository.findOne({ where: { id: In(Object.values(row.role_id)) } });

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
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Duplicate value');
      }
      throw error;
    }
  }

  @Mutation(returns => [UserRole])
  async addMultipleUserRole(
    @Args('rows', { type: () => UserRoleInput }) rows: UserRoleInput[],
  ): Promise<UserRole[]> {
    const newUserRolesPromises = rows.map(async row => {
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
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Duplicate value');
      }
      throw error;
    }
  }

  @Mutation(returns => UserRole)
  async deleteUserRole(@Args('id') id: string): Promise<UserRole> {
    const userRoleToDelete = await this.userRoleRepository.findOne({ where: { id } });

    if (!userRoleToDelete) {
      throw new Error('UserRole not found');
    }

    return this.userRoleRepository.remove(userRoleToDelete);
  }

  @Query(returns => UserRole, { nullable: true })
  async getUserRole(@Args('id') id: string): Promise<UserRole> {
    return this.userRoleRepository.findOne({ where: { id } });
  }

  @Query(returns => [UserRole])
  async listUserRole(@Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number): Promise<UserRole[]> {
    return this.userRoleRepository.find({
      skip: page,
      take: limit,
    });
  }

}




/* 
@TODO
1.) change the admoin model and make it from the base resolver */
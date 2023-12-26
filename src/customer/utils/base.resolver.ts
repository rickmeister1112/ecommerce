import {
  Resolver,
} from '@nestjs/graphql';
import { ForbiddenException, Type } from '@nestjs/common';
import {
  DataSource, FindManyOptions,
} from 'typeorm';
import { User } from '../Customer/customer.models';
import { BaseAdminResolver } from 'src/admin/utils/base.admin.resolver';
import { UserAdmin } from 'src/admin/Admin/admin.models';

export function BaseResolver<T extends Type<unknown>>(model: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost extends BaseAdminResolver(model) {
    protected constructor(
      private dataSource: DataSource,
      public auth_required = true,
      public exclude_select_columns = new Set<string>(),
      public exclude_update_columns = new Set<string>(),
      public open_to_all = false,
    ) {
      super(dataSource, auth_required, exclude_select_columns, exclude_update_columns, open_to_all);
    }

    public async hasDeletePermission(qs: FindManyOptions<typeof model>, user?: UserAdmin | User) {
      throw new ForbiddenException();
    }

    async getCurrentUser(context): Promise<User | UserAdmin> {
      const user = await Promise.all([
        this.dataSource.getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: await super.isValidJWT(context) }).getOne(),
        this.dataSource.getRepository(UserAdmin).createQueryBuilder('user').where('user.id = :id', { id: await super.isValidJWT(context) }).getOne(),
      ])
      if (user[0] || user[1])
        return user[0] || user[1];
      throw new ForbiddenException('Invalid JWT User');
    }
  }

  return BaseResolverHost;
}

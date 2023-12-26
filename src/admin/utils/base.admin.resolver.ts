import {
  Args,
  Context,
  GraphQLExecutionContext,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ForbiddenException, NotFoundException, Type } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql/type';
import {
  DataSource,
  FindOptions,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { appendFileSync } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { UserAdmin } from '../Admin/admin.models';
import { FieldNode, SelectionSetNode } from 'graphql/language/ast';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { User } from 'src/customer/Customer/customer.models';

export function BaseAdminResolver<T extends Type<unknown>>(model: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseAdminResolverHost {
    protected constructor(
      private dataSource: DataSource,
      public auth_required = true,
      public exclude_select_columns = new Set<string>(),
      public exclude_update_columns = new Set<string>(),
      public open_to_all = false,
    ) {
      this.generateGraphqlSchema();
    }

    public async hasReadPermission(qs: FindManyOptions<typeof model>, user?: UserAdmin | User) {
      return qs;
    }

    public async hasAddPermission(rows: (typeof model)[], user?: UserAdmin | User) {
      return rows;
    }

    public async hasUpdatePermission(currentObj: T, newObj: T, user?: UserAdmin | User) {
      return newObj;
    }

    public async hasDeletePermission(qs: FindManyOptions<typeof model>, user?: UserAdmin | User) {
      return qs;
    }

    public async afterObjectsSave(objects: T[], user?: UserAdmin | User) {
      //
    }

    public async afterObjectUpdate(obj: T, user?: UserAdmin | User) {
      //
    }

    private generateGraphqlSchema() {
      const gqlFields = [];
      const gqlInputFields = [];

      const entityMetadata = this.dataSource.getMetadata(model);

      //console.log(model.name, entityMetadata.columns.map(col => col.databaseName));
      entityMetadata.columns.forEach((column) => {
        if (
          this.exclude_select_columns.has(column.databaseName) ||
          this.exclude_select_columns.has(column.propertyName)
        ) {
          return;
        }
        switch (column.type) {
          case 'text':
          case 'varchar':
          case 'enum':
            gqlFields.push(
              column.databaseName +
              ' (equal: String, notEqual: String, in: [String], notIn: [String], contains: String, startsWith: String, isNull: Boolean): String',
            );
            gqlInputFields.push(column.databaseName + ' : String');
            break;
          case 'boolean':
            gqlFields.push(column.databaseName + ' (bool: Boolean): Boolean');
            gqlInputFields.push(column.databaseName + ' : Boolean');
            break;
          case 'float':
          case 'decimal':
            gqlFields.push(
              column.databaseName +
              ' (equal: Float, notEqual: Float, in: [Float], notIn: [Float], greaterThan: Float, lesserThan: Float, greaterEqual: Float, lesserEqual: Float, isNull: Boolean): Float',
            );
            gqlInputFields.push(column.databaseName + ' : Float');
            break;
          case 'int':
          case 'integer':
          case 'smallint':
            gqlFields.push(
              column.databaseName +
              ' (equal: Int, notEqual: Int, in: [Int], notIn: [Int], greaterThan: Int, lesserThan: Int, greaterEqual: Int, lesserEqual: Int, isNull: Boolean): Int',
            );
            gqlInputFields.push(column.databaseName + ' : Int');
            break;
          case 'uuid':
            gqlFields.push(
              column.databaseName +
              ' (equal: UUID, notEqual: UUID, in: [UUID], notIn: [UUID], isNull: Boolean): UUID',
            );
            gqlInputFields.push(column.databaseName + ' : UUID');
            break;
          case 'timestamptz':
            gqlFields.push(
              column.databaseName +
              ' (greaterThan: DateTime, lesserThan: DateTime, greaterEqual: DateTime, lesserEqual: DateTime, isNull: Boolean): DateTime',
            );
            gqlInputFields.push(column.databaseName + ' : DateTime');
            break;
          case 'date':
            gqlFields.push(
              column.databaseName +
              ' (greaterThan: Date, lesserThan: Date, greaterEqual: Date, lesserEqual: Date, isNull: Boolean): Date',
            );
            gqlInputFields.push(column.databaseName + ' : Date');
            break;
          case 'json':
          case 'simple-json':
            gqlFields.push(column.databaseName + ' : JSON');
            gqlInputFields.push(column.databaseName + ' : JSON');
            break;

          default:
            console.log('unmapped column', column.databaseName, column.type, model.name);
        }
      });

      entityMetadata.relations.forEach((column) => {
        switch (column.relationType) {
          case 'one-to-many':
          case 'many-to-many':
            gqlFields.push(
              `${column.propertyName} (order_by: [String!]): [${column.inverseEntityMetadata.name}]`,
            );
            gqlInputFields.push(
              `${column.propertyName} : [${column.inverseEntityMetadata.name}Input]`,
            );
            break;
          default:
            gqlFields.push(
              `${column.propertyName}: ${column.inverseEntityMetadata.name}`,
            );
            gqlInputFields.push(
              `${column.propertyName} : ${column.inverseEntityMetadata.name}Input`,
            );
        }
      });
      const schema =
        `\ntype ` +
        model.name +
        ` {\n    ` +
        gqlFields.join('\n    ') +
        `\n}\n` +
        `\ninput ` +
        model.name +
        `Input {\n    ` +
        gqlInputFields.join('\n    ') +
        `\n}\n` +
        `
        extend type Query {
          get${model.name}(id: UUID!): ${model.name}!
                  list${model.name}(page: Int, limit: Int, order_by: [String]): [${model.name}]!
        }
        extend type Mutation {
          add${model.name}(row: ${model.name}Input!): ${model.name}!
          addMultiple${model.name}(rows: [${model.name}Input!]): [${model.name}]!
          update${model.name}(id: UUID!, input: ${model.name}Input!): ${model.name}!
          delete${model.name}: ${model.name}!
        }
        `;
      appendFileSync('generated.graphql', schema);
    }
    // =====================================>>>>>>>>
    @Query((type) => [model], { name: `list${model.name}` })
    public async findAll(
      @Args('page') page = 1,
      @Args('limit') limit = 10,
      @Args('order_by') order_by?: string[],
      @Info() info?: GraphQLResolveInfo,
      @Context() context?: GraphQLExecutionContext,
    ): Promise<T[]> {

      if (!this.open_to_all) {
        const user = this.auth_required
          ? await this.getCurrentUser(context)
          : null;
      }

      const userRepository = this.dataSource.getRepository(model);

      let options = {
        relations: {},
        where: {},
        select: {},
        order: {},
        take: limit,
        skip: (page - 1) * limit,
      } as FindManyOptions;

      if (order_by?.length) {
        order_by.forEach((col) => {
          if (col.startsWith('-')) {
            options.order[col.replace('-', '')] = 'DESC';
          } else {
            options.order[col] = 'ASC';
          }
        });
      }

      options = this.generateFilters(info.fieldNodes[0].selectionSet, options, info.variableValues);
      // console.log(JSON.stringify(options, null, 2));

      return (await userRepository.find(options)) as any;
    }

    private generateFilters(
      selectionSet: SelectionSetNode,
      options: FindManyOptions<typeof model>,
      variables: { [variable: string]: any },
    ) {
      selectionSet.selections.forEach((field: FieldNode) => {
        if (this.exclude_select_columns.has(field.name.value) || field.name.value == "__typename") {
          return;
        }
        if (field.selectionSet) {
          options.relations[field.name.value] = true;

          field.arguments.forEach((argument: any) => {
            switch (argument.name.value) {
              case 'order_by':
                options.order[field.name.value] = {};

                if (argument.value.values) {
                  argument.value.values.forEach((col) => {
                    if (col.value.startsWith('-')) {
                      options.order[field.name.value][
                        col.value.replace('-', '')
                      ] = 'DESC';
                    } else {
                      options.order[field.name.value][col.value] = 'ASC';
                    }
                  });
                } else {
                  if (variables[argument.value.name.value].startsWith('-')) {
                    options.order[field.name.value][
                      variables[argument.value.name.value].replace('-', '')
                    ] = 'DESC';
                  } else {
                    options.order[field.name.value][variables[argument.value.name.value]] =
                      'ASC';
                  }
                }
                break;
              default:
                console.log(
                  `un implemented filter on field '${field.name.value}' > filter > '${argument.name.value}' value > '${variables[argument.value.name.value]}'`,
                );
            }
          });

          const childOptions = this.generateFilters(field.selectionSet, {
            relations: {},
            where: {},
            select: {},
            order: {},
          } as FindManyOptions, variables);
          options.select[field.name.value] = childOptions.select;
          options.relations[field.name.value] = childOptions.relations;
          if (Object.keys(childOptions.where).length) {
            options.where[field.name.value] = childOptions.where;
          }
        } else {
          options.select[field.name.value] = true;
          field.arguments.forEach((argument: any) => {
            switch (argument.name.value) {
              case 'equal':
                options.where[field.name.value] = variables[argument.value.name.value];
                break;
              case 'notEqual':
                options.where[field.name.value] = Not(variables[argument.value.name.value]);
                break;
              case 'greaterThan':
                options.where[field.name.value] = MoreThan(
                  variables[argument.value.name.value],
                );
                break;

              case 'lesserThan':
                options.where[field.name.value] = LessThan(
                  variables[argument.value.name.value],
                );
                break;

              case 'greaterEqual':
                options.where[field.name.value] = MoreThanOrEqual(
                  variables[argument.value.name.value],
                );
                break;

              case 'lesserEqual':
                options.where[field.name.value] = LessThanOrEqual(
                  variables[argument.value.name.value],
                );
                break;

              case 'contains':
                options.where[field.name.value] = ILike(
                  `%${variables[argument.value.name.value]}%`,
                );
                break;

              case 'startsWith':
                options.where[field.name.value] = ILike(
                  `${variables[argument.value.name.value]}%`,
                );
                break;

              case 'in':
                options.where[field.name.value] = In(
                  variables[argument.value.name.value],
                );
                break;

              case 'notIn':
                options.where[field.name.value] = Not(
                  In(variables[argument.value.name.value]),
                );
                break;

              case 'isNull':
                if (variables[argument.value.name.value] == true) {
                  options.where[field.name.value] = IsNull();
                } else {
                  options.where[field.name.value] = Not(IsNull());
                }
                break;

              default:
                console.log(
                  `un implemented filter on field '${field.name.value}' > filter > '${argument.name.value}' value > '${variables[argument.value.name.value]}'`,
                );
            }
          });
        }
      });
      return options;
    }

    @Query((type) => model, { name: `get${model.name}` })
    public async findOne(
      @Args('id') id: string,
      allColumns = false,
      @Context() context?: GraphQLExecutionContext,
      @Info() info?: GraphQLResolveInfo,
    ): Promise<T> {
      let user: UserAdmin;
      if (this.auth_required) {
        try {
          user = await this.getCurrentUser(context);
        } catch (error) {
          if (!this.open_to_all) {
            throw new ForbiddenException(error.message);
          }
        }
      }
      const findOptions = await this.hasReadPermission(
        this.generateFilters(info.fieldNodes[0].selectionSet, {
          order: {},
          where: { id: id },
          relations: {},
          select: {},
        } as FindManyOptions, info.variableValues),
        user,
      );
      const obj = await this.dataSource
        .getRepository(model)
        .findOne(findOptions);
      if (!obj) {
        throw new NotFoundException();
      }
      return obj as any;
    }

    @Mutation((returns) => Boolean, { name: `delete${model.name}` })
    public async delete(
      @Context() context?: GraphQLExecutionContext,
      @Info() info?: GraphQLResolveInfo,
    ) {
      const user = this.auth_required
        ? await this.getCurrentUser(context)
        : null;

      let options = {
        relations: {},
        where: {},
        select: {},
        order: {},
      } as FindManyOptions;

      options = this.generateFilters(info.fieldNodes[0].selectionSet, options, info.variableValues);
      options = await this.hasDeletePermission(options, user);

      await this.dataSource.getRepository(model).delete(options);
      return true;
    }

    @Mutation((returns) => Boolean, { name: `update${model.name}` })
    public async update(
      @Args('id') id: string,
      @Args('input') input: any,
      @Context() context?: GraphQLExecutionContext,
      @Info() info?: GraphQLResolveInfo,
    ) {
      const user = this.auth_required
        ? await this.getCurrentUser(context)
        : null;

      this.exclude_update_columns.forEach((column) => {
        if (input[column]) {
          delete input[column];
        }
      });
      if (input.id) {
        delete input[id];
      }

      await this.dataSource.getRepository(model).save({
        ...(await this.hasUpdatePermission(
          await this.findOne(id, true, context, info),
          input,
          user,
        )),
        id: id,
      });
      return await this.findOne(id, false, context, info);
    }

    @Mutation((returns) => model, { name: `add${model.name}` })
    public async addRow(
      @Args('row', { type: () => model }) row: any,
      @Context() context?: GraphQLExecutionContext,
      @Info() info?: GraphQLResolveInfo,
    ): Promise<T> {
      return (await this.addMultipleRows([row], context, info))[0];
    }

    @Mutation((returns) => model, { name: `addMultiple${model.name}` })
    public async addMultipleRows(
      @Args('rows', { type: () => [model] }) rows: (typeof model)[],
      @Context() context?: GraphQLExecutionContext,
      @Info() info?: GraphQLResolveInfo,
    ): Promise<T> {
      const user = this.auth_required
        ? await this.getCurrentUser(context)
        : null;

      const a = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(model)
        .values(await this.hasAddPermission(rows, user))
        .execute();

      return a.generatedMaps as any;
    }

    async isValidJWT(context: any): Promise<string> {
      const [type, token] = context.headers?.authorization?.split(' ') ?? [];
      if (type !== 'Bearer' || !token) {
        throw new ForbiddenException(
          'Bearer Token not found in header authorization',
        );
      }
      try {
        const jwtService = new JwtService();
        const payload = await jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        return payload.sub;
      } catch {
        throw new ForbiddenException('Bearer Token error');
      }
    }

    async getCurrentUser(context): Promise<UserAdmin> {
      const user = await this.dataSource
        .getRepository(UserAdmin)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: await this.isValidJWT(context) })
        .getOne();
      if (!user) {
        throw new ForbiddenException('Invalid JWT User');
      }
      return user;
    }
  }

  return BaseAdminResolverHost;
}

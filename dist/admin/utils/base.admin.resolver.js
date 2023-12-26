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
exports.BaseAdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const fs_1 = require("fs");
const jwt_1 = require("@nestjs/jwt");
const admin_models_1 = require("../Admin/admin.models");
function BaseAdminResolver(model) {
    let BaseAdminResolverHost = class BaseAdminResolverHost {
        constructor(dataSource, auth_required = true, exclude_select_columns = new Set(), exclude_update_columns = new Set(), open_to_all = false) {
            this.dataSource = dataSource;
            this.auth_required = auth_required;
            this.exclude_select_columns = exclude_select_columns;
            this.exclude_update_columns = exclude_update_columns;
            this.open_to_all = open_to_all;
            this.generateGraphqlSchema();
        }
        async hasReadPermission(qs, user) {
            return qs;
        }
        async hasAddPermission(rows, user) {
            return rows;
        }
        async hasUpdatePermission(currentObj, newObj, user) {
            return newObj;
        }
        async hasDeletePermission(qs, user) {
            return qs;
        }
        async afterObjectsSave(objects, user) {
        }
        async afterObjectUpdate(obj, user) {
        }
        generateGraphqlSchema() {
            const gqlFields = [];
            const gqlInputFields = [];
            const entityMetadata = this.dataSource.getMetadata(model);
            entityMetadata.columns.forEach((column) => {
                if (this.exclude_select_columns.has(column.databaseName) ||
                    this.exclude_select_columns.has(column.propertyName)) {
                    return;
                }
                switch (column.type) {
                    case 'text':
                    case 'varchar':
                    case 'enum':
                        gqlFields.push(column.databaseName +
                            ' (equal: String, notEqual: String, in: [String], notIn: [String], contains: String, startsWith: String, isNull: Boolean): String');
                        gqlInputFields.push(column.databaseName + ' : String');
                        break;
                    case 'boolean':
                        gqlFields.push(column.databaseName + ' (bool: Boolean): Boolean');
                        gqlInputFields.push(column.databaseName + ' : Boolean');
                        break;
                    case 'float':
                    case 'decimal':
                        gqlFields.push(column.databaseName +
                            ' (equal: Float, notEqual: Float, in: [Float], notIn: [Float], greaterThan: Float, lesserThan: Float, greaterEqual: Float, lesserEqual: Float, isNull: Boolean): Float');
                        gqlInputFields.push(column.databaseName + ' : Float');
                        break;
                    case 'int':
                    case 'integer':
                    case 'smallint':
                        gqlFields.push(column.databaseName +
                            ' (equal: Int, notEqual: Int, in: [Int], notIn: [Int], greaterThan: Int, lesserThan: Int, greaterEqual: Int, lesserEqual: Int, isNull: Boolean): Int');
                        gqlInputFields.push(column.databaseName + ' : Int');
                        break;
                    case 'uuid':
                        gqlFields.push(column.databaseName +
                            ' (equal: UUID, notEqual: UUID, in: [UUID], notIn: [UUID], isNull: Boolean): UUID');
                        gqlInputFields.push(column.databaseName + ' : UUID');
                        break;
                    case 'timestamptz':
                        gqlFields.push(column.databaseName +
                            ' (greaterThan: DateTime, lesserThan: DateTime, greaterEqual: DateTime, lesserEqual: DateTime, isNull: Boolean): DateTime');
                        gqlInputFields.push(column.databaseName + ' : DateTime');
                        break;
                    case 'date':
                        gqlFields.push(column.databaseName +
                            ' (greaterThan: Date, lesserThan: Date, greaterEqual: Date, lesserEqual: Date, isNull: Boolean): Date');
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
                        gqlFields.push(`${column.propertyName} (order_by: [String!]): [${column.inverseEntityMetadata.name}]`);
                        gqlInputFields.push(`${column.propertyName} : [${column.inverseEntityMetadata.name}Input]`);
                        break;
                    default:
                        gqlFields.push(`${column.propertyName}: ${column.inverseEntityMetadata.name}`);
                        gqlInputFields.push(`${column.propertyName} : ${column.inverseEntityMetadata.name}Input`);
                }
            });
            const schema = `\ntype ` +
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
            (0, fs_1.appendFileSync)('generated.graphql', schema);
        }
        async findAll(page = 1, limit = 10, order_by, info, context) {
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
            };
            if (order_by === null || order_by === void 0 ? void 0 : order_by.length) {
                order_by.forEach((col) => {
                    if (col.startsWith('-')) {
                        options.order[col.replace('-', '')] = 'DESC';
                    }
                    else {
                        options.order[col] = 'ASC';
                    }
                });
            }
            options = this.generateFilters(info.fieldNodes[0].selectionSet, options, info.variableValues);
            return (await userRepository.find(options));
        }
        generateFilters(selectionSet, options, variables) {
            selectionSet.selections.forEach((field) => {
                if (this.exclude_select_columns.has(field.name.value) || field.name.value == "__typename") {
                    return;
                }
                if (field.selectionSet) {
                    options.relations[field.name.value] = true;
                    field.arguments.forEach((argument) => {
                        switch (argument.name.value) {
                            case 'order_by':
                                options.order[field.name.value] = {};
                                if (argument.value.values) {
                                    argument.value.values.forEach((col) => {
                                        if (col.value.startsWith('-')) {
                                            options.order[field.name.value][col.value.replace('-', '')] = 'DESC';
                                        }
                                        else {
                                            options.order[field.name.value][col.value] = 'ASC';
                                        }
                                    });
                                }
                                else {
                                    if (variables[argument.value.name.value].startsWith('-')) {
                                        options.order[field.name.value][variables[argument.value.name.value].replace('-', '')] = 'DESC';
                                    }
                                    else {
                                        options.order[field.name.value][variables[argument.value.name.value]] =
                                            'ASC';
                                    }
                                }
                                break;
                            default:
                                console.log(`un implemented filter on field '${field.name.value}' > filter > '${argument.name.value}' value > '${variables[argument.value.name.value]}'`);
                        }
                    });
                    const childOptions = this.generateFilters(field.selectionSet, {
                        relations: {},
                        where: {},
                        select: {},
                        order: {},
                    }, variables);
                    options.select[field.name.value] = childOptions.select;
                    options.relations[field.name.value] = childOptions.relations;
                    if (Object.keys(childOptions.where).length) {
                        options.where[field.name.value] = childOptions.where;
                    }
                }
                else {
                    options.select[field.name.value] = true;
                    field.arguments.forEach((argument) => {
                        switch (argument.name.value) {
                            case 'equal':
                                options.where[field.name.value] = variables[argument.value.name.value];
                                break;
                            case 'notEqual':
                                options.where[field.name.value] = (0, typeorm_1.Not)(variables[argument.value.name.value]);
                                break;
                            case 'greaterThan':
                                options.where[field.name.value] = (0, typeorm_1.MoreThan)(variables[argument.value.name.value]);
                                break;
                            case 'lesserThan':
                                options.where[field.name.value] = (0, typeorm_1.LessThan)(variables[argument.value.name.value]);
                                break;
                            case 'greaterEqual':
                                options.where[field.name.value] = (0, typeorm_1.MoreThanOrEqual)(variables[argument.value.name.value]);
                                break;
                            case 'lesserEqual':
                                options.where[field.name.value] = (0, typeorm_1.LessThanOrEqual)(variables[argument.value.name.value]);
                                break;
                            case 'contains':
                                options.where[field.name.value] = (0, typeorm_1.ILike)(`%${variables[argument.value.name.value]}%`);
                                break;
                            case 'startsWith':
                                options.where[field.name.value] = (0, typeorm_1.ILike)(`${variables[argument.value.name.value]}%`);
                                break;
                            case 'in':
                                options.where[field.name.value] = (0, typeorm_1.In)(variables[argument.value.name.value]);
                                break;
                            case 'notIn':
                                options.where[field.name.value] = (0, typeorm_1.Not)((0, typeorm_1.In)(variables[argument.value.name.value]));
                                break;
                            case 'isNull':
                                if (variables[argument.value.name.value] == true) {
                                    options.where[field.name.value] = (0, typeorm_1.IsNull)();
                                }
                                else {
                                    options.where[field.name.value] = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
                                }
                                break;
                            default:
                                console.log(`un implemented filter on field '${field.name.value}' > filter > '${argument.name.value}' value > '${variables[argument.value.name.value]}'`);
                        }
                    });
                }
            });
            return options;
        }
        async findOne(id, allColumns = false, context, info) {
            let user;
            if (this.auth_required) {
                try {
                    user = await this.getCurrentUser(context);
                }
                catch (error) {
                    if (!this.open_to_all) {
                        throw new common_1.ForbiddenException(error.message);
                    }
                }
            }
            const findOptions = await this.hasReadPermission(this.generateFilters(info.fieldNodes[0].selectionSet, {
                order: {},
                where: { id: id },
                relations: {},
                select: {},
            }, info.variableValues), user);
            const obj = await this.dataSource
                .getRepository(model)
                .findOne(findOptions);
            if (!obj) {
                throw new common_1.NotFoundException();
            }
            return obj;
        }
        async delete(context, info) {
            const user = this.auth_required
                ? await this.getCurrentUser(context)
                : null;
            let options = {
                relations: {},
                where: {},
                select: {},
                order: {},
            };
            options = this.generateFilters(info.fieldNodes[0].selectionSet, options, info.variableValues);
            options = await this.hasDeletePermission(options, user);
            await this.dataSource.getRepository(model).delete(options);
            return true;
        }
        async update(id, input, context, info) {
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
            await this.dataSource.getRepository(model).save(Object.assign(Object.assign({}, (await this.hasUpdatePermission(await this.findOne(id, true, context, info), input, user))), { id: id }));
            return await this.findOne(id, false, context, info);
        }
        async addRow(row, context, info) {
            return (await this.addMultipleRows([row], context, info))[0];
        }
        async addMultipleRows(rows, context, info) {
            const user = this.auth_required
                ? await this.getCurrentUser(context)
                : null;
            const a = await this.dataSource
                .createQueryBuilder()
                .insert()
                .into(model)
                .values(await this.hasAddPermission(rows, user))
                .execute();
            return a.generatedMaps;
        }
        async isValidJWT(context) {
            var _a, _b, _c;
            const [type, token] = (_c = (_b = (_a = context.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')) !== null && _c !== void 0 ? _c : [];
            if (type !== 'Bearer' || !token) {
                throw new common_1.ForbiddenException('Bearer Token not found in header authorization');
            }
            try {
                const jwtService = new jwt_1.JwtService();
                const payload = await jwtService.verifyAsync(token, {
                    secret: process.env.JWT_SECRET,
                });
                return payload.sub;
            }
            catch (_d) {
                throw new common_1.ForbiddenException('Bearer Token error');
            }
        }
        async getCurrentUser(context) {
            const user = await this.dataSource
                .getRepository(admin_models_1.UserAdmin)
                .createQueryBuilder('user')
                .where('user.id = :id', { id: await this.isValidJWT(context) })
                .getOne();
            if (!user) {
                throw new common_1.ForbiddenException('Invalid JWT User');
            }
            return user;
        }
    };
    __decorate([
        (0, graphql_1.Query)((type) => [model], { name: `list${model.name}` }),
        __param(0, (0, graphql_1.Args)('page')),
        __param(1, (0, graphql_1.Args)('limit')),
        __param(2, (0, graphql_1.Args)('order_by')),
        __param(3, (0, graphql_1.Info)()),
        __param(4, (0, graphql_1.Context)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Array, Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "findAll", null);
    __decorate([
        (0, graphql_1.Query)((type) => model, { name: `get${model.name}` }),
        __param(0, (0, graphql_1.Args)('id')),
        __param(2, (0, graphql_1.Context)()),
        __param(3, (0, graphql_1.Info)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "findOne", null);
    __decorate([
        (0, graphql_1.Mutation)((returns) => Boolean, { name: `delete${model.name}` }),
        __param(0, (0, graphql_1.Context)()),
        __param(1, (0, graphql_1.Info)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "delete", null);
    __decorate([
        (0, graphql_1.Mutation)((returns) => Boolean, { name: `update${model.name}` }),
        __param(0, (0, graphql_1.Args)('id')),
        __param(1, (0, graphql_1.Args)('input')),
        __param(2, (0, graphql_1.Context)()),
        __param(3, (0, graphql_1.Info)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "update", null);
    __decorate([
        (0, graphql_1.Mutation)((returns) => model, { name: `add${model.name}` }),
        __param(0, (0, graphql_1.Args)('row', { type: () => model })),
        __param(1, (0, graphql_1.Context)()),
        __param(2, (0, graphql_1.Info)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "addRow", null);
    __decorate([
        (0, graphql_1.Mutation)((returns) => model, { name: `addMultiple${model.name}` }),
        __param(0, (0, graphql_1.Args)('rows', { type: () => [model] })),
        __param(1, (0, graphql_1.Context)()),
        __param(2, (0, graphql_1.Info)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object, Object]),
        __metadata("design:returntype", Promise)
    ], BaseAdminResolverHost.prototype, "addMultipleRows", null);
    BaseAdminResolverHost = __decorate([
        (0, graphql_1.Resolver)({ isAbstract: true }),
        __metadata("design:paramtypes", [typeorm_1.DataSource, Object, Object, Object, Object])
    ], BaseAdminResolverHost);
    return BaseAdminResolverHost;
}
exports.BaseAdminResolver = BaseAdminResolver;
//# sourceMappingURL=base.admin.resolver.js.map
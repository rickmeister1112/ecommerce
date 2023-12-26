"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUuidScalar = void 0;
const type_1 = require("graphql/type");
const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validate(uuid) {
    if (typeof uuid !== 'string' || !regex.test(uuid)) {
        throw new Error('invalid uuid');
    }
    return uuid;
}
exports.CustomUuidScalar = new type_1.GraphQLScalarType({
    name: 'UUID',
    description: 'A simple UUID parser',
    serialize: (value) => validate(value),
    parseValue: (value) => validate(value),
    parseLiteral: (ast) => validate(ast.value),
});
//# sourceMappingURL=uuid.js.map
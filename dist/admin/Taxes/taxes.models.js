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
exports.Tax = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("../utils/base.model");
let Tax = class Tax extends base_model_1.BaseModel {
};
exports.Tax = Tax;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], Tax.prototype, "tax_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 2 }),
    __metadata("design:type", Number)
], Tax.prototype, "tax_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Tax.prototype, "tax_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Tax.prototype, "CGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Tax.prototype, "SGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Tax.prototype, "IGST", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0.00 }),
    __metadata("design:type", Number)
], Tax.prototype, "CESS", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Tax.prototype, "zoho_tax_id", void 0);
exports.Tax = Tax = __decorate([
    (0, typeorm_1.Entity)()
], Tax);
//# sourceMappingURL=taxes.models.js.map
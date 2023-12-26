"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerAdminModule = void 0;
const common_1 = require("@nestjs/common");
const banner_resolvers_1 = require("./banner.resolvers");
let BannerAdminModule = class BannerAdminModule {
};
exports.BannerAdminModule = BannerAdminModule;
exports.BannerAdminModule = BannerAdminModule = __decorate([
    (0, common_1.Module)({
        providers: [
            banner_resolvers_1.BannerResolver
        ],
        exports: [
            banner_resolvers_1.BannerResolver
        ]
    })
], BannerAdminModule);
//# sourceMappingURL=banner.module.js.map
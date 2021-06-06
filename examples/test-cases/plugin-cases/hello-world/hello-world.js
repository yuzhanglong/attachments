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
const serendipity_core_1 = require("@attachments/serendipity-core");
let HelloWorldPlugin = class HelloWorldPlugin {
    constructor(options) {
        this.name = options.name;
        this.age = options.age;
    }
    inquiry() {
        return [
            {
                type: 'confirm',
                name: 'loveNode',
                message: '你喜欢 node.js 吗',
                default: true
            }
        ];
    }
    async tryConstruction(options) {
        console.log(options.inquiryResult);
        if (options.inquiryResult.loveNode) {
            console.log('用户喜欢 node.js!');
        }
        else {
            console.log('用户不喜欢 node.js!');
        }
        await options.renderTemplate('hello-template');
        options.appManager.packageManager.mergeIntoCurrent({
            dependencies: {
                axios: 'latest'
            }
        });
    }
};
__decorate([
    serendipity_core_1.Inquiry(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HelloWorldPlugin.prototype, "inquiry", null);
__decorate([
    serendipity_core_1.Construction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HelloWorldPlugin.prototype, "tryConstruction", null);
HelloWorldPlugin = __decorate([
    serendipity_core_1.SerendipityPlugin('HelloWorldPlugin'),
    __metadata("design:paramtypes", [Object])
], HelloWorldPlugin);
exports.default = HelloWorldPlugin;
//# sourceMappingURL=hello-world.js.map
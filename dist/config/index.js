"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const production_config_1 = __importDefault(require("./production.config"));
const development_config_1 = __importDefault(require("./development.config"));
const { NODE_ENV } = process.env;
const config = NODE_ENV === 'production' ? production_config_1.default : development_config_1.default;
exports.default = config;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonMiddleware = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const http_error_handler_1 = __importDefault(require("@middy/http-error-handler"));
const http_event_normalizer_1 = __importDefault(require("@middy/http-event-normalizer"));
exports.commonMiddleware = (handler) => core_1.default(handler).use([
    http_json_body_parser_1.default(),
    http_error_handler_1.default(),
    http_event_normalizer_1.default(),
]);

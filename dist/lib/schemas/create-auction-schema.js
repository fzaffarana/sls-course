"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
            },
            required: ['title'],
        },
    },
    required: ['body'],
};

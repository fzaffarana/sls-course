"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    properties: {
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                },
            },
            required: ['amount'],
        },
    },
    required: ['body'],
};

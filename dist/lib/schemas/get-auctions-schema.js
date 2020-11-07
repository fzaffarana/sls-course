"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'],
                    default: 'OPEN',
                },
            },
        },
    },
    required: ['queryStringParameters'],
};

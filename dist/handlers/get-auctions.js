"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const http_errors_1 = __importDefault(require("http-errors"));
const validator_1 = __importDefault(require("@middy/validator"));
const common_middleware_1 = require("../lib/common-middleware");
const get_auctions_schema_1 = __importDefault(require("../lib/schemas/get-auctions-schema"));
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const getAuctions = async (event) => {
    let auctions;
    const { status } = event.queryStringParameters;
    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': status,
            },
            ExpressionAttributeNames: {
                '#status': 'status',
            },
        };
        const result = await dynamodb.query(params).promise();
        auctions = result.Items;
    }
    catch (error) {
        console.error(error);
        throw new http_errors_1.default.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
};
exports.handler = common_middleware_1.commonMiddleware(getAuctions).use(validator_1.default({ inputSchema: get_auctions_schema_1.default }));

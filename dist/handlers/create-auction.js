"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const http_errors_1 = __importDefault(require("http-errors"));
const validator_1 = __importDefault(require("@middy/validator"));
const common_middleware_1 = require("../lib/common-middleware");
const create_auction_schema_1 = __importDefault(require("../lib/schemas/create-auction-schema"));
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const createAuction = async (event) => {
    const { title } = event.body;
    const now = new Date();
    const endDate = new Date(now.getTime());
    endDate.setHours(endDate.getHours() + 1);
    const auction = {
        id: uuid_1.v4(),
        status: 'OPEN',
        title,
        price: 999,
        cratedAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
        },
    };
    try {
        await dynamodb
            .put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction,
        })
            .promise();
    }
    catch (error) {
        console.error(error);
        throw new http_errors_1.default.InternalServerError(error);
    }
    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
};
exports.handler = common_middleware_1.commonMiddleware(createAuction).use(validator_1.default({ inputSchema: create_auction_schema_1.default }));

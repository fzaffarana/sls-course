"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.getAuctionById = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const http_errors_1 = __importDefault(require("http-errors"));
const common_middleware_1 = require("../lib/common-middleware");
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
exports.getAuctionById = async (id) => {
    let auction;
    try {
        const result = await dynamodb
            .get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        })
            .promise();
        auction = result.Item;
    }
    catch (error) {
        console.error(error);
        throw new http_errors_1.default.InternalServerError(error);
    }
    if (!auction) {
        throw new http_errors_1.default.NotFound(`Auction with ID "${id}" not found.`);
    }
    return auction;
};
const getAuction = async (event) => {
    const { id } = event.pathParameters || {};
    const auction = await exports.getAuctionById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
};
exports.handler = common_middleware_1.commonMiddleware(getAuction);

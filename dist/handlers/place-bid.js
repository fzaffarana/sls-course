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
const get_auction_1 = require("./get-auction");
const place_bid_schema_1 = __importDefault(require("../lib/schemas/place-bid-schema"));
const dynamodb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const placeBid = async (event) => {
    const { amount } = event.body;
    const { id } = event.pathParameters || {};
    const auction = await get_auction_1.getAuctionById(id);
    if (auction.status !== 'OPEN') {
        throw new http_errors_1.default.Forbidden('Your cannot bid on closed auctions');
    }
    if (amount <= auction.highestBid.amount) {
        throw new http_errors_1.default.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };
    let updatedAuction;
    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
    }
    catch (error) {
        console.error(error);
        throw new http_errors_1.default.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
};
exports.handler = common_middleware_1.commonMiddleware(placeBid).use(validator_1.default({ inputSchema: place_bid_schema_1.default }));

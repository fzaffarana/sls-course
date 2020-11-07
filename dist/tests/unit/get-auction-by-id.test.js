"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-expressions */
const chai_1 = require("chai");
const http_errors_1 = __importDefault(require("http-errors"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const development_config_1 = __importDefault(require("../../config/development.config"));
// AWS Setup
aws_sdk_1.default.config.update(development_config_1.default.aws);
const dynamoClient = new aws_sdk_1.default.DynamoDB({ apiVersion: '2012-08-10' });
const createTable = async (tableName) => {
    const params = {
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'S',
            },
        ],
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH',
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
        TableName: tableName,
        StreamSpecification: {
            StreamEnabled: false,
        },
    };
    return dynamoClient.createTable(params).promise();
};
const deleteTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };
    return dynamoClient.deleteTable(params).promise();
};
describe('Get Auction By Id - Unit Test', () => {
    before(async () => {
        const { tableName } = development_config_1.default.aws.dynamodb;
        process.env.AUCTIONS_TABLE_NAME = tableName;
        try {
            console.log(`Creating dynamo table: ${tableName}`);
            await createTable(tableName);
        }
        catch (error) {
            chai_1.expect(error).to.be.null;
        }
    });
    after(async () => {
        const { tableName } = development_config_1.default.aws.dynamodb;
        try {
            console.log(`Deleting dynamo table: ${tableName}`);
            await deleteTable(tableName);
        }
        catch (error) {
            chai_1.expect(error).to.be.null;
        }
    });
    it("should return an internal server error because item doesn't exist", async () => {
        const id = 'notExist';
        try {
            const { getAuctionById } = await Promise.resolve().then(() => __importStar(require('../../handlers/get-auction')));
            await getAuctionById(id);
        }
        catch (error) {
            chai_1.expect(error).instanceOf(http_errors_1.default.NotFound);
            chai_1.expect(error.message).to.eql(`Auction with ID "${id}" not found.`);
        }
    });
    it('should return 1234', async () => {
        chai_1.expect(1).to.eql(1);
    });
});

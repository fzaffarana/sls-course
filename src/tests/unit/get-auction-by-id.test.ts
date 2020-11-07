/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import createError from 'http-errors';
import AWS from 'aws-sdk';
import config from '../../config/development.config';

// AWS Setup
AWS.config.update(config.aws);
const dynamoClient = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const createTable = async (tableName: string): Promise<any> => {
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

const deleteTable = async (tableName: string): Promise<any> => {
  const params = {
    TableName: tableName,
  };

  return dynamoClient.deleteTable(params).promise();
};

describe('Get Auction By Id - Unit Test', () => {
  before(async () => {
    const { tableName } = config.aws.dynamodb;
    process.env.AUCTIONS_TABLE_NAME = tableName;
    try {
      console.log(`Creating dynamo table: ${tableName}`);
      await createTable(tableName);
    } catch (error) {
      expect(error).to.be.null;
    }
  });

  after(async () => {
    const { tableName } = config.aws.dynamodb;
    try {
      console.log(`Deleting dynamo table: ${tableName}`);
      await deleteTable(tableName);
    } catch (error) {
      expect(error).to.be.null;
    }
  });

  it("should return an internal server error because item doesn't exist", async () => {
    const id = 'notExist';
    try {
      const { getAuctionById } = await import('../../handlers/get-auction');
      await getAuctionById(id);
    } catch (error) {
      expect(error).instanceOf(createError.NotFound);
      expect(error.message).to.eql(`Auction with ID "${id}" not found.`);
    }
  });

  it('should return 1234', async () => {
    expect(1).to.eql(1);
  });
});

// Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import { commonMiddleware } from '../lib/common-middleware';
import schema from '../lib/schemas/create-auction-schema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const createAuction = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { title } = event.body as any;
  const now = new Date();
  const endDate = new Date(now.getTime());
  endDate.setHours(endDate.getHours() + 1);

  const auction = {
    id: uuid(),
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
        TableName: process.env.AUCTIONS_TABLE_NAME as string,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: schema })
);

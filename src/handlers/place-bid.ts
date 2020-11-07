// Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';
import { commonMiddleware } from '../lib/common-middleware';
import { getAuctionById } from './get-auction';
import schema from '../lib/schemas/place-bid-schema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { amount } = event.body as any;
  const { id } = event.pathParameters || {};

  const auction = await getAuctionById(id);

  if (auction.status !== 'OPEN') {
    throw new createError.Forbidden('Your cannot bid on closed auctions');
  }

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME as string,
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
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const handler = commonMiddleware(placeBid).use(validator({ inputSchema: schema }));

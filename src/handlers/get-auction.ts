// Modules
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda'
import AWS from 'aws-sdk';
import createError from 'http-errors';
import { commonMiddleware } from '../lib/common-middleware';

const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const getAuctionById = async (id: string): Promise<any> => {
  let auction;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME as string,
        Key: { id },
      })
      .promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found.`);
  }

  return auction;
};

const getAuction = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters || {};
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

export const handler = commonMiddleware(getAuction);

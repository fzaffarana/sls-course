// Modules
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import { ItemList } from 'aws-sdk/clients/dynamodb';
import validator from '@middy/validator';
import { commonMiddleware } from '../lib/common-middleware';
import schema from '../lib/schemas/get-auctions-schema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let auctions: ItemList | undefined;
  const { status } = event.queryStringParameters as any;

  try {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME as string,
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
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

export const handler = commonMiddleware(getAuctions).use(
  validator({ inputSchema: schema })
);

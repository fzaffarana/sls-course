import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const closeAuction = async (id: string) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME as string,
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const result = await dynamodb.update(params).promise();
  return result;
};

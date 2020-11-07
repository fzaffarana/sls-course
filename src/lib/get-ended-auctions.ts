import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const getEndedAuctions = async (): Promise<any> => {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME as string,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const result = await dynamodb.query(params).promise();
  return result.Items;
};

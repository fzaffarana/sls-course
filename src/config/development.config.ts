export default {
  aws: {
    dynamodb: {
      endpoint: 'http://localstack:4566',
      tableName: 'auctions-table-docker',
    },
    accessKeyId: 'foobar',
    secretAccessKey: 'foobar',
    region: 'us-east-1',
  },
};

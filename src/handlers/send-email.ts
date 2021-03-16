// Modules
import AWS from 'aws-sdk';
const ses = new AWS.SES({ region: 'eu-west-1' });

const sendEmail = async (event): Promise<void> => {
  const records = event.Records;
  for (const record of records) {
    try {
      const { toAddresses, subject, message } = JSON.parse(record.body);
      const params = {
        Destination: {
          ToAddresses: toAddresses,
        },
        Message: {
          Body: {
            Text: {
              Data: message,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        Source: 'fzaffarana@gmail.com',
      };
      await ses.sendEmail(params).promise();
    } catch (error) {
      console.error(error);
    }
  }
};

export const handler = sendEmail;

// Modules
import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'eu-west-1' });

const sendEmail = async (): Promise<void> => {
  const params = {
    Destination: {
      ToAddresses: ['fzaffarana@gmail.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hi!',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email',
      },
    },
    Source: 'fzaffarana@gmail.com',
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export const handler = sendEmail;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const commonMiddleware = (handler: APIGatewayProxyHandler) =>
  middy(handler).use([jsonBodyParser(), httpErrorHandler(), httpEventNormalizer()]);

import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createEvent(event, context) {
  let { name, venue, time, capacity } = event.body;

  let time_now = new Date();

  let newEvent = {
    id: uuid(),
    created_on: time_now.toISOString(),
    name,
    venue,
    time,
    capacity
  };

  try{
    await dynamodb.put({
      TableName: process.env.EVENTS_TABLE_NAME,
      Item: newEvent
    }).promise();
  }
  catch(error){
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(newEvent),
  };
}

export const handler = middy(createEvent)
                        .use(httpJsonBodyParser())
                        .use(httpEventNormalizer())
                        .use(httpErrorHandler());



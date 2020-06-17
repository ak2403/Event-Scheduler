import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEvents(event, context) {
    let events;

    try {
        const results = await dynamodb.scan({
            TableName: process.env.EVENTS_TABLE_NAME,
        }).promise();

        events = results.Items;
    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(events)
    };
}

export const handler = middy(getEvents)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());



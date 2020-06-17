import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEvent(event, context) {
    let singleEvent;

    let { id } = event.pathParameters;

    try {
        const result = await dynamodb.get({
            TableName: process.env.EVENTS_TABLE_NAME,
            Key: {
                id
            }
        }).promise();

        singleEvent = result.Item;
    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }

    if (!singleEvent) {
        throw new createError.NotFound("Not Found");
    }

    return {
        statusCode: 200,
        body: JSON.stringify(singleEvent)
    };
}

export const handler = middy(getEvent)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());



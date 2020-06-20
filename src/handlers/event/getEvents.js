import AWS from 'aws-sdk';
// import validator from '@middy/validator';
import commonMiddleware from '../../lib/commonMiddleware';
// import getEventsSchema from '../schema/getEventsSchema';
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

export const handler = commonMiddleware(getEvents);
// .use(validator({ inputSchema: getEventsSchema, useDefaults: true }));



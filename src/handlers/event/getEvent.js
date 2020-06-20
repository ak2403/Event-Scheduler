import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
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

export const handler = commonMiddleware(getEvent);



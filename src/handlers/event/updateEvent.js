import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

let options = {}
let TABLE_NAME = process.env.EVENTS_TABLE_NAME;

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
    TABLE_NAME = "EventsTable-dev"
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function updateEvent(event, context) {
    let { id } = event.pathParameters;
    let { name } = event.body;
    let updatedEvent;

    try {
        const updatingParams = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set #name = :name',
            ExpressionAttributeValues: {
                ':name': name
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }

        const updateResult = await dynamodb.update(updatingParams).promise()
        updatedEvent = updateResult.Attributes;
    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(updatedEvent)
    };
}

export const handler = commonMiddleware(updateEvent)
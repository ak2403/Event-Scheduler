import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function filterEvent(event, context) {
    let filteredEvents;
    let { status } = event.queryStringParameters;

    try {
        const params = {
            TableName: process.env.EVENTS_TABLE_NAME,
            IndexName: 'statusFilter',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeValues: {
                ':status': status
            },
            ExpressionAttributeNames: {
                '#status': 'status'
            }
        }
        
        const result = await dynamodb.query(params).promise();

        filteredEvents = result.Items;
    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(filteredEvents)
    };
}

export const handler = commonMiddleware(filterEvent);



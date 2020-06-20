import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator'

let options = {}

let AVAILABILITY_TABLE_NAME = process.env.AVAILABILITY_TABLE_NAME;
// let AVAILABILITY_TABLE_NAME = process.env.AVAILABILITY_TABLE_NAME;

if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    }
    AVAILABILITY_TABLE_NAME = "AvailabilityTable-dev"
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function createBooking(event, context) {
    let { id } = event.pathParameters
    let { booking_name, date_of_booking, day_of_booking, book_time } = event.body;

    try {
        let queryParams = {
            TableName: AVAILABILITY_TABLE_NAME,
            KeyConditionExpression: "#event_id = :id",
            ExpressionAttributeNames: {
                "#event_id": "event_id"
            },
            ExpressionAttributeValues: {
                ":id": {
                    'S': id
                }
            }
        };

        const getEvent = await dynamodb.query(queryParams).promise();

        console.log(getEvent)

    }
    catch (error) {
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        // body: JSON.stringify(newEvent)
    };
}

export const handler = commonMiddleware(createBooking)
    // .use(validator({ inputSchema: createEventSchema, useDefaults: true }));
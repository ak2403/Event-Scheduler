import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator'
import createEventSchema from '../../schema/createEventSchema'
import createAvailability from '../availability/createAvailability'

let options = {}
let TABLE_NAME = process.env.EVENTS_TABLE_NAME;

if(process.env.IS_OFFLINE){
  options= {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
  TABLE_NAME = "EventsTable-dev"
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function createEvent(event, context) {
  let { name, venue, capacity, status, features, isDailyAvailable, isWeekDayAvailable,
    isWeekEndAvailable, available_time } = event.body;

  let time_now = new Date();

  let newEvent = {
    id: uuid(),
    created_on: time_now.toISOString(),
    name,
    venue,
    capacity,
    features,
    status,
    updated_on: time_now.toISOString(),
  };

  try {
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: newEvent
    }).promise();

    await createAvailability({
      event_id: newEvent.id,
      availableType: {
        isDailyAvailable,
        isWeekDayAvailable,
        isWeekEndAvailable
      },
      available_time,
      booked_id: []
    })
  }
  catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(newEvent)
  };
}

export const handler = commonMiddleware(createEvent)
.use(validator({ inputSchema: createEventSchema, useDefaults: true }));
import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createEvent(event, context) {
  let { name, venue, time, capacity } = JSON.parse(event.body);

  let time_now = new Date();

  let newEvent = {
    id: uuid(),
    created_on: time_now.toISOString(),
    name,
    venue,
    time,
    capacity
  };

  await dynamodb.put({
    TableName: 'EventsTable',
    Item: newEvent
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(newEvent),
  };
}

export const handler = createEvent;



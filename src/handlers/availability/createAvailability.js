import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../../lib/commonMiddleware';
import createError from 'http-errors';

let options = {}
let TABLE_NAME = process.env.AVAILABILITY_TABLE_NAME;

if(process.env.IS_OFFLINE){
  options= {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
  TABLE_NAME = "AvailabilityTable-dev"
}

const dynamodb = new AWS.DynamoDB.DocumentClient(options);

async function createAvailability(availabilityProps) {
  availabilityProps = {
    ...availabilityProps,
    id: uuid()
  }

  try {
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: availabilityProps
    }).promise();
  }
  catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201
  };
}

export default createAvailability;
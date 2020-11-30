import {createLogger} from '../../utils/logger';
import {deleteContact} from '../../bl/contact';
import 'source-map-support/register';

import {
 APIGatewayProxyResult,
 APIGatewayProxyEvent,
 APIGatewayProxyHandler
 } from 'aws-lambda';

const logger = createLogger('utils');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a Contact item by id
  try{
    await deleteContact(event);
	logger.info('inside deleteContact handler');
    return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  };
  } catch(err){
    console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: ''
          };
      }
}

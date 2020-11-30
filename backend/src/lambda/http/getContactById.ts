import {createLogger} from '../../utils/logger';
import {getContactById} from '../../bl/contact';
import 'source-map-support/register';

import {
 APIGatewayProxyResult,
 APIGatewayProxyEvent,
 APIGatewayProxyHandler
 } from 'aws-lambda';

const logger = createLogger('utils');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Fetch a Contact item by id
  try{
    const result = await getContactById(event);
	console.log('Result from getContactById http lambda:', result);
	logger.info('inside getContactById handler');
	if(result){
		return {
		statusCode: 200,
		headers: {
		  'Access-Control-Allow-Origin': '*',
		  'Access-Control-Allow-Credentials': true
		},
		body: JSON.stringify(result)
		};
	}
  } catch(err){
    console.error("Unable to fetch from getContactById. Error JSON:", JSON.stringify(err, null, 2));
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

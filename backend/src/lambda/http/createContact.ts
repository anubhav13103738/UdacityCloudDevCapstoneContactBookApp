import {createLogger} from '../../utils/logger';
import { 
 APIGatewayProxyHandler,
 APIGatewayProxyEvent,
 APIGatewayProxyResult
 } from 'aws-lambda';
 
import 'source-map-support/register';

// import { CreateContactRequest } from '../../requests/CreateContactRequest';
import {createContact} from '../../bl/contact';

const logger = createLogger('utils');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const result = await createContact(event);
  logger.info(result);
  console.log(result);

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    })
  };
}

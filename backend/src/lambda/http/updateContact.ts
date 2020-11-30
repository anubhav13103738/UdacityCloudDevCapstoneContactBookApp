import {createLogger} from '../../utils/logger';
import {
 APIGatewayProxyResult,
 APIGatewayProxyEvent,
 APIGatewayProxyHandler
 } from 'aws-lambda';
import {updateContact} from '../../bl/contact';
import 'source-map-support/register';


const logger = createLogger('utils');
// import { UpdateContactRequest } from '../../requests/UpdateContactRequest';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const contactId = event.pathParameters.contactId;
  // const updatedContact: UpdateContactRequest = JSON.parse(event.body);

  // TODO: Update a Contact with the provided id using values in the "updatedContact" object
  logger.info("updating contact item...");
  await updateContact(event);
  // return undefined
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: " "
  };
}

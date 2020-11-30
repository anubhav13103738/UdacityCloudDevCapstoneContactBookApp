import {fetchAllContacts} from '../../bl/contact';
import {createLogger} from '../../utils/logger';
import {
 APIGatewayProxyResult,
 APIGatewayProxyEvent,
 APIGatewayProxyHandler
 } from 'aws-lambda';
import 'source-map-support/register';
//import * as AWS  from 'aws-sdk';

const logger = createLogger('utils');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all Contacts for a current user
  const result = await fetchAllContacts(event);
  logger.info("contacts from fetchAllContacts:",result);
  if (result) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items)
    };
  }

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  };
}

import {createLogger} from '../../utils/logger';
import * as uuid from 'uuid';
import 'source-map-support/register';
import {addAttachment, getPresignedS3Url} from '../../bl/contact';
import {
 APIGatewayProxyResult,
 APIGatewayProxyEvent,
 APIGatewayProxyHandler
 } from 'aws-lambda';
 
const logger = createLogger('utils');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const contactId = event.pathParameters.contactId;
  const imageId:uuid = uuid.v4();
  // TODO: Return a presigned URL to upload a file for a Contact with the provided id
  const presignedS3Url = await getPresignedS3Url(imageId);
  const imageUrl = await addAttachment(event, imageId);
  logger.info("presignedS3Url as in generateuploadurl:",presignedS3Url);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        uploadUrl: presignedS3Url,
        imageUrl: imageUrl
    })
  };
}

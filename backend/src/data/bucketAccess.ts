import * as AWS  from 'aws-sdk';
import * as uuid from 'uuid';
import {createLogger} from '../utils/logger';
import * as AWSXRay from 'aws-xray-sdk';

//import { ContactItem } from '../models/ContactItem';
//import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import {parseUserId } from '../auth/utils';

const logger = createLogger('utils');
const XAWS = AWSXRay.captureAWS(AWS);


export class S3BucketAccess {

  constructor(
    private s3 = new XAWS.S3({
        signatureVersion: 'v4' 
      }),
    private imagesBucketName = process.env.IMAGES_S3_BUCKET){
  }

  getImageUrl(imageId){
      return `https://${this.imagesBucketName}.s3.amazonaws.com/${imageId}`;
  }
  
  getPresignedS3Url(imageId: uuid) {
	  logger.info('getPresignedUrl function on backend is running');
    const presignedS3Url = this.s3.getSignedUrl('putObject', { // The URL will allow to perform the PUT operation
        Bucket: this.imagesBucketName, // Name of an S3 bucket
        Key: imageId, // id of an object this URL allows access to
        Expires: '600'  // A URL is only valid for 10 minutes
      });
	  logger.info('presigned url wait finished....');
      console.log("generated presigned url:", presignedS3Url);
    return presignedS3Url;
  }
}

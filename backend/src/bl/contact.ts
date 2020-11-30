import {createLogger} from '../utils/logger';
import {S3BucketAccess} from '../data/bucketAccess';
import * as uuid from 'uuid';
import {getUserId} from '../lambda/utils';
import {ContactItem} from '../models/ContactItem';
import {CreateContactRequest} from '../requests/CreateContactRequest';
import {ContactAccess} from '../data/contactAccess';

//import {parseUserId} from '../../src/auth/utils';
//import { parseUserId } from '../auth/utils';

const logger = createLogger('utils');
const s3BucketAccess = new S3BucketAccess();
const contactAccess = new ContactAccess();
const contactsTable = process.env.CONTACTS_TABLE;

export async function getContactById(event){
	logger.info('getContactById function on backend is running');
  const contactId = event.pathParameters.contactId;
  return await contactAccess.getContactById(contactId);
}

export async function deleteContact(event){
	logger.info('deleteContact function on backend is running');
  const contactId = event.pathParameters.contactId;
  return await contactAccess.deleteContact(contactId);
}

export async function updateContact(event){
	logger.info('updateContact function on backend is running');
  const contactId = event.pathParameters.contactId;
  const updatedContact = JSON.parse(event.body);
  console.log('updatedContact:', updatedContact);
  const updatedItem = {
    TableName: contactsTable,
    Key: {
      "contactId": contactId
    },
	UpdateExpression: "set #n = :r, address=:p, #c=:c, contacted=:a",
	ExpressionAttributeValues: {
		":r": updatedContact.name,
		":p": updatedContact.address,
		":c": updatedContact.contactNumber,
		":a": updatedContact.contacted
	},
	ExpressionAttributeNames: {
		"#n": "name",
		"#c": "contactNumber"
	},
	ReturnValues: "UPDATED_NEW"
  }
  console.log('updatedContact:', updatedContact);
  console.log('updatedItem:', updatedItem);
  // await contactAccess.updateContact(updatedItem)
  await contactAccess.updateContact(updatedItem);
  return updatedItem;
}

export async function addAttachment(event,imageId){
	logger.info('addAttachment function on backend is running');
  logger.info("imageid in add Attachment:", imageId);
  const contactId = event.pathParameters.contactId;
  const imageUrl = s3BucketAccess.getImageUrl(imageId);
  console.log("image url:", imageUrl);
  const updatedContactItem = {
    TableName: contactsTable,
    Key: {
      "contactId": contactId
    },
    UpdateExpression: `set attachmentUrl = :r`,
    ExpressionAttributeValues:{
        ":r":imageUrl
    },
    ReturnValues:"UPDATED_NEW"
  }
  console.log("contact table updated will be:", updatedContactItem);

  await contactAccess.updateContact(updatedContactItem);
  return imageUrl;
}

export async function createContact(event): Promise<ContactItem> {
	logger.info('createContact function on backend is running');
  const contactId = uuid.v4();
  const userId = getUserId(event);
  const newContact: CreateContactRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const newItem = {
    contactId: contactId,
    userId: userId, // May use just "userId,"
    contacted: false,
    ...newContact
  };

  return await contactAccess.createContact(newItem);
}

export async function getPresignedS3Url(imageId:uuid){
	logger.info('getPresignedS3Url function on backend is running');
  console.log("image id in getpresigned url:", imageId);
  const presignedS3Url = s3BucketAccess.getPresignedS3Url(imageId);
  console.log("presigned url:", presignedS3Url);

  return presignedS3Url;
}

export async function fetchAllContacts(event) {
	logger.info('fetchAllContacts function on backend is running');
  const userAuthId = getUserId(event);
  return await contactAccess.fetchAllContacts(userAuthId);
}




import {createLogger} from '../utils/logger';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import * as AWSXRay from 'aws-xray-sdk';
import * as AWS  from 'aws-sdk';
// import {parseUserId} from '../auth/utils';
//import {ContactItem} from '../models/ContactItem';


const logger = createLogger('utils');
const XAWS = AWSXRay.captureAWS(AWS);


export class ContactAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
	private readonly userIdIndex = process.env.USER_ID_INDEX,
    private readonly contactsTable = process.env.CONTACTS_TABLE){
  }
  
  async getContactById(contactId){
	  logger.info('getContactById function on backend is running');
    var contactItem = {
      TableName: this.contactsTable,
      Key:{
          "contactId": contactId,
      }
    }
    const result = await this.docClient.get(contactItem).promise();
	console.log('Result from getContactById contactAccess lambda:', result);
	return result;
  }
  
  async deleteContact(contactId){
	  logger.info('deleteContact function on backend is running');
    var contactItem = {
      TableName: this.contactsTable,
      Key:{
          "contactId": contactId,
      }
    }
    await this.docClient.delete(contactItem).promise();
  }
  
  async createContact(newItem){
	  logger.info('createContact function on backend is running');
    await this.docClient.put({
      TableName: this.contactsTable,
      Item: newItem
    }).promise();
    return newItem;
  }
  
  async updateContact(updatedContactItem){
	  logger.info('updateContact function on backend is running');
    await this.docClient.update(updatedContactItem).promise();
  }

  async fetchAllContacts(userId) {
	  logger.info('fetchAllContacts function on backend is running');
    const result = await this.docClient.query({
      TableName : this.contactsTable,  
      IndexName : this.userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise();
    return result;
  }
}

function createDynamoDBClient() {
    logger.info('Creating Contacts DynamoDB Client...');
    return new XAWS.DynamoDB.DocumentClient();
   }
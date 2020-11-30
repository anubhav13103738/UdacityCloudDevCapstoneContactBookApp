import { Contact } from '../types/Contact';
import { CreateContactRequest } from '../types/CreateContactRequest';
import { apiEndpoint } from '../config';
import { UpdateContactRequest } from '../types/UpdateContactRequest';
import Axios from 'axios';



export async function createContact(
  idToken: string,
  newContact: CreateContactRequest
): Promise<Contact> {
	
  console.log('Create contact function is hit');
  const response = await Axios.post(`${apiEndpoint}/contacts`,  JSON.stringify(newContact), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
  console.log('After creating new contact, response:', response);
  console.log('After creating new contact, response.data:',response.data);
  console.log('After creating new contact, response.data.result:',response.data.result);
  return response.data.result;
}

export async function deleteContact(
  idToken: string,
  contactId: string
): Promise<void> {
	
	console.log('Delete contact function is hit');
  await Axios.delete(`${apiEndpoint}/contacts/${contactId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
  
}

export async function getContacts(idToken: string): Promise<Contact[]> {
  
  console.log('Getting all contacts...');
  const response = await Axios.get(`${apiEndpoint}/contacts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  });
  console.log('Fetched Contacts:', response.data);
  return response.data;
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
	console.log('Upload file function is hit');
  await Axios.put(uploadUrl, file);
}

export async function patchContact(
  idToken: string,
  contactId: string,
  updatedContact: UpdateContactRequest
): Promise<void> {
	
  console.log('Patch contact function is hit:', updatedContact);
  console.log('Patch contact function is hit:', contactId);
  await Axios.put(`${apiEndpoint}/contacts/${contactId}`, JSON.stringify(updatedContact), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
}

export async function getUploadUrl(
  idToken: string,
  contactId: string
): Promise<string> {
	
	console.log('get upload url function is hit');
  const response = await Axios.post(`${apiEndpoint}/contacts/${contactId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
  return response.data.uploadUrl;
}



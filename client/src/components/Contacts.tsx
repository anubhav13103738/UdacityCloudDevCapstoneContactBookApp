import * as React from 'react';
import update from 'immutability-helper';
import dateFormat from 'dateformat';
import {History} from 'history';
import {
  Icon,
  Button,
  Grid,
  Divider,
  Checkbox,
  Header,
  Image,
  Loader,
  Input
} from 'semantic-ui-react';

import Auth from '../auth/Auth';
import {patchContact, getContacts, deleteContact, createContact} from '../api/contacts-api';
import {Contact} from '../types/Contact';

interface ContactsState {
  contacts: Contact[]
  newContactName: string
  newContactAddress: string
  newContactNumber: number
  loadingContacts: boolean
}

interface ContactsProps {
  auth: Auth
  history: History
}

export class Contacts extends React.PureComponent<ContactsProps, ContactsState> {
  state: ContactsState = {
    contacts: [],
    newContactName: '',
	newContactAddress: '',
	newContactNumber: 9999,
    loadingContacts: true
  }

  handleContactAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContactAddress: event.target.value });
	console.log('this.state.address after change:', this.state.newContactAddress);
  }
  
  handleContactNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContactName: event.target.value });
	console.log('this.state.newContactName after change:', this.state.newContactName);
  }
  
  handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newContactNumber: parseInt(event.target.value) as number});
	console.log('this.state.newContactNumber after change:', this.state.newContactNumber);
  }

  onEditButtonClick = (contactId: string) => {
    this.props.history.push(`/contacts/${contactId}/edit`);
  }

  onContactCheck = async (pos: number) => {
    try {
		
      const contact = this.state.contacts[pos];
	  console.log('inside check');
      await patchContact(this.props.auth.getIdToken(), contact.contactId, {
        name: contact.name,
        address: contact.address,
		contactNumber: contact.contactNumber,
        contacted: !contact.contacted
      });
      this.setState({
        contacts: update(this.state.contacts, {
          [pos]: { contacted: { $set: !contact.contacted } }
        })
      });
    } catch (e){
      alert(`Contact check failed: ${e.message}`);
    }
  }
  
  onContactDelete = async (contactId: string) => {
    try {
      await deleteContact(this.props.auth.getIdToken(), contactId);
      this.setState({
        contacts: this.state.contacts.filter(contact => contact.contactId != contactId)
      });
    } catch(e) {
      alert(`Contact deletion failed ${e.message}`);
    }
  }
  
  onContactCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      /* const dDate = this.calculateDueDate(); */
	  if(this.state.newContactName == "" || this.state.newContactAddress == ""){
		  alert('You must add a contact name and address to add in list');
		  return;
	  }
      const newContact = await createContact(this.props.auth.getIdToken(), {
        name: this.state.newContactName,
        address: this.state.newContactAddress,
		contactNumber: this.state.newContactNumber
      })
      this.setState({
        contacts: [...this.state.contacts, newContact],
        newContactName: '' // this.state.newContactName
      })
    } catch (e) {
      alert(`Contact creation failed ${e.message}`);
    }
  }



  async componentDidMount() {
    try {
      const contacts = await getContacts(this.props.auth.getIdToken())
      this.setState({
        contacts,
        loadingContacts: false
      })
    } catch (e) {
      alert(`Failed to fetch contacts: ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Contacts</Header>

        {this.renderCreateContactInput()}

        {this.renderContacts()}
      </div>
    )
  }

  renderCreateContactInput() {
    return (
      <Grid.Row>
        <Grid.Column width={7}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onContactCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Contact Name..."
            onChange={this.handleContactNameChange}
          />
        </Grid.Column>
        <Grid.Column width={7}>
          <Divider />
        </Grid.Column>
		<Grid.Column width={12}>
          <Input
            /*action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onContactCreate
            }}*/
            fluid
            actionPosition="left"
            placeholder="Contact Address..."
            onChange={this.handleContactAddressChange}
          />
        </Grid.Column>
        <Grid.Column width={12}>
          <Divider />
        </Grid.Column>
		<Grid.Column width={7}>
          <Input
            /*action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onContactCreate
            }}*/
            fluid
            actionPosition="left"
            placeholder="Contact Number..."
            onChange={this.handleContactNumberChange}
          />
        </Grid.Column>
        <Grid.Column width={7}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderContacts() {
    if (this.state.loadingContacts) {
      return this.renderLoading();
    }

    return this.renderContactsList();
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Contacts
        </Loader>
      </Grid.Row>
    )
  }

  renderContactsList() {
    return (
      <Grid padded>
        {this.state.contacts.map((contact, pos) => {
          return (
            <Grid.Row key={contact.contactId}>
              <Grid.Column width={5} verticalAlign="middle">
                {contact.name}
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle" floated="right">
                {contact.address}
              </Grid.Column>
			  <Grid.Column width={4} verticalAlign="middle" floated="right">
                {contact.contactNumber}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle" floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(contact.contactId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle" floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onContactDelete(contact.contactId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {contact.attachmentUrl && (
                <Image src={contact.attachmentUrl} size="small" wrapped centered/>
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  /* calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  } */
}

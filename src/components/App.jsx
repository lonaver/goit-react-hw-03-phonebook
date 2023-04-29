import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import styles from './App.module.css';

import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';

const phoneBookLS = 'KEY_PHONE_BOOK';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
    name: '',
    number: '',
  };

  componentDidMount = () => {
    const listFromLS = JSON.parse(localStorage.getItem(phoneBookLS));
    if (listFromLS) {
      this.setState({ contacts: listFromLS });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem(phoneBookLS, JSON.stringify(this.state.contacts));
    }
  };

  AddContact = ({ name, number }) => {
    const normoliseName = name.toLowerCase();
    const contactFind = this.state.contacts.find(
      contact =>
        contact.name.toLowerCase() === normoliseName ||
        contact.number === number
    );
    if (contactFind) {
      alert(`${contactFind.name} is alredy contact`);
      return;
    }

    const newContact = { id: nanoid(), name, number };
    this.setState(prevState => ({
      contacts: [newContact, ...prevState.contacts],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  deleteContact = idContact => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(({ id }) => id !== idContact),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const normoliseFilter = filter.toLowerCase();
    const visibleContacts = contacts.filter(
      ({ name, number }) =>
        name.toLowerCase().includes(normoliseFilter) ||
        number.toLowerCase().includes(normoliseFilter)
    );
    return (
      <div className={styles.contacts}>
        <h1>Phone book</h1>
        <ContactForm onSubmit={this.AddContact}></ContactForm>
        <h2>Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter}></Filter>
        {contacts.length > 0 && (
          <ContactList
            contacts={visibleContacts}
            handleDelete={this.deleteContact}
          ></ContactList>
        )}
      </div>
    );
  }
}

export default App;

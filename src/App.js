import { useState, useEffect } from "react";
import ContactsList from "./components/ContactsList";
import ContactView from "./components/ContactView";
import CreateContactForm from "./components/CreateContactForm";
import EditContactForm from "./components/EditContactForm";
import "./styles.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [hideCreateForm, setHideCreateForm] = useState(true);
  const [hideContactView, setHideContactView] = useState(true);
  const [hideEditForm, setHideEditForm] = useState(true);

  const [contactToEdit, setContactToEdit] = useState(null);
  const [contactToView, setContactToView] = useState(null);

  console.log("State ", {
    contacts,
    hideCreateForm,
    contactToView,
  });

  // Get contacts data from the server
  useEffect(() => {
    getContacts();
  }, []);

  // Function used to get contacts from the server
  function getContacts() {
    fetch("http://localhost:3030/contacts")
      .then((res) => res.json())
      .then((contactsData) => {
        console.log(contactsData);
        setContacts(contactsData);
      });
  }

  return (
    <>
      <ContactsList
        contacts={contacts}
        hideCreateForm={hideCreateForm}
        hideEditForm={hideEditForm}
        hideContactView={hideContactView}
        setHideCreateForm={setHideCreateForm}
        setHideEditForm={setHideEditForm}
        setHideContactView={setHideContactView}
        setContactToEdit={setContactToEdit}
        setContactToView={setContactToView}
      />
      <main className="view-section">
        {!hideCreateForm && (
          <CreateContactForm
            getContacts={getContacts}
            hideContactView={hideContactView}
            hideCreateForm={hideCreateForm}
            setHideContactView={setHideContactView}
            setContactToView={setContactToView}
            setHideCreateForm={setHideCreateForm}
          />
        )}
        {!hideEditForm && (
          <EditContactForm
            contactToEdit={contactToEdit}
            getContacts={getContacts}
          />
        )}
        {!hideContactView && <ContactView contactToView={contactToView} />}
      </main>
    </>
  );
}

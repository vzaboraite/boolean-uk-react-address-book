import { useState, useEffect } from "react";
import ContactsList from "./components/ContactsList";
import CreateContactForm from "./components/CreateContactForm";
import "./styles.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [hideForm, setHideForm] = useState(true);

  console.log("State ", {
    contacts,
    hideForm,
  });

  // Get contacts data from the server
  useEffect(() => {
    fetch("http://localhost:3030/contacts")
      .then((res) => res.json())
      .then((contactsData) => {
        console.log(contactsData);
        setContacts(contactsData);
      });
  }, []);

  return (
    <>
      <ContactsList
        contacts={contacts}
        hideForm={hideForm}
        setHideForm={setHideForm}
      />
      <main>{!hideForm && <CreateContactForm />}</main>
    </>
  );
}

import { useState, useEffect } from "react";
import ContactsList from "./components/ContactsList";
import ContactView from "./components/ContactView";
import CreateContactForm from "./components/CreateContactForm";
import EditContactForm from "./components/EditContactForm";
import Notification from "./components/Notification";
import "./styles.css";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [hideCreateForm, setHideCreateForm] = useState(true);
  const [hideContactView, setHideContactView] = useState(true);
  const [hideEditForm, setHideEditForm] = useState(true);

  const [contactToEdit, setContactToEdit] = useState(null);
  const [contactToView, setContactToView] = useState(null);

  const [notification, setNotification] = useState("");

  // Get contacts data from the server
  useEffect(() => {
    getContacts();
  }, []);

  // Function used to get contacts from the server
  function getContacts() {
    fetch("http://localhost:3030/contacts")
      .then((res) => res.json())
      .then((contactsData) => {
        setContacts(contactsData);
      })
      /* While updating /contacts and /addresses at the same time caused errors 
       on GET request => (GET http://localhost:3030/contacts net::ERR_CONNECTION_REFUSED), 
       the solution was to use .catch() for the error handling and re-calling getContacts function after 100ms.
       
       Resources: https://stackoverflow.com/questions/38235715/fetch-reject-promise-and-catch-the-error-if-status-is-not-ok
                  https://www.w3schools.com/jsref/met_console_error.asp
                  https://medium.com/suyeonme/javascript-fetch-multiple-data-at-once-in-delay-9a74ef6afc7
       */
      .catch(() => {
        console.error(
          "Wasn't able to fetch /contacts, make sure that json-server is running. Retrying..."
        );
        setTimeout(getContacts, 100);
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
        setNotification={setNotification}
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
            hideContactView={hideContactView}
            hideEditForm={hideEditForm}
            setContactToView={setContactToView}
            setHideContactView={setHideContactView}
            setHideEditForm={setHideEditForm}
            setNotification={setNotification}
          />
        )}
        {!hideContactView && (
          <ContactView
            contactToView={contactToView}
            notification={notification}
          />
        )}
        {notification && <Notification text={notification} />}
      </main>
    </>
  );
}

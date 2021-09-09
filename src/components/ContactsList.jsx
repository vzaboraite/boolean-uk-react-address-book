function ContactsList(props) {
  const {
    contacts,
    hideCreateForm,
    setHideCreateForm,
    setHideEditForm,
    setHideContactView,
    setContactToEdit,
    setContactToView,
    setNotification,
  } = props;

  return (
    <aside className="contacts-section light-shadow">
      <header>
        <h2>Contacts</h2>
        <button
          onClick={() => {
            setHideCreateForm(!hideCreateForm);
            setHideEditForm(true);
            setHideContactView(true);
            setNotification("");
          }}
          className="button new-contact-btn"
        >
          {hideCreateForm ? "Create" : "Cancel"}
        </button>
      </header>
      <ul className="contacts-list">
        {contacts.map((contact, index) => {
          const { firstName, lastName } = contact;

          const handleViewButton = (event) => {
            setHideContactView(false);
            setHideEditForm(true);
            setHideCreateForm(true);
            setContactToView(contact);
            setNotification("");
          };

          const handleEditButton = (event) => {
            setHideEditForm(false);
            setHideContactView(true);
            setHideCreateForm(true);
            setContactToEdit(contact);
            setNotification("");
          };

          return (
            <li key={index}>
              <h3>
                {firstName} {lastName}
              </h3>
              <button onClick={handleViewButton} className="button">
                View
              </button>
              <button onClick={handleEditButton} className="button">
                Edit
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default ContactsList;

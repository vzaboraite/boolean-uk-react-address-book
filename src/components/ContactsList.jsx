function ContactsList(props) {
  const {
    contacts,
    hideCreateForm,
    hideEditForm,
    hideContactView,
    setHideCreateForm,
    setHideEditForm,
    setHideContactView,
    setContactToEdit,
    setContactToView,
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
          };

          const handleEditButton = (event) => {
            setHideEditForm(false);
            setHideContactView(true);
            setHideCreateForm(true);
            setContactToEdit(contact);
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

function ContactsList(props) {
  const {
    contacts,
    hideCreateForm,
    hideEditForm,
    setHideCreateForm,
    setHideEditForm,
    setContactToEdit,
  } = props;

  return (
    <aside className="contacts-section light-shadow">
      <header>
        <h2>Contacts</h2>
        <button
          onClick={() => setHideCreateForm(!hideCreateForm)}
          className="button new-contact-btn"
        >
          {hideCreateForm ? "Create" : "Cancel"}
        </button>
      </header>
      <ul className="contacts-list">
        {contacts.map((contact, index) => {
          const { firstName, lastName, address } = contact;

          const handleEditButton = (event) => {
            setHideEditForm(!hideEditForm);
            setContactToEdit(contact);
          };

          return (
            <li key={index}>
              <h3>
                {firstName} {lastName}
              </h3>
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

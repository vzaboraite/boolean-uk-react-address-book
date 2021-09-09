import { useEffect, useState } from "react";

function EditContactForm(props) {
  const {
    contactToEdit,
    getContacts,
    hideContactView,
    hideEditForm,
    setContactToView,
    setHideContactView,
    setHideEditForm,
    setNotification,
  } = props;

  const [userInputsToEdit, setUserInputsToEdit] = useState({
    firstName: contactToEdit.firstName,
    lastName: contactToEdit.lastName,
    street: contactToEdit.address.street,
    city: contactToEdit.address.city,
    postCode: contactToEdit.address.postCode,
    blockContact: contactToEdit.blockContact,
  });

  /* This useEffect sets `EditContactForm` with contact data. It is triggered when `Edit`
     button is clicked on specific in `ContactList` item
     Resource: https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props */
  useEffect(() => {
    setUserInputsToEdit({
      firstName: contactToEdit.firstName,
      lastName: contactToEdit.lastName,
      street: contactToEdit.address.street,
      city: contactToEdit.address.city,
      postCode: contactToEdit.address.postCode,
      blockContact: contactToEdit.blockContact,
    });
  }, [contactToEdit]);

  const { firstName, lastName, street, city, postCode, blockContact } =
    userInputsToEdit;

  const handleFormInput = (event) => {
    const inputFieldName = event.target.name;
    const targetValue = event.target.value;
    const inputType = event.target.type;
    const isChecked = event.target.checked;

    if (inputType === "checkbox") {
      setUserInputsToEdit({
        ...userInputsToEdit,
        [inputFieldName]: isChecked,
      });
    } else {
      setUserInputsToEdit({
        ...userInputsToEdit,
        [inputFieldName]: targetValue,
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const addressInfoToEdit = {
      street,
      city,
      postCode,
    };

    const addressFetchOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressInfoToEdit),
    };

    const { addressId, id } = contactToEdit;

    fetch(`http://localhost:3030/addresses/${addressId}`, addressFetchOptions)
      .then((res) => res.json())
      .then((addressData) => {
        const contactInfoToEdit = {
          firstName,
          lastName,
          blockContact,
          addressId,
        };

        const contactFetchOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactInfoToEdit),
        };

        fetch(`http://localhost:3030/contacts/${id}`, contactFetchOptions)
          .then((res) => res.json())
          .then((contactData) => {
            getContacts();

            const editedContact = {
              ...contactData,
              address: {
                ...addressData,
              },
            };

            setContactToView(editedContact);
            setHideContactView(!hideContactView);
            setHideEditForm(!hideEditForm);
          });
      });
  };

  const handleDeleteButton = () => {
    const contactToDelete = { ...contactToEdit };
    const { addressId, id } = contactToDelete;
    fetch(`http://localhost:3030/contacts/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        fetch(`http://localhost:3030/addresses/${addressId}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            setNotification("Contact deleted successfully!");
            setHideEditForm(!hideEditForm);

            getContacts();
          });
      });
  };

  return (
    <form
      className="form-stack light-shadow center contact-form"
      onSubmit={handleFormSubmit}
    >
      <h1>Edit Contact</h1>
      <label htmlFor="first-name-input">First Name:</label>
      <input
        id="first-name-input"
        name="firstName"
        type="text"
        value={firstName}
        onChange={handleFormInput}
      />
      <label htmlFor="last-name-input">Last Name:</label>
      <input
        id="last-name-input"
        name="lastName"
        type="text"
        value={lastName}
        onChange={handleFormInput}
      />
      <label htmlFor="street-input">Street:</label>
      <input
        id="street-input"
        name="street"
        type="text"
        value={street}
        onChange={handleFormInput}
      />
      <label htmlFor="city-input">City:</label>
      <input
        id="city-input"
        name="city"
        type="text"
        value={city}
        onChange={handleFormInput}
      />
      <label htmlFor="post-code-input">Post Code:</label>
      <input
        id="post-code-input"
        name="postCode"
        type="text"
        value={postCode}
        onChange={handleFormInput}
      />
      <div className="checkbox-section">
        <input
          id="block-checkbox"
          name="blockContact"
          type="checkbox"
          checked={blockContact}
          onChange={handleFormInput}
        />
        <label htmlFor="block-checkbox">Block</label>
      </div>
      <div className="actions-section">
        <button className="button blue" type="submit">
          Edit
        </button>
        {/*
        To prevent this button to trigger submitting the form, set type attribute value to `button`
        Resource: https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
        */}
        <button
          className="button blue"
          type="button"
          onClick={handleDeleteButton}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default EditContactForm;

import { useState } from "react";

function EditContactForm({ contactToEdit, getContacts }) {
  console.log("Inside EditContactForm: ", { contactToEdit });

  const [userInputsToEdit, setUserInputsToEdit] = useState({
    firstName: contactToEdit.firstName,
    lastName: contactToEdit.lastName,
    street: contactToEdit.address.street,
    city: contactToEdit.address.city,
    postCode: contactToEdit.address.postCode,
    blockContact: contactToEdit.blockContact,
  });

  const { firstName, lastName, street, city, postCode, blockContact } =
    userInputsToEdit;

  const handleFormInput = (event) => {
    const inputFieldName = event.target.name;
    const targetValue = event.target.value;
    const inputType = event.target.type;
    const isChecked = event.target.checked;

    console.log({ inputFieldName, targetValue, inputType, isChecked });

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
        console.log("addressData: ", addressData);

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
            console.log("contactData: ", contactData);
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
          value={blockContact}
          checked={blockContact}
          onChange={handleFormInput}
        />
        <label htmlFor="block-checkbox">Block</label>
      </div>
      <div className="actions-section">
        <button className="button blue" type="submit">
          Edit
        </button>
      </div>
    </form>
  );
}

export default EditContactForm;

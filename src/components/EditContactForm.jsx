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

  console.log("State inside EditContactsForm: ", { contactToEdit });

  // const [userInputsToEdit, setUserInputsToEdit] = useState({
  //   firstName: contactToEdit.firstName,
  //   lastName: contactToEdit.lastName,
  //   address: {
  //     street: contactToEdit.address.street,
  //     city: contactToEdit.address.city,
  //     postCode: contactToEdit.address.postCode,
  //   },
  //   blockContact: contactToEdit.blockContact,
  // });

  const [contactInputs, setContactInputs] = useState({
    firstName: contactToEdit.firstName,
    lastName: contactToEdit.lastName,
    blockContact: contactToEdit.blockContact,
  });

  const [addressInputs, setAddressInputs] = useState({
    street: contactToEdit.address.street,
    city: contactToEdit.address.city,
    postCode: contactToEdit.address.postCode,
  });

  // console.log("Inside EditContactsForm: ", { contactInputs, addressInputs });

  /* This useEffect keeps track of when contactToEdit changes, sets `EditContactForm` component with contact data.
     Resource: https://stackoverflow.com/questions/54865764/react-usestate-does-not-reload-state-from-props */
  useEffect(() => {
    // to prevent mutating contact
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
    const addressToEdit = {
      ...contactToEdit.address,
    };
    const contactForState = { ...contactToEdit };

    // console.log({ addressToEdit, contactForState });
    delete contactForState.address;
    setContactInputs({
      ...contactForState,
    });

    setAddressInputs({
      ...addressToEdit,
    });
  }, [contactToEdit]);

  const { firstName, lastName, blockContact } = contactInputs;
  const { street, city, postCode } = addressInputs;

  const handleFormInput = (event) => {
    const inputFieldName = event.target.name;
    const targetValue = event.target.value;
    const inputType = event.target.type;
    const isChecked = event.target.checked;

    if (
      inputFieldName === "city" ||
      inputFieldName === "street" ||
      inputFieldName === "postCode"
    ) {
      setAddressInputs({
        ...addressInputs,
        [inputFieldName]: targetValue,
      });
    } else {
      if (inputType === "checkbox") {
        setContactInputs({
          ...contactInputs,
          [inputFieldName]: isChecked,
        });
      } else {
        setContactInputs({
          ...contactInputs,
          [inputFieldName]: targetValue,
        });
      }
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
        console.log({ addressData });

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

        // if something changes in contactsInput, run this:
        fetch(`http://localhost:3030/contacts/${id}`, contactFetchOptions)
          .then((res) => res.json())
          .then((contactData) => {
            console.log({ contactData });
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
    //  otherwise run addresses endpoint fetch
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

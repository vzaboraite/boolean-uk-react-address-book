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
    // To prevent mutating contactToEdit, save references to contactToEdit and contactToEdit.address in object variables
    // To delete address from contactForState object, use delete operator:
    // Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
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
    const { addressId, id } = contactToEdit;

    /* In order to send one PUT request at a time to the server, we need to separate `contactInputs` and `addressInputs` into 
    separate states and do separate fetch/PUT requests accordingly. 
    If both states were updated, send two PUT requests to the server accordingly to update both `contacts` and `addresses` endpoints. */

    // If something changes in contactsInputs, update `contacts` endpoint.
    // That means, if user changes/updates the initial input value got from `contactToEdit`
    // that has been set to `contactInputs` then we send to the server updated data and keep `address` data unchanged:
    if (
      contactInputs.firstName !== contactToEdit.firstName ||
      contactInputs.lastName !== contactToEdit.lastName ||
      contactInputs.blockContact !== contactToEdit.blockContact
    ) {
      const contactInfoToEdit = {
        firstName,
        lastName,
        blockContact,
        addressId,
      };

      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfoToEdit),
      };

      fetch(`http://localhost:3030/contacts/${id}`, fetchOptions)
        .then((res) => res.json())
        .then((contactData) => {
          console.log({ contactData });
          getContacts();

          const updatedContact = {
            ...contactData,
            address: {
              ...addressInputs,
            },
          };

          setContactToView(updatedContact);
          setHideContactView(false);
          setHideEditForm(true);
        });
    }

    // If something changes in addressInputs, update `addresses` endpoint.
    // That means, if user changes/updates the initial input value got from `contactToEdit.address`
    // that has been set to `addressInputs` then we send to the server updated data and keep `contact` data unchanged:
    if (
      addressInputs.street !== contactToEdit.address.street ||
      addressInputs.city !== contactToEdit.address.city ||
      addressInputs.postCode !== contactToEdit.address.postCode
    ) {
      const addressInfoToEdit = {
        street,
        city,
        postCode,
      };

      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressInfoToEdit),
      };

      fetch(`http://localhost:3030/addresses/${addressId}`, fetchOptions)
        .then((res) => res.json())
        .then((addressData) => {
          console.log({ addressData });
          getContacts();

          const updatedContact = {
            ...contactInputs,
            address: {
              ...addressData,
            },
          };

          setContactToView(updatedContact);
          setHideContactView(false);
          setHideEditForm(true);
        });
    }
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

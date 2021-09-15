import { useState } from "react";

function CreateContactForm({
  getContacts,
  hideContactView,
  hideCreateContactForm,
  setHideContactView,
  setHideCreateForm,
  setContactToView,
}) {
  // State as one object to store user input from the form
  const [contactInputs, setContactInputs] = useState({
    firstName: "",
    lastName: "",
    blockContact: false,
  });

  const [addressInputs, setAddressInputs] = useState({
    street: "",
    city: "",
    postCode: "",
  });

  // In order to use input field names dynamically, I've set `name` attributes in the form
  // accordingly to the `user Input` state object key names.

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
    // Create addressInfo object and "POST" it to the `/addresses` endpoint
    const { street, city, postCode } = addressInputs;

    const addressInfo = {
      street,
      city,
      postCode,
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressInfo),
    };

    fetch("http://localhost:3030/addresses", fetchOptions)
      .then((res) => res.json())
      .then((addressData) => {
        // Create contactInfo object and "POST" it to the `/contacts` endpoint.
        // Because contactInfo requires addressId, it is created inside `addresses fetch request`
        // to get that id from addressData.

        const { firstName, lastName, blockContact } = contactInputs;

        const contactInfo = {
          firstName,
          lastName,
          blockContact,
          addressId: addressData.id,
        };

        const fetchOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactInfo),
        };

        fetch("http://localhost:3030/contacts", fetchOptions)
          .then((res) => res.json())
          .then((contactData) => {
            // Function getContacts() is called here, to do the fetch request(which is defined
            // in App.js), which gets updated contacts array and enforces to re-render the contacts list.
            getContacts();

            const contactToView = {
              ...contactData,
              address: {
                ...addressData,
              },
            };

            setContactToView(contactToView);
            setHideContactView(!hideContactView);
            setHideCreateForm(!hideCreateContactForm);
          });
      });
  };

  return (
    <form
      className="form-stack light-shadow center contact-form"
      onSubmit={handleFormSubmit}
    >
      <h1>Create Contact</h1>
      <label htmlFor="first-name-input">First Name:</label>
      <input
        id="first-name-input"
        name="firstName"
        type="text"
        onChange={handleFormInput}
      />
      <label htmlFor="last-name-input">Last Name:</label>
      <input
        id="last-name-input"
        name="lastName"
        type="text"
        onChange={handleFormInput}
      />
      <label htmlFor="street-input">Street:</label>
      <input
        id="street-input"
        name="street"
        type="text"
        onChange={handleFormInput}
      />
      <label htmlFor="city-input">City:</label>
      <input
        id="city-input"
        name="city"
        type="text"
        onChange={handleFormInput}
      />
      <label htmlFor="post-code-input">Post Code:</label>
      <input
        id="post-code-input"
        name="postCode"
        type="text"
        onChange={handleFormInput}
      />
      <div className="checkbox-section">
        <input
          id="block-checkbox"
          name="blockContact"
          type="checkbox"
          onChange={handleFormInput}
        />
        <label htmlFor="block-checkbox">Block</label>
      </div>
      <div className="actions-section">
        <button className="button blue" type="submit">
          Create
        </button>
      </div>
    </form>
  );
}

export default CreateContactForm;

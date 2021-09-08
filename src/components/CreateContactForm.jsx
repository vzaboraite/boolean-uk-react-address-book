import { useState } from "react";

function CreateContactForm({ getContacts }) {
  // State as one object to store user input from the form
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    postCode: "",
    blockContact: false,
  });

  console.log({ userInput });

  // In order to use input field names dynamically, I've set `name` attributes in the form
  // accordingly to the `user Input` state object key names.

  const handleFormInput = (event) => {
    const inputFieldName = event.target.name;
    const targetValue = event.target.value;
    const inputType = event.target.type;
    const isChecked = event.target.checked;

    console.log({ inputFieldName, targetValue, inputType, isChecked });

    if (inputType === "checkbox") {
      setUserInput({
        ...userInput,
        [inputFieldName]: isChecked,
      });
    } else {
      setUserInput({
        ...userInput,
        [inputFieldName]: targetValue,
      });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Create addressInfo object and "POST" it to the `/addresses` endpoint
    const { street, city, postCode } = userInput;

    const addressInfo = {
      street,
      city,
      postCode,
    };

    const addressFetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressInfo),
    };

    fetch("http://localhost:3030/addresses", addressFetchOptions)
      .then((res) => res.json())
      .then((addressData) => {
        console.log("addressData: ", addressData);

        // Create contactInfo object and "POST" it to the `/contacts` endpoint.
        // Because contactInfo requires addressId, it is created inside `addresses fetch request`
        // to get that id from addressData.

        const { firstName, lastName, block } = userInput;

        const contactInfo = {
          firstName,
          lastName,
          blockContact,
          addressId: addressData.id,
        };

        const contactFetchOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactInfo),
        };

        fetch("http://localhost:3030/contacts", contactFetchOptions)
          .then((res) => res.json())
          .then((contactData) => {
            console.log("contactData: ", contactData);
            // Function getContacts() is called here, to do the fetch request(which is defined
            // in App.js), which gets updated contacts array and enforces to re-render the contacts list.
            getContacts();
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

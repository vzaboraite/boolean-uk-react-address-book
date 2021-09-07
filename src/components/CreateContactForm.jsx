import { useState } from "react";

function CreateContactForm({ getContacts }) {
  // state used to store data from input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [block, setBlock] = useState(false);

  console.log("State inside CreateContactForm: ", {
    firstName,
    lastName,
    street,
    city,
    postCode,
    block,
  });

  const handleFirstNameInput = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameInput = (event) => {
    setLastName(event.target.value);
  };

  const handleStreetInput = (event) => {
    setStreet(event.target.value);
  };

  const handleCityInput = (event) => {
    setCity(event.target.value);
  };

  const handlePostCodeInput = (event) => {
    setPostCode(event.target.value);
  };

  const handleBlockCheckbox = (event) => {
    setBlock(event.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Create addressInfo object and "POST" it to the `/addresses` endpoint
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
        const contactInfo = {
          firstName,
          lastName,
          blockContact: block,
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
        name="first-name-input"
        type="text"
        onChange={handleFirstNameInput}
      />
      <label htmlFor="last-name-input">Last Name:</label>
      <input
        id="last-name-input"
        name="last-name-input"
        type="text"
        onChange={handleLastNameInput}
      />
      <label htmlFor="street-input">Street:</label>
      <input
        id="street-input"
        name="street-input"
        type="text"
        onChange={handleStreetInput}
      />
      <label htmlFor="city-input">City:</label>
      <input
        id="city-input"
        name="city-input"
        type="text"
        onChange={handleCityInput}
      />
      <label htmlFor="post-code-input">Post Code:</label>
      <input
        id="post-code-input"
        name="post-code-input"
        type="text"
        onChange={handlePostCodeInput}
      />
      <div className="checkbox-section">
        <input
          id="block-checkbox"
          name="block-checkbox"
          type="checkbox"
          onChange={handleBlockCheckbox}
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

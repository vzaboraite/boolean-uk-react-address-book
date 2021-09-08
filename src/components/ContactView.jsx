function ContactView({ contactToView }) {
  const { firstName, lastName, address } = contactToView;

  return (
    <div className="address-card light-shadow center">
      <h1>
        {firstName} {lastName}
      </h1>
      <h2>Address</h2>
      <p>{address.street}</p>
      <p>{address.city}</p>
      <p>{address.postCode}</p>
    </div>
  );
}

export default ContactView;

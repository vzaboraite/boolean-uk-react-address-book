function ContactView({ contactToView }) {
  const { firstName, lastName, address } = contactToView;
  const { street, city, postCode } = address;

  return (
    <div className="address-card light-shadow center">
      <h1>
        {firstName} {lastName}
      </h1>
      <h2>Address</h2>
      <p>{street}</p>
      <p>{city}</p>
      <p>{postCode}</p>
    </div>
  );
}

export default ContactView;

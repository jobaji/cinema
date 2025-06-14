import React, { useState } from "react";
import axios from "axios";

const Membership = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    preferredGenre: "",
    paymentMethod: "G-Cash",
    amount: "999.00",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      const response = await axios.post("http://localhost:5000/register-with-membership", formData);
      setMessage(response.data.message || "Success!");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while registering.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Register with Membership</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} /><br /><br />
        <input type="number" name="age" placeholder="Age" required onChange={handleChange} /><br /><br />
        <select name="gender" required onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select><br /><br />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} /><br /><br />
        <input type="text" name="preferredGenre" placeholder="Preferred Movie Genre" required onChange={handleChange} /><br /><br />
        <select name="paymentMethod" required onChange={handleChange}>
          <option>G-Cash</option>
          <option>Paymaya</option>
          <option>Cash</option>
          <option>Credit Card</option>
        </select><br /><br />
        <input type="text" name="amount" value={formData.amount} readOnly /><br /><br />
        <button type="submit">Activate Membership</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Membership;

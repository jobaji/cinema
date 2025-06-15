import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    CustomerID: '',
    ShowtimeID: '',
    SeatID: '',
    Booking_Quantity: 1
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/bookings/with-discount", form);

      const { message, ticket_price, bookingId } = res.data;
      const finalPrice = ticket_price !== undefined
        ? ` Final Ticket Price: ₱${Number(ticket_price).toFixed(2)}`
        : "";

      setMessage(`${message}${finalPrice}`);

      // ✅ Redirect to receipt page with bookingId
      navigate(`/receipt/${res.data.bookingId}`);

    } catch (err) {
      setMessage("Booking failed.");
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Book a Ticket</Typography>

      <TextField
        label="Customer ID"
        name="CustomerID"
        fullWidth
        margin="normal"
        value={form.CustomerID}
        onChange={handleChange}
      />
      <TextField
        label="Showtime ID"
        name="ShowtimeID"
        fullWidth
        margin="normal"
        value={form.ShowtimeID}
        onChange={handleChange}
      />
      <TextField
        label="Seat ID"
        name="SeatID"
        fullWidth
        margin="normal"
        value={form.SeatID}
        onChange={handleChange}
      />
      <TextField
        label="Quantity"
        name="Booking_Quantity"
        type="number"
        fullWidth
        margin="normal"
        value={form.Booking_Quantity}
        onChange={handleChange}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Book Now
      </Button>

      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default Payment;

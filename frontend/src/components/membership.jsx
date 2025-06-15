import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Membership = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    preferredGenre: '',
    paymentMethod: 'G-Cash',
    amount: '999.00'
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
      await axios.post('http://localhost:5000/register-with-membership', form);
      setMessage("Membership activated! You now get 10% off movie bookings for 1 year.");
    } catch (error) {
      console.error(error);
      setMessage("Error activating membership.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Activate Membership</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Name" name="name" required onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Age" name="age" type="number" required onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Gender" name="gender" required onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Email" name="email" required onChange={handleChange} />
        <TextField fullWidth margin="normal" label="Preferred Genre" name="preferredGenre" onChange={handleChange} />
        <TextField
          fullWidth
          margin="normal"
          select
          label="Payment Method"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <MenuItem value="G-Cash">G-Cash</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Paymaya">Paymaya</MenuItem>
        </TextField>
        <TextField fullWidth margin="normal" label="Amount" value={form.amount} name="amount" disabled />
        <Button type="submit" variant="contained" fullWidth onClick={() => navigate(`/payment`)}>Activate Membership</Button>
      </form>
      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default Membership;

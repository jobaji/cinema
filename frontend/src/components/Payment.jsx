import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orNum, setOrNum] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [seat, setSeat] = useState('');
  const [showtime, setShowtime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!paymentMethod || !orNum || !bookingId || !seat || !showtime) {
      setMessage('Please fill in all fields.');
      return;
    }

    const newPayment = {
      BookingID: bookingId,
      Seat: seat,
      Showtime: showtime,
      PaymentMethod: paymentMethod,
      PaymentStatus: 'Pending',
      OR_Num: orNum,
    };

    console.log('Submitting payment:', newPayment);
    setMessage('Payment submitted successfully!');
  };

  return (
    <Paper sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Payment Details
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          label="Payment Method"
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="G-Cash">G-Cash</MenuItem>
          <MenuItem value="Paymaya">Paymaya</MenuItem>
          <MenuItem value="Credit Card">Credit Card</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Seat"
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Showtime"
        type="datetime-local"
        value={showtime}
        onChange={(e) => setShowtime(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="OR Number"
        value={orNum}
        onChange={(e) => setOrNum(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Submit Payment
      </Button>

      {message && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default Payment;
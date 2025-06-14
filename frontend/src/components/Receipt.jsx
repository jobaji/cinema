import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider, List, ListItem, ListItemText, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';

const Receipt = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams(); // assuming URL has /receipt/:bookingId

  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
  if (!bookingId) return;
  axios.get(`http://localhost:5000/api/payment/${bookingId}`)
    .then(response => setReceipt(response.data))
    .catch(err => console.error('Error fetching receipt:', err));
}, [bookingId]);

  if (!receipt) {
    return (
      <Typography align="center" mt={5}>
        Loading your receipt...
      </Typography>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 5 }}>
      <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'green' }} />
          <Typography variant="h5" fontWeight="bold" mt={1}>
            Payment Completed
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" mt={1}>
            Thank you for your payment. Below is your transaction receipt. Please arrive 15 minutes before your selected showtime.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom><strong>Receipt Summary</strong></Typography>
          <Typography variant="body2">Booking ID: <strong>{receipt.BookingID}</strong></Typography>
          <Typography variant="body2">Seat: <strong>{receipt.Seat}</strong></Typography>
          <Typography variant="body2">Showtime: <strong>{new Date(receipt.Showtime).toLocaleString()}</strong></Typography>
          <Typography variant="body2">Payment Method: <strong>{receipt.PaymentMethod}</strong></Typography>
          <Typography variant="body2">OR Number: <strong>{receipt.OR_Num}</strong></Typography>
          <Typography variant="body2">Payment Status: <strong>{receipt.PaymentStatus}</strong></Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="subtitle1" gutterBottom><strong>Cinema House Rules</strong></Typography>
          <List dense>
            <ListItem><ListItemText primary="🎬 No outside food or drinks allowed." /></ListItem>
            <ListItem><ListItemText primary="📵 Please silence your phones during the movie." /></ListItem>
            <ListItem><ListItemText primary="🚫 No recording or photography inside the cinema." /></ListItem>
            <ListItem><ListItemText primary="👶 Children must be accompanied by an adult." /></ListItem>
            <ListItem><ListItemText primary="🎟️ Keep your receipt handy for seat verification." /></ListItem>
          </List>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate('/home')}
        >
          DONE
        </Button>
      </Paper>
    </Box>
  );
};

export default Receipt;
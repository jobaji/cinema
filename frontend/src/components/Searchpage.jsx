import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Container
} from '@mui/material';

const Searchpage = () => {
  const [bookingId, setBookingId] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/search?query=${bookingId}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Search Booking by Booking ID</Typography>
      <TextField
        label="Booking ID"
        variant="outlined"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        sx={{ mr: 2, width: '300px' }}
      />
      <Button variant="contained" onClick={handleSearch}>Search</Button>

      {results.length > 0 && (
        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Showtime ID</TableCell>
              <TableCell>Booking Quantity</TableCell>
              <TableCell>Booking Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.BookingID}>
                <TableCell>{row.BookingID}</TableCell>
                <TableCell>{row.CustomerName}</TableCell>
                <TableCell>{row.ShowtimeID}</TableCell>
                <TableCell>{row.Booking_Quantity}</TableCell>
                <TableCell>{row.Booking_Status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default Searchpage;

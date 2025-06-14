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

const SearchTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/search?query=${ticketId}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Search Ticket by Ticket ID</Typography>
      <TextField
        label="Ticket ID"
        variant="outlined"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        sx={{ mr: 2, width: '300px' }}
      />
      <Button variant="contained" onClick={handleSearch}>Search</Button>

      {results.length > 0 && (
        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Booking ID</TableCell>
              <TableCell>Seat ID</TableCell>
              <TableCell>Ticket Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.TicketID}>
                <TableCell>{row.TicketID}</TableCell>
                <TableCell>{row.BookingID}</TableCell>
                <TableCell>{row.SeatID}</TableCell>
                <TableCell>{row.Ticket_Price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default SearchTicket;

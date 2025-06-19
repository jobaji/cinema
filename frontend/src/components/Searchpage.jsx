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
  Container,
  Box
} from '@mui/material';

const SearchTicket = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/search?query=${searchQuery}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search Ticket by Ticket ID or Customer Name
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Search by Ticket ID or Customer Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mr: 2, width: '300px' }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {results.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Booking ID</TableCell>
              <TableCell>Seat ID</TableCell>
              <TableCell>Ticket Price</TableCell>
              <TableCell>Customer Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.TicketID}>
                <TableCell>{row.TicketID}</TableCell>
                <TableCell>{row.BookingID}</TableCell>
                <TableCell>{row.SeatID}</TableCell>
                <TableCell>₱{parseFloat(row.Ticket_Price).toFixed(2)}</TableCell>
                <TableCell>{row.CustomerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default SearchTicket;

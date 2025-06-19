import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: '',
    MovieID: '',
    ShowtimeID: '',
    Booking_Quantity: 1,
    Seats: []
  });

  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all movies
  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Failed to fetch movies:', err));
  }, []);

  // Fetch showtimes when MovieID changes
  useEffect(() => {
    if (form.MovieID) {
      axios.get(`http://localhost:5000/api/showtimes?movieId=${form.MovieID}`)
        .then(res => setShowtimes(res.data))
        .catch(err => console.error('Failed to fetch showtimes:', err));
    }
  }, [form.MovieID]);

  // Fetch available seats when ShowtimeID changes
  useEffect(() => {
    if (form.ShowtimeID) {
      axios.get(`http://localhost:5000/api/seats?showtimeId=${form.ShowtimeID}`)
        .then(res => setAvailableSeats(res.data))
        .catch(err => console.error('Failed to fetch seats:', err));
    }
  }, [form.ShowtimeID]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value);
    setForm(prev => ({
      ...prev,
      Booking_Quantity: qty,
      Seats: Array(qty).fill('')
    }));
  };

  const handleSeatSelect = (index, seatId) => {
    const updated = [...form.Seats];
    updated[index] = seatId;
    setForm(prev => ({ ...prev, Seats: updated }));
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
      navigate(`/receipt/${bookingId}`);
    } catch (err) {
      if (err.response?.data?.taken) {
        setMessage(`Error: Some selected seats are already taken: ${err.response.data.taken.map(s => s.SeatID).join(', ')}`);
      } else {
        setMessage("Booking failed.");
      }
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Book a Ticket</Typography>

      <TextField
        label="Customer Name"
        name="Name"
        fullWidth
        margin="normal"
        value={form.Name}
        onChange={handleChange}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Movie</InputLabel>
        <Select name="MovieID" value={form.MovieID} onChange={handleChange}>
          {movies.map(movie => (
            <MenuItem key={movie.MovieID} value={movie.MovieID}>{movie.Title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Showtime</InputLabel>
        <Select name="ShowtimeID" value={form.ShowtimeID} onChange={handleChange}>
          {showtimes.map(show => (
            <MenuItem key={show.ShowtimeID} value={show.ShowtimeID}>
              {`Start: ${show.Start_time} — End: ${show.End_time} (Theater ${show.TheaterID})`}
            </MenuItem>

          ))}
        </Select>
      </FormControl>

      <TextField
        label="Quantity"
        name="Booking_Quantity"
        type="number"
        fullWidth
        margin="normal"
        value={form.Booking_Quantity}
        onChange={handleQuantityChange}
      />

      {form.Seats.map((seat, index) => (
        <FormControl key={index} fullWidth margin="normal">
          <InputLabel>Select Seat {index + 1}</InputLabel>
          <Select
            value={seat}
            onChange={(e) => handleSeatSelect(index, e.target.value)}
          >
            {availableSeats
              .filter(s => !form.Seats.includes(s.SeatID) || s.SeatID === seat)
              .map(s => (
                <MenuItem key={s.SeatID} value={s.SeatID}>{s.SeatID}</MenuItem>
              ))}
          </Select>
        </FormControl>
      ))}

      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
        Book Now
      </Button>

      {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default Payment;

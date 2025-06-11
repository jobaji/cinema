import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const Movie7 = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/7')
      .then(response => setMovie(response.data))
      .catch(error => console.error('Error fetching movie:', error));
  }, []);

  if (!movie) {
    return <Typography variant="h6">Loading movie details...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        p: 2,
      }}
    >
      <Card sx={{ width: 500 }}>
        <CardMedia
            component="img"
            sx={{ width: '100%', height: 'auto' }}
            image={`/src/assets/movie${movie.MovieID}.jpg`}
            alt={movie.Title}
          />
        <CardContent>
          <Typography variant="h4" gutterBottom>{movie.Title}</Typography>
          <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
            Lilia Capistrano seeks revenge on billionaire Guilly Vega for killing her daughter. 
            Disguised as Eva Candelaria, she attends his party with a vengeful plan.
          </Typography>
          <Typography variant="body2"><strong>Genre:</strong> {movie.Genre}</Typography>
          <Typography variant="body2"><strong>Released:</strong> {movie.Release_date}</Typography>
          <Typography variant="body2"><strong>Genre:</strong> {movie.Genre}</Typography>
          <Typography variant="body2"><strong>Cast:</strong> {movie.Actors}</Typography>
          <Typography variant="body2"><strong>Duration:</strong> {movie.Runtime_minutes} min</Typography>
          <Typography variant="body2"><strong>Country:</strong> {movie.Distributor}</Typography>
          <Typography variant="body2"><strong>Production:</strong> {movie.Director}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Movie7;
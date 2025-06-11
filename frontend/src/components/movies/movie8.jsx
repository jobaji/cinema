import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const Movie8 = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/8')
      .then(response => setMovie(response.data))
      .catch(error => console.error('Error fetching movie:', error));
  }, []);

  // **Fix: Check if movie is null before rendering**
  if (!movie) {
    return <Typography variant="h6">Loading movie details...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // full vertical height
        backgroundColor: '#f5f5f5',
        p: 2,
      }}
    >
      <Card sx={{ width: 500 }}>
        <CardMedia
            component="img"
            sx={{ width: '100%', height: 'auto' }} // ✅ Makes the image responsive
            image={`/src/assets/movie${movie.MovieID}.jpg`}
            alt={movie.Title}
          />
        <CardContent>
          <Typography variant="h4" gutterBottom>{movie.Title}</Typography>
          <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
            An ex-special forces operative suffering from post-traumatic stress disorder (PTSD), 
            who -- in his bid for redemption as a security guard, attempts to save the life of a woman who is 
            being hunted by a corrupt police death squad working for a drug cartel.
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

export default Movie8;
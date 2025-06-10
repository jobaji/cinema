import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const Movie1 = () => {
  const [movie, setMovies] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/1')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`/src/assets/movie${movie.MovieID}.jpg`} // assumes images are named like movie1.jpg
                    alt={movie.Title}
                  />
        <CardContent>
          <Typography variant="h4" gutterBottom>{movie.Title}</Typography>
          <Typography variant="body1" gutterBottom>{movie.Genre}</Typography>
          <Typography variant="body2"><strong>Released:</strong> {movie.Language}</Typography>
          <Typography variant="body2"><strong>Genre:</strong> {movie.Release_date}</Typography>
          <Typography variant="body2"><strong>Cast:</strong> {movie.Runtime_minutes}</Typography>
          <Typography variant="body2"><strong>Duration:</strong> {movie.Festival_joined} min</Typography>
          <Typography variant="body2"><strong>Country:</strong> {movie.Distributor}</Typography>
          <Typography variant="body2"><strong>Production:</strong> {movie.Director}</Typography>
          <Typography variant="body2"><strong>Production:</strong> {movie.Actor}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Movie1;
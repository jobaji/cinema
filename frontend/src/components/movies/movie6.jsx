import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

const Movie6 = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/6')
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
            A comet connects Lex and Karen across 13 years through a dating app. As they bond, Karen asks him to 
            alter her past to save her parents' marriage. Each change brings unexpected consequences, leading to one final attempt.
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

export default Movie6;
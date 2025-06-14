import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Movie5 = () => {
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/5')
      .then(response => setMovie(response.data))
      .catch(error => console.error('Error fetching movie:', error));
  }, []);

  if (!movie) {
    return <Typography variant="h6">Loading movie details...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 900 }}>
      <Box sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          sx={{ width: 300, height: 'auto' }}
          image={`/src/assets/movie${movie.MovieID}.jpg`}
          alt={movie.Title}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>{movie.Title}</Typography>
          <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
           A team of adventurous celebrities filming in Taiwan's infamous Xinglin Hospital, one of Southeast Asia's 
            most haunted locations, quickly descends into terror as they encounter escalating paranormal phenomena. 
            As tensions rise and personalities clash, they become pawns of a malevolent entity, forcing them to make 
            difficult choices and sacrifices to survive the horrifying ordeal.
          </Typography>
          <Typography variant="body2"><strong>Genre:</strong> {movie.Genre}</Typography>
          <Typography variant="body2"><strong>Released:</strong> {movie.Release_date}</Typography>
          <Typography variant="body2"><strong>Cast:</strong> {movie.Actors}</Typography>
          <Typography variant="body2"><strong>Duration:</strong> {movie.Runtime_minutes} min</Typography>
          <Typography variant="body2"><strong>Country:</strong> {movie.Distributor}</Typography>
          <Typography variant="body2"><strong>Production:</strong> {movie.Director}</Typography>
          <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/payment`)}
              >
                BOOK NOW
              </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Movie5;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <Box
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #1e1e2f, #2a2a40)',
      px: 4,
      py: 6,
    }}
  >
    <Typography
      variant="h4"
      align="center"
      gutterBottom
      sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}
    >
      Now Showing
    </Typography>


    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.MovieID}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.3s ease','&:hover': { transform: 'scale(1.03)' }, }}>
            <CardMedia
              component="img"
              height="180"
              image={`/src/assets/movie${movie.MovieID}.jpg`}
              alt={movie.Title}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  mb: 2
                }}
              >
                <span>{movie.Title.split(' ').slice(0, 2).join(' ')}</span>
                <br />
                <span>{movie.Title.split(' ').slice(2).join(' ')}</span>
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(`/movie${movie.MovieID}`)}
              >
                BOOK NOW
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  );
};

export default Home;
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Button, Typography } from '@mui/material';
import movie1 from "./assets/movie1.jpg";
import movie2 from "./assets/movie2.jpg";

const movies = [
  { id: 1, title: 'And the Breadwinner Is...', image: movie1, route: '/movie1' },
  { id: 2, title: 'Green Bones', image: movie2, route: '/movie2' },
  { id: 3, title: 'Isang Himala', image: 'https://via.placeholder.com/300x200', route: '/movie3' },
  { id: 4, title: 'The Kingdom', image: 'https://via.placeholder.com/300x200', route: '/movie4' },
  { id: 5, title: 'Strange Frequencies: Taiwan Killer Hospital', image: 'https://via.placeholder.com/300x200', route: '/movie5' },
  { id: 6, title: 'My Future You', image: 'https://via.placeholder.com/300x200', route: '/movie6' },
  { id: 7, title: 'Uninvited', image: 'https://via.placeholder.com/300x200', route: '/movie7' },
  { id: 8, title: 'Topakk', image: 'https://via.placeholder.com/300x200', route: '/movie8' },
  { id: 9, title: 'Hold Me Close', image: 'https://via.placeholder.com/300x200', route: '/movie9' },
  { id: 10, title: 'Espantaho', image: 'https://via.placeholder.com/300x200', route: '/movie10' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="180"
              image={movie.image}
              alt={movie.title}
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
                {movie.title}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate(movie.route)}
              >
                WATCH NOW
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;

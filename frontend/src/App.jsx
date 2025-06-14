import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toolbar, Box, List, ListItem, ListItemText, Drawer, Button } from '@mui/material';
import Home from './components/Home';
import Register from "./components/Register";
import Login from "./components/Login";
import PageCRUD from './components/PageCrud';
import UserPageAccess from './components/UserPageAccess';
import Searchpage from "./components/Searchpage";
import Dashboard from "./components/Dashboard";
import Payment from "./components/Payment";
import Membership from "./components/Membership";
import Receipt from "./components/Receipt";



import Movie1 from './components/movies/Movie1';
import Movie2 from './components/movies/Movie2';
import Movie3 from './components/movies/Movie3';
import Movie4 from './components/movies/Movie4';
import Movie5 from './components/movies/Movie5';
import Movie6 from './components/movies/Movie6';
import Movie7 from './components/movies/Movie7';
import Movie8 from './components/movies/Movie8';
import Movie9 from './components/movies/Movie9';
import Movie10 from './components/movies/Movie10';

const drawerWidth = 240;

function MainLayout() {
  const navigate = useNavigate(); // ✅ Hook must be inside a Router-wrapped component

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ Removes authentication token
    navigate('/'); // ✅ Redirects to login page after logout
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem component={Link} to="/">
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem component={Link} to="/home">
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem component={Link} to="/membership">
            <ListItemText primary="Membership" />
          </ListItem>
          <ListItem component={Link} to="/receipt">
            <ListItemText primary="Receipt" />
          </ListItem>
          <ListItem component={Link} to="/searchpage">
            <ListItemText primary="Searchpage" />
          </ListItem>
          <ListItem component={Link} to="/page-crud">
            <ListItemText primary="PageCrud" />
          </ListItem>
          <ListItem component={Link} to="/page-access">
            <ListItemText primary="UserPageAccess" />
          </ListItem>
          <ListItem component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem>
            <Button onClick={handleLogout} variant="contained" color="secondary" fullWidth>
              Logout
            </Button>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/page-crud" element={<PageCRUD />} />
          <Route path="/page-access" element={<UserPageAccess />} />
          <Route path="/searchpage" element={<Searchpage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/receipt" element={<Receipt />} />


          <Route path="/movie1" element={<Movie1 />} />
          <Route path="/movie2" element={<Movie2 />} />
          <Route path="/movie3" element={<Movie3 />} />
          <Route path="/movie4" element={<Movie4 />} />
          <Route path="/movie5" element={<Movie5 />} />
          <Route path="/movie6" element={<Movie6 />} />
          <Route path="/movie7" element={<Movie7 />} />
          <Route path="/movie8" element={<Movie8 />} />
          <Route path="/movie9" element={<Movie9 />} />
          <Route path="/movie10" element={<Movie10 />} />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toolbar, Box, List, ListItem, ListItemText, Drawer, Button } from '@mui/material';
import Home from './components/Home';
import Register from "./components/Register";
import Login from "./components/Login";
import PageCRUD from './components/PageCrud';
import UserPageAccess from './components/UserPageAccess';

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
          <ListItem component={Link} to="/page-crud">
            <ListItemText primary="PageCrud" />
          </ListItem>
          <ListItem component={Link} to="/page-access">
            <ListItemText primary="UserPageAccess" />
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
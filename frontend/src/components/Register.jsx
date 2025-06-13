import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', role: '', password: ''});
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/register', formData);
            navigate('/');
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <Container>
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                height: '70vh',
                width: '60vh',
                bgcolor: 'background.paper',
                boxShadow: 3,
                p: 3,
                borderRadius: 2,
                }}
            >
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <TextField
                label="Username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                margin="normal"
            />
            <InputLabel>Role</InputLabel>
            <Select 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                label="Role" 
            > 
                <MenuItem value="Admin">Admin</MenuItem> 
                <MenuItem value="User">User</MenuItem> 
            </Select>
            <TextField
                label="Password"
                type="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                margin="normal"
            />
            <Button 
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              py: 1,
              background: 'linear-gradient(to right, #3f51b5, #9c27b0)',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { opacity: 0.9 },
            }}
            variant="contained" onClick={handleRegister}>
                Register
            </Button>
            <Typography variant="body2" style={{ marginTop: '10px' }}>
                Already have an account? <Link to="/">Login</Link>
            </Typography>
            </Box>
        </Container>
    );
};

export default Register;

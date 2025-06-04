import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel } from '@mui/material';
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
        <div style={{width: "100vw",padding: '20px'}}>
        <Container>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <TextField
                label="Username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
                margin="dense"
            />
            <TextField
                label="Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                margin="dense"
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
                margin="dense"
            />
            <Button variant="contained" onClick={handleRegister}>
                Register
            </Button>
            <Typography variant="body2" style={{ marginTop: '10px' }}>
                Already have an account? <Link to="/">Login</Link>
            </Typography>
        </Container>
        </div>
    );
};

export default Register;

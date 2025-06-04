import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, List, ListItem, ListItemText, Switch, Box } from '@mui/material';

const UserPageAccess = () => {
    const [userId, setUserId] = useState('');
    const [userFound, setUserFound] = useState(null);
    const [pages, setPages] = useState([]);
    const [pageAccess, setPageAccess] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSearchUser = async (e) => {
        e.preventDefault();
        if (!userId) return;

        
        setLoading(true);
        try {
            const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
            if (userResponse.data) {
                setUserFound(userResponse.data);
                fetchPages();
            } else {
                setUserFound(null);
                alert('User not found');
            }
        } catch (error) {
            console.error('Error searching user:', error);
        }
        setLoading(false);
    };

    const fetchPages = async () => {
        try {
            const pageResponse = await axios.get('http://localhost:5000/api/pages');
            setPages(pageResponse.data);
           
            const accessResponse = await axios.get(`http://localhost:5000/api/page_access/${userId}`);
            const accessData = accessResponse.data.reduce((acc, curr) => {
                acc[curr.page_id] = String(curr.page_privilege) === '1';
                
                return acc;
            }, {});

            setPageAccess(accessData);
           
        } catch (error) {
            console.error('Error fetching pages or access:', error);
        }
    };

    const handleToggleChange = async (pageId, hasAccess) => {
        const updatedAccess = !hasAccess;

        try {
            if (hasAccess === false) {
                const existingAccessResponse = await axios.get(`http://localhost:5000/api/page_access/${userId}`);
                const existingAccess = existingAccessResponse.data.find(access => access.page_id === pageId);

                if (!existingAccess) {
                    await axios.post('http://localhost:5000/api/page_access', {
                        user_id: userId,
                        page_id: pageId,
                        page_privilege: updatedAccess ? '1' : '0',
                    });
                } else {
                    await axios.put(`http://localhost:5000/api/page_access/${userId}/${pageId}`, {
                        page_privilege: updatedAccess ? '1' : '0',
                    });
                }
            } else {
                await axios.put(`http://localhost:5000/api/page_access/${userId}/${pageId}`, {
                    page_privilege: updatedAccess ? '1' : '0',
                });
            }
            setPageAccess((prevAccess) => ({
                ...prevAccess,
                [pageId]: updatedAccess,
            }));
        } catch (error) {
            if (error.response && error.response.status === 409) {
                try {
                    await axios.put(`http://localhost:5000/api/page_access/${userId}/${pageId}`, {
                        page_privilege: updatedAccess ? '1' : '0',
                    });
                    setPageAccess((prevAccess) => ({
                        ...prevAccess,
                        [pageId]: updatedAccess,
                    }));
                } catch (updateError) {
                    console.error('Error updating page access:', updateError);
                }
            } else {
                console.error('Error updating page access:', error);
            }
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>User Page Access Management</Typography>
            <form onSubmit={handleSearchUser} style={{ marginBottom: '16px' }}>
                <TextField 
                    label="Enter User ID"
                    variant="outlined"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    style={{ marginRight: '8px' }}
                />
                <Button type="submit" variant="contained" color="primary">Search User</Button>
            </form>

            {loading && <CircularProgress />}

            {userFound && (
                <Box mt={4}>
                    <Typography variant="h6">
                        Manage Page Access for User: {userFound.name} (ID: {userFound.id})
                    </Typography>
                    <List>
                        {pages.map((page) => (
                            <ListItem key={page.id} divider>
                                <ListItemText primary={page.page_description} secondary={`ID: ${page.id}`} />
                                <Switch
                                    checked={!!pageAccess[page.id]}
                                    onChange={() => handleToggleChange(page.id, !!pageAccess[page.id])}
                                    color="primary"
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {!userFound && !loading && <Typography>No user found. Please enter a valid User ID.</Typography>}
        </Box>
    );
};

export default UserPageAccess;

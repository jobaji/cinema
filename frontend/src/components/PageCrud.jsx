import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Box, Button, TextField, Typography, Card, CardContent, CardActions, Grid} from '@mui/material';


const PageCRUD = () => {
    const [pages, setPages] = useState([]);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [pageDescription, setPageDescription] = useState('');
    const [pageGroup, setPageGroup] = useState('');
    const [hasAccess, setHasAccess] = useState(false);    
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Retrieve userId from localStorage (make sure this exists and is correct)
        const userId = localStorage.getItem('userId');
        const pageId = 1; // The page ID for the Profile
        fetchPages(); // Refresh the list upon loading
        // If userId is missing, deny access early
        if (!userId) {
            setHasAccess(false);
            return;
        }

        // Function to check if the user has access
        const checkAccess = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);
                
                // Check if the API response contains the 'hasAccess' field
                if (response.data && typeof response.data.hasAccess === 'boolean') {
                    setHasAccess(response.data.hasAccess);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking access:', error);
                setHasAccess(false); // No access if there's an error
            }
        };

        checkAccess();
    }, []);



    // Function to fetch all pages from the server
    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pages');
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

    // Handle form submission for creating or updating a page
    const handleSubmit = async (e) => {
        e.preventDefault();
        const pageData = { page_description: pageDescription, page_group: pageGroup };

        try {
            if (currentPageId) {
                // Update existing page
                await axios.put(`http://localhost:5000/api/pages/${currentPageId}`, pageData);
            } else {
                // Create new page
                await axios.post('http://localhost:5000/api/pages', pageData);
            }
            fetchPages(); // Refresh the list of pages
            resetForm(); // Reset the form after submission
        } catch (error) {
            console.error('Error saving page:', error);
        }
    };

    // Reset the form fields
    const resetForm = () => {
        setCurrentPageId(null);
        setPageDescription('');
        setPageGroup('');
    };

    // Handle the edit action for a page
    const handleEdit = (page) => {
        setCurrentPageId(page.id);
        setPageDescription(page.page_description);
        setPageGroup(page.page_group);
    };

    // Handle the delete action for a page
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/pages/${id}`);
            fetchPages(); // Refresh the list of pages after deletion
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    };




   // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- START

    // If hasAccess is still null, show a loading state
    if (hasAccess === null) {
        return <div>Loading access information...</div>;
    }
  
    // Deny access if hasAccess is false
    if (!hasAccess) {
        return <div>You do not have access to this page. You need to ask permission to the administration.</div>;
    }
  // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- END


    return(
     <Box>
            <Typography variant="h4" gutterBottom>
                Page CRUD
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
            >
                <TextField
                    label="Page Description"
                    variant="outlined"
                    sx={{width: '25ch'}}
                    value={pageDescription}
                    onChange={(e) => setPageDescription(e.target.value)}
                />
                <TextField
                    label="Page Group"
                    variant="outlined"
                    sx={{width: '25ch'}}
                    value={pageGroup}
                    onChange={(e) => setPageGroup(e.target.value)}
                    
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        {currentPageId ? 'Update' : 'Create'}
                    </Button>
                    <Button onClick={resetForm} variant="outlined" color="secondary">
                        Reset
                    </Button>
                </Box>
            </Box>
            <Typography variant="h5" gutterBottom>
                Pages List
            </Typography>
            <Grid container spacing={2} paddingBottom={6}>
                {pages.map((page) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={page.id} >
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">{page.page_description}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Group: {page.page_group}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Page ID: {page.id}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" variant="outlined" color="secondary" onClick={() => handleEdit(page)}>
                                    Edit
                                </Button>
                                <Button size="small" variant="contained" color="error" onClick={() => handleDelete(page.id)}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};


export default PageCRUD;

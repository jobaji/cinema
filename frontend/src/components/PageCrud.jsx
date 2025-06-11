import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Card, CardContent, CardActions, Grid, Paper } from '@mui/material';

const PageCRUD = () => {
    const [pages, setPages] = useState([]);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [pageDescription, setPageDescription] = useState('');
    const [pageGroup, setPageGroup] = useState('');
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const pageId = 1; 

        fetchPages();

        if (!userId) {
            setHasAccess(false);
            return;
        }

        const checkAccess = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);
                if (response.data && typeof response.data.hasAccess === 'boolean') {
                    setHasAccess(response.data.hasAccess);
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking access:', error);
                setHasAccess(false);
            }
        };

        checkAccess();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pages');
            setPages(response.data);
        } catch (error) {
            console.error('Error fetching pages:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const pageData = { page_description: pageDescription, page_group: pageGroup };

        try {
            if (currentPageId) {
                await axios.put(`http://localhost:5000/api/pages/${currentPageId}`, pageData);
            } else {
                await axios.post('http://localhost:5000/api/pages', pageData);
            }
            fetchPages();
            resetForm();
        } catch (error) {
            console.error('Error saving page:', error);
        }
    };

    const resetForm = () => {
        setCurrentPageId(null);
        setPageDescription('');
        setPageGroup('');
    };

    const handleEdit = (page) => {
        setCurrentPageId(page.id);
        setPageDescription(page.page_description);
        setPageGroup(page.page_group);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/pages/${id}`);
            fetchPages();
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    };

    const printPages = () => {
        const printContent = `
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Group</th>
                    </tr>
                </thead>
                <tbody>
                    ${pages.map(page => `
                        <tr>
                            <td>${page.id}</td>
                            <td>${page.page_description}</td>
                            <td>${page.page_group}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Pages</title>
                </head>
                <body>
                    <h1>Pages List</h1>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    if (hasAccess === null) {
        return <div>Loading access information...</div>;
    }

    if (!hasAccess) {
        return <div>You do not have access to this page. You need to ask permission from the administration.</div>;
    }

    return (
        <Box p={4}>
            <Paper sx={{ padding: 3, marginBottom: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <Typography variant="h4">Page Dashboard</Typography>
                <Typography variant="h6">Total Pages: {pages.length}</Typography>
                <Button onClick={printPages} variant="contained" color="secondary">Print Pages</Button>
            </Paper>

            <Typography variant="h5" gutterBottom>
                Manage Pages
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <TextField label="Page Description" variant="outlined" sx={{ width: '25ch' }} value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} />
                <TextField label="Page Group" variant="outlined" sx={{ width: '25ch' }} value={pageGroup} onChange={(e) => setPageGroup(e.target.value)} />
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
                    <Grid item xs={12} sm={6} md={4} lg={3} key={page.id}>
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
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cinema' // Adjust this to your database name
});


// Create a new page
router.post('/pages', (req, res) => {
    const { page_description, page_group } = req.body;
    db.query(
        'INSERT INTO page_table (page_description, page_group) VALUES (?, ?)',
        [page_description, page_group],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: result.insertId, page_description, page_group });
        }
    );
});


// Read all pages
router.get('/pages', (req, res) => {
    db.query('SELECT * FROM page_table', (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});


// Read a single page by ID
router.get('/pages/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM page_table WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: 'Page not found' });
        res.status(200).json(result[0]);
    });
});


// Update a page
router.put('/pages/:id', (req, res) => {
    const { id } = req.params;
    const { page_description, page_group } = req.body;
    db.query(
        'UPDATE page_table SET page_description = ?, page_group = ? WHERE id = ?',
        [page_description, page_group, id],
        (err) => {
            if (err) return res.status(500).json(err);
            res.status(200).json({ id, page_description, page_group });
        }
    );
});


// Delete a page
router.delete('/pages/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM page_table WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.status(204).send();
    });
});



// Export the router
module.exports = router;

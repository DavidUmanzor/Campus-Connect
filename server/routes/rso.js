const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for database connection

// Create RSO
router.post('/create', async (req, res) => {
    const { name, description, admin_id, university_id } = req.body;
    try {
        const newRso = await pool.query(
            'INSERT INTO rsos (name, description, admin_id, university_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, admin_id, university_id]
        );
        res.json(newRso.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all RSOs
router.get('/all', async (req, res) => {
    try {
        const allRsos = await pool.query('SELECT * FROM rsos');
        res.json(allRsos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Search RSOs by name or description
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from query parameters
        const searchQuery = `%${query}%`; // Prepare the search query for a partial match
        const searchResults = await pool.query(
            "SELECT * FROM rsos WHERE name ILIKE $1 OR description ILIKE $1",
            [searchQuery]
        );
        res.json(searchResults.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a specific RSO by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rso = await pool.query('SELECT * FROM rsos WHERE rso_id = $1', [id]);
        res.json(rso.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all RSOs for a specific university
router.get('/university/:universityId', async (req, res) => {
    const { universityId } = req.params;
    try {
        const rsos = await pool.query(
            'SELECT * FROM rsos WHERE university_id = $1',
            [universityId]
        );
        res.json(rsos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update RSO
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, admin_id, university_id } = req.body;
    try {
        const updateRso = await pool.query(
            'UPDATE rsos SET name = $1, description = $2, admin_id = $3, university_id = $4 WHERE rso_id = $5',
            [name, description, admin_id, university_id, id]
        );
        res.json('RSO was updated');
    } catch (err) {
        console.error(err.message);
    }
});

// Delete RSO
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteRso = await pool.query('DELETE FROM rsos WHERE rso_id = $1', [id]);
        res.json('RSO was deleted');
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
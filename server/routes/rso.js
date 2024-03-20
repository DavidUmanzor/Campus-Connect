const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for database connection

// Create RSO
router.post('/create', async (req, res) => {
    const { name, description, admin_id, university_id } = req.body;
    try {
        const newRso = await pool.query(
            'INSERT INTO rso (name, description, admin_id, university_id) VALUES ($1, $2, $3, $4) RETURNING *',
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
        const allRsos = await pool.query('SELECT * FROM rso');
        res.json(allRsos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get a specific RSO by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rso = await pool.query('SELECT * FROM rso WHERE rso_id = $1', [id]);
        res.json(rso.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Update RSO
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, admin_id, university_id } = req.body;
    try {
        const updateRso = await pool.query(
            'UPDATE rso SET name = $1, description = $2, admin_id = $3, university_id = $4 WHERE rso_id = $5',
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
        const deleteRso = await pool.query('DELETE FROM rso WHERE rso_id = $1', [id]);
        res.json('RSO was deleted');
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;
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

router.get('/:rsoId', async (req, res) => {
    const { rsoId } = req.params;
    try {
        const rsoDetails = await pool.query(`
            SELECT r.*, COUNT(ur.user_id) AS member_count, r.is_active
            FROM RSOs r
            LEFT JOIN User_RSOs ur ON r.rso_id = ur.rso_id
            WHERE r.rso_id = $1
            GROUP BY r.rso_id
        `, [rsoId]);

        if (rsoDetails.rows.length === 0) {
            return res.status(404).json({ message: "RSO not found." });
        }

        res.json(rsoDetails.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Check if a user is the admin of an RSO
router.get('/admin/:rsoId', async (req, res) => {
    const { rsoId } = req.params;
    const userId = req.query.userId; // Expecting userId to be passed as query parameter

    try {
        const rsoQuery = await pool.query(
            'SELECT admin_id FROM RSOs WHERE rso_id = $1',
            [rsoId]
        );

        if (rsoQuery.rows.length === 0) {
            return res.status(404).json({ message: "RSO not found" });
        }

        const isAdmin = rsoQuery.rows[0].admin_id == userId;
        res.json({ isAdmin });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", details: err.message });
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
    const { name, description } = req.body;

    try {
        await pool.query('UPDATE rsos SET name = $1, description = $2 WHERE rso_id = $3', [name, description, id]);
        res.json({ message: "RSO updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
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
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for PostgreSQL pool

// CREATE Event
router.post('/create', async (req, res) => {
    const { name, category, description, event_time, event_date, location_name, contact_phone, contact_email, visibility, created_by, university_id, rso_id } = req.body;

    // Prepare the SQL query with optional rso_id
    const queryText = `
        INSERT INTO events 
        (name, category, description, event_time, event_date, location_name, contact_phone, contact_email, visibility, created_by, university_id, rso_id) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`;

    // Use null if rso_id is not provided or invalid
    const values = [name, category, description, event_time, event_date, location_name, contact_phone, contact_email, visibility, created_by, university_id, rso_id || null];

    try {
        const newEvent = await pool.query(queryText, values);
        res.json(newEvent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", details: err.message });
    }
});



// READ all Events
router.get('/all', async (req, res) => {
    try {
        const allEvents = await pool.query("SELECT * FROM events");
        res.json(allEvents.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// GET all events for a specific university
router.get('/university/:universityId', async (req, res) => {
    const { universityId } = req.params;
    try {
        const events = await pool.query(
            'SELECT * FROM events WHERE university_id = $1',
            [universityId]
        );
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all events for a specific RSO
router.get('/rso/:rsoId', async (req, res) => {
    const { rsoId } = req.params;
    try {
        const events = await pool.query(
            'SELECT * FROM events WHERE rso_id = $1',
            [rsoId]
        );
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});


// Enhanced search to consider event visibility and user membership in RSOs
router.get("/search", async (req, res) => {
    const { query, userId } = req.query; // Expect userId to be passed as a query parameter

    try {
        // This SQL is hypothetical and needs to be adjusted based on your actual database schema.
        // It assumes there is a way to check if a user is a member of the RSO (via a JOIN on User_RSOs for example).
        const sql = `
            SELECT e.* FROM events e
            LEFT JOIN User_RSOs ur ON e.rso_id = ur.rso_id AND ur.user_id = $2
            WHERE (e.name ILIKE $1 OR e.description ILIKE $1)
            AND (
                e.visibility = 'public' OR 
                (e.visibility = 'rso' AND ur.user_id IS NOT NULL)
            )`;
        
        const searchQuery = `%${query}%`;
        const events = await pool.query(sql, [searchQuery, userId]);

        res.json(events.rows);
    } catch (err) {
        console.error("Error searching events: ", err);
        res.status(500).json({ message: "Server error", details: err.message });
    }
});

// READ a single Event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);
        res.json(event.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// UPDATE Event
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, description, event_time, event_date, location, contact_phone, contact_email, visibility, created_by, university_id } = req.body;
        const updateEvent = await pool.query(
            "UPDATE events SET name = $1, category = $2, description = $3, event_time = $4, event_date = $5, location = $6, contact_phone = $7, contact_email = $8, visibility = $9, created_by = $10, university_id = $11 WHERE event_id = $12",
            [name, category, description, event_time, event_date, location, contact_phone, contact_email, visibility, created_by, university_id, id]
        );
        res.json("Event was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// DELETE Event
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM events WHERE event_id = $1", [id]);
        res.json("Event was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

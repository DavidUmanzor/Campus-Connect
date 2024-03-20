const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file for PostgreSQL pool

// CREATE Event
router.post('/create', async (req, res) => {
    try {
        const { name, category, description, event_time, event_date, location, contact_phone, contact_email, visibility, created_by, university_id } = req.body;
        const newEvent = await pool.query(
            "INSERT INTO event (name, category, description, event_time, event_date, location, contact_phone, contact_email, visibility, created_by, university_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [name, category, description, event_time, event_date, location, contact_phone, contact_email, visibility, created_by, university_id]
        );
        res.json(newEvent.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// READ all Events
router.get('/all', async (req, res) => {
    try {
        const allEvents = await pool.query("SELECT * FROM event");
        res.json(allEvents.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// READ a single Event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await pool.query("SELECT * FROM event WHERE event_id = $1", [id]);
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
            "UPDATE event SET name = $1, category = $2, description = $3, event_time = $4, event_date = $5, location = $6, contact_phone = $7, contact_email = $8, visibility = $9, created_by = $10, university_id = $11 WHERE event_id = $12",
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
        await pool.query("DELETE FROM event WHERE event_id = $1", [id]);
        res.json("Event was deleted!");
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

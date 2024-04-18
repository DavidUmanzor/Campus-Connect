const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/create', async (req, res) => {
    const { name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id } = req.body;

    try {
        // Check for any events at the same location and time
        const conflictCheckQuery = `
            SELECT r.name AS rso_name, e.location_name, e.event_time
            FROM events e
            JOIN RSOs r ON e.rso_id = r.rso_id
            WHERE e.location_name = $1 AND e.event_date = $2 AND e.event_time = $3 AND r.is_active = true
            LIMIT 1;
        `;
        const conflictCheck = await pool.query(conflictCheckQuery, [location_name, event_date, event_time]);
        
        if (conflictCheck.rows.length > 0) {
            const conflictEvent = conflictCheck.rows[0];
            return res.status(409).json({ message: `Conflict with event from "${conflictEvent.rso_name}" - ${conflictEvent.location_name}, at ${conflictEvent.event_time}.` });
        }

        // No conflict found
        const createEventQuery = `
            INSERT INTO events 
            (name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
            RETURNING *`;

        // Execute the query to create a new event
        const newEvent = await pool.query(createEventQuery, [name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id || null]);
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


router.get("/search", async (req, res) => {
    const { query, userId } = req.query;

    try {
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

router.get('/allowed/', async (req, res) => {
    const { userId } = req.query;
    try {
        const events = await pool.query(`
            SELECT e.* FROM Events e
            LEFT JOIN RSOs r ON e.rso_id = r.rso_id
            WHERE e.visibility = 'public'
            OR (e.visibility = 'private' AND e.university_id = (SELECT university_id FROM Users WHERE user_id = $1))
            OR (e.visibility = 'rso' AND e.rso_id IN (SELECT rso_id FROM User_RSOs WHERE user_id = $1) AND r.is_active)
        `, [userId]);
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
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
    const { id } = req.params;
    const { name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id } = req.body;

    const updateEventQuery = `
        UPDATE events SET 
        name = $1, 
        category = $2, 
        description = $3, 
        event_time = $4, 
        event_date = $5, 
        location_name = $6, 
        latitude = $7, 
        longitude = $8, 
        contact_phone = $9, 
        contact_email = $10, 
        visibility = $11, 
        created_by = $12, 
        university_id = $13, 
        rso_id = $14
        WHERE event_id = $15
    `;

    const updateValues = [name, category, description, event_time, event_date, location_name, latitude, longitude, contact_phone, contact_email, visibility, created_by, university_id, rso_id, id];

    try {
        const updateEvent = await pool.query(updateEventQuery, updateValues);
        if (updateEvent.rowCount > 0) {
            res.json("Event was updated!");
        } else {
            res.status(404).json({ message: "Event not found or no changes made." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", details: err.message });
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

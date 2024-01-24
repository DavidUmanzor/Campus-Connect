const express = require('express');
const router = express.Router();
const pool = require("../db");

// POST route to create a university
router.post('/create', async (req, res) => {
    try {
        const { name, location, description, number_of_students, pictures } = req.body;
        const newUniversity = await pool.query(
            "INSERT INTO universities (name, location, description, number_of_students, pictures) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, location, description, number_of_students, pictures]
        );
        res.json(newUniversity.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//get all universities
router.get('/all', async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

//get a university

//edit a university

//delete a university

module.exports = router;
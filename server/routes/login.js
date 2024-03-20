// login.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a db.js file that sets up your database connection
const bcrypt = require('bcrypt');

// Login route
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            // Compare hashed password from the database with the provided password
            const isValidPassword = await password.toLowerCase() == user.rows[0].password.toLowerCase();
            if (isValidPassword) {
                // Passwords match
                // You can add token creation or session handling here if needed
                res.json({ message: "Login successful", user_id: user.rows[0].user_id });
            } else {
                // Passwords don't match
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            // User not found
            res.status(401).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

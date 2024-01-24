const express = require('express');
const router = express.Router();
const pool = require("../db");

// Create a user
router.post("/create", async(req,res) => {
    try {
        const { name, email, password, role, university_id } = req.body;
        
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, role, university_id) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [name, email, password, role, university_id]
            );
        res.json(newUser.rows[0]);
    }   catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// Get all users
router.get('/all', async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get a user by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Edit a user
router.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params; // The user's ID
        const { name, email, password, role, university_id } = req.body; // Data from the request body

        // Retrieve the current user details
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Set up an object to hold the updated data
        const updatedUser = {
            name: name || user.rows[0].name,
            email: email || user.rows[0].email,
            password: password || user.rows[0].password,
            role: role || user.rows[0].role,
            university_id: university_id || user.rows[0].university_id
        };

        // Update the user details, skipping any fields that are null or empty
        const updatedUserResult = await pool.query(
            "UPDATE users SET name = $1, email = $2, password = $3, role = $4, university_id = $5 WHERE id = $6 RETURNING *",
            [updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.university_id, id]
        );

        res.json(updatedUserResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
        if (deleteUser.rows.length > 0) {
            res.json({ message: "User deleted successfully." });
        } else {
            res.json({ message: "User not found." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
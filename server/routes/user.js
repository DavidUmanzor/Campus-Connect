const express = require('express');
const router = express.Router();
const pool = require("../db");
const bcrypt = require('bcrypt');

/// Create Actions

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

/// Change Actions

// Update a user
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params; // The user's ID
        const { name, email, password, role, university_id } = req.body; // Data from the request body

        // Corrected: Use "user_id" instead of "id" in the WHERE clause
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedUser = {
            name: name || user.rows[0].name,
            email: email || user.rows[0].email,
            password: password || user.rows[0].password,
            role: role || user.rows[0].role,
            university_id: university_id || user.rows[0].university_id
        };

        // Corrected: Use "user_id" instead of "id" in the WHERE clause
        const updatedUserResult = await pool.query(
            "UPDATE users SET name = $1, email = $2, password = $3, role = $4, university_id = $5 WHERE user_id = $6 RETURNING *",
            [updatedUser.name, updatedUser.email, updatedUser.password, updatedUser.role, updatedUser.university_id, id]
        );

        res.json(updatedUserResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Change user email
router.put("/change-email/:id", async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        await pool.query("UPDATE users SET email = $1 WHERE user_id = $2", [email, id]);
        res.json({ message: "Email updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Change user email
router.put("/change-password/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, id]);
        res.json({ message: "Password updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});


// Change user's university
router.put("/change-university/:id", async (req, res) => {
    const { id } = req.params; // User's ID
    const { universityName } = req.body; // New university name

    try {
        // Check if university exists
        let uniRes = await pool.query("SELECT university_id FROM universities WHERE name = $1", [universityName]);
        let universityId;

        if (uniRes.rows.length > 0) {
            universityId = uniRes.rows[0].university_id;
        } else {
            // Create new university if it doesn't exist
            uniRes = await pool.query("INSERT INTO universities (name) VALUES ($1) RETURNING university_id", [universityName]);
            universityId = uniRes.rows[0].university_id;
        }

        // Update user's university_id
        await pool.query("UPDATE users SET university_id = $1 WHERE user_id = $2", [universityId, id]);
        res.json({ message: "University updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Information Actions

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

// Get user role
router.get("/role/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const roleRes = await pool.query("SELECT role FROM users WHERE user_id = $1", [id]);
        if (roleRes.rows.length > 0) {
            res.json({ role: roleRes.rows[0].role });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
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

// Deletion Actions

// Delete a user
router.delete('/delete/:id', async (req, res) => {
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
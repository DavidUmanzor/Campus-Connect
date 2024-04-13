const express = require('express');
const router = express.Router();
const pool = require("../db");
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    
    // Extract and format the school key from the email address
    try {
        const emailParts = email.split('@');
        if (emailParts.length !== 2 || !emailParts[1].endsWith('.edu')) {
            return res.status(400).json({ message: "Invalid educational email format." });
        }
        const domainParts = emailParts[1].split('.');
        const schoolKey = domainParts[0].toLowerCase();  // Normalize to lowercase

        // Find a university with a matching school key
        const uniRes = await pool.query("SELECT university_id FROM Universities WHERE email_domain = $1", [schoolKey]);
        
        if (uniRes.rows.length === 0) {
            // No university found, offer to create one
            return res.status(404).json({ message: "No university found with your email domain. Would you like to create one?", createUniversity: true });
        }
        
        const universityId = uniRes.rows[0].university_id;
        
        // Hash the password (ensure you have bcrypt installed)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the user with the university ID
        const newUser = await pool.query(
            "INSERT INTO Users (name, email, password, university_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, hashedPassword, universityId]
        );
        
        res.json({ message: "User created successfully.", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;

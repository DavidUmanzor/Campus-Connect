const express = require('express');
const router = express.Router();
const pool = require("../db");
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    
    // Extract the domain from the email address
    const emailDomain = email.split('@')[1];
    
    try {
        // Find a university with a matching email domain
        const uniRes = await pool.query("SELECT university_id FROM Universities WHERE email_domain = $1", [emailDomain]);
        
        if (uniRes.rows.length === 0) {
            return res.status(400).json({ message: "No university found with your email domain." });
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

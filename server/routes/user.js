const express = require('express');
const router = express.Router();
const pool = require("../db");

//create user
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

//get all users

//get a user

//edit a user

//delete a user
module.exports = router;
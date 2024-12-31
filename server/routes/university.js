const express = require('express');
const router = express.Router();
const pool = require('../db');

// Creation Actions

// Create a new university
router.post("/create", async (req, res) => {
    try {
        const { name, location, description, number_of_students, pictures, email_domain, latitude, longitude } = req.body;
        const newUniversity = await pool.query(
            "INSERT INTO universities (name, location, description, number_of_students, pictures, email_domain, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [name, location, description, number_of_students, pictures, email_domain, latitude, longitude]
        );
        res.json(newUniversity.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit Actions

// Update a university
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, location, description, number_of_students, pictures, email_domain, latitude, longitude } = req.body;
    let queryParts = [];
    let queryValues = [];
    let counter = 1;

    if (name) { queryParts.push(`name = $${counter}`); queryValues.push(name); counter++; }
    if (location) { queryParts.push(`location = $${counter}`); queryValues.push(location); counter++; }
    if (description) { queryParts.push(`description = $${counter}`); queryValues.push(description); counter++; }
    if (number_of_students) { queryParts.push(`number_of_students = $${counter}`); queryValues.push(number_of_students); counter++; }
    if (pictures) { queryParts.push(`pictures = $${counter}`); queryValues.push(pictures); counter++; }
    if (email_domain) { queryParts.push(`email_domain = $${counter}`); queryValues.push(email_domain); counter++; }
    if (latitude !== undefined) { queryParts.push(`latitude = $${counter}`); queryValues.push(latitude); counter++; }
    if (longitude !== undefined) { queryParts.push(`longitude = $${counter}`); queryValues.push(longitude); counter++; }
    
    queryValues.push(id);

    if (queryParts.length > 0) {
        let updateQuery = `UPDATE universities SET ${queryParts.join(", ")} WHERE university_id = $${counter}`;
        const result = await pool.query(updateQuery, queryValues);
        if (result.rowCount > 0) {
            res.json({ message: "University updated successfully." });
        } else {
            res.status(404).json({ message: "University not found or no changes made." });
        }
    } else {
        res.status(400).json({ message: "No fields to update were provided." });
    }
});

// Get Information Actions

// Get all universities
router.get("/all", async (req, res) => {
    try {
        const allUniversities = await pool.query("SELECT * FROM universities");
        res.json(allUniversities.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Search universities by name or description
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from query parameters
        const searchQuery = `%${query}%`; // Prepare the search query for a partial match
        const searchResults = await pool.query(
            "SELECT * FROM universities WHERE name ILIKE $1 OR description ILIKE $1",
            [searchQuery]
        );
        res.json(searchResults.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a specific university
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const university = await pool.query("SELECT * FROM universities WHERE university_id = $1", [id]);
        res.json(university.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Deletion Actions

// Delete a university
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM universities WHERE university_id = $1", [id]);
        res.json("University was deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

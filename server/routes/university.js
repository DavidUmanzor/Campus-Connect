const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new university
router.post("/create", async (req, res) => {
    try {
        const { name, location, description, number_of_students, pictures } = req.body;
        const newUniversity = await pool.query(
            "INSERT INTO universities (name, location, description, number_of_students, pictures) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, location, description, number_of_students, pictures]
        );
        res.json(newUniversity.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

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

// Update a university
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, description, number_of_students, pictures } = req.body;
        let updateQuery = "UPDATE universities SET ";
        let updateFields = [];
        let queryValues = [];
        let counter = 1;

        if (name !== undefined) {
            updateFields.push(`name = $${counter++}`);
            queryValues.push(name);
        }
        if (location !== undefined) {
            updateFields.push(`location = $${counter++}`);
            queryValues.push(location);
        }
        if (description !== undefined) {
            updateFields.push(`description = $${counter++}`);
            queryValues.push(description);
        }
        if (number_of_students !== undefined) {
            updateFields.push(`number_of_students = $${counter++}`);
            queryValues.push(number_of_students);
        }
        if (pictures !== undefined) {
            updateFields.push(`pictures = $${counter++}`);
            queryValues.push(pictures);
        }

        if (queryValues.length > 0) {
            updateQuery += updateFields.join(", ") + ` WHERE university_id = $${counter}`;
            queryValues.push(id);

            await pool.query(updateQuery, queryValues);
            res.json("University was updated");
        } else {
            res.json("No fields to update");
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

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

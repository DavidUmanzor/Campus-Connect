const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new comment rating
router.post('/create', async (req, res) => {
    const { user_id, event_id, text, rating } = req.body;
    try {
        const newCommentRating = await pool.query(
            'INSERT INTO commentsratings (user_id, event_id, text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, event_id, text, rating]
        );
        res.json(newCommentRating.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all comment ratings
router.get('/all', async (req, res) => {
    try {
        const allCommentsRatings = await pool.query('SELECT * FROM commentsratings');
        res.json(allCommentsRatings.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get a specific comment rating
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const commentRating = await pool.query(
            'SELECT * FROM commentsratings WHERE comment_id = $1',
            [id]
        );
        res.json(commentRating.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all comments for a specific event
router.get('/event/:eventId', async (req, res) => {
    const { eventId } = req.params;
    try {
        const commentsRatings = await pool.query(
            'SELECT * FROM commentsratings WHERE event_id = $1',
            [eventId]
        );
        res.json(commentsRatings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a comment rating
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { text, rating, user_id, event_id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE commentsratings SET text = $1, rating = $2 WHERE comment_id = $3 AND user_id = $4 RETURNING *",
            [text, rating, id, user_id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Comment not found or no changes made.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error", details: err.message });
    }
});

// Delete a comment rating
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM commentsratings WHERE comment_id = $1', [id]);
        res.json('Comment Rating was deleted!');
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

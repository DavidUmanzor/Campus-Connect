const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Add a user to an RSO
router.post('/add', async (req, res) => {
    const { userId, rsoId } = req.body;
    try {
        const newUserRso = await pool.query(
            'INSERT INTO User_RSOs (user_id, rso_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
            [userId, rsoId]
        );
        if (newUserRso.rows.length > 0) {
            res.json({ message: "User added to RSO successfully.", newUserRso: newUserRso.rows[0] });
        } else {
            res.status(400).json({ message: "User already a member or invalid IDs." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove a user from an RSO
router.delete('/remove', async (req, res) => {
    const { userId, rsoId } = req.body;
    try {
        const deleteUserRso = await pool.query(
            'DELETE FROM User_RSOs WHERE user_id = $1 AND rso_id = $2 RETURNING *',
            [userId, rsoId]
        );
        if (deleteUserRso.rows.length > 0) {
            res.json({ message: "User removed from RSO successfully." });
        } else {
            res.status(404).json({ message: "Membership not found." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Check if a user is a member of an RSO
router.post('/checkMembership', async (req, res) => {
    const { userId, rsoId } = req.body;
    try {
        const checkMembership = await pool.query(
            'SELECT 1 FROM User_RSOs WHERE user_id = $1 AND rso_id = $2',
            [userId, rsoId]
        );
        if (checkMembership.rows.length > 0) {
            res.json({ isMember: true });
        } else {
            res.json({ isMember: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all RSOs a user is part of
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userRsos = await pool.query(
            'SELECT r.* FROM RSOs r INNER JOIN User_RSOs ur ON r.rso_id = ur.rso_id WHERE ur.user_id = $1',
            [userId]
        );
        res.json(userRsos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all users that are part of a specific RSO
router.get('/members/:rsoId', async (req, res) => {
    const { rsoId } = req.params;
    try {
        const rsoUsers = await pool.query(
            'SELECT u.* FROM Users u INNER JOIN User_RSOs ur ON u.user_id = ur.user_id WHERE ur.rso_id = $1',
            [rsoId]
        );
        res.json(rsoUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
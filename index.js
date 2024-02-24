const express = require('express');
const mysql = require('mysql2/promise');
const pool = require('./db');

const populateDatabase = require('./populateDB');
const app = express();

// Function to Populate Database with 10000 entries
// populateDatabase();


// EndPoint to fetch current week's leaderboard
app.get('/leaderboard/current-week', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM leaderboard_table WHERE TimeStamp >= CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) + 6 DAY ORDER BY Score DESC LIMIT 200'
        );
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// EndPoint to fetch last week leaderboard given a country by user
app.get('/leaderboard/last-week/:country', async (req, res) => {
    const country = req.params.country;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT * FROM leaderboard_table WHERE Country = ? AND TimeStamp >= CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) + 6 DAY - INTERVAL 1 WEEK AND TimeStamp < CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) - 1 DAY ORDER BY Score DESC LIMIT 200`,
            [country]
        );
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// EndPoint to fetch user Rank given userId
app.get('/user/:userId/rank', async (req, res) => {
    const userId = req.params.userId;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT COUNT(*) AS rank FROM leaderboard_table WHERE Score > (SELECT Score FROM leaderboard_table WHERE UID = ?)`,
            [userId]
        );
        connection.release();
        res.json(rows[0].rank + 1); // Add 1 to get the actual rank
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});
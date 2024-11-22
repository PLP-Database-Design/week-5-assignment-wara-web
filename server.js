const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Create DB connection
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting:', err);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// Retrieve all patients
app.get('/patients', (req, res) => {
    const query = `
        SELECT patient_id, first_name, last_name, date_of_birth 
        FROM patients;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
    const query = `
        SELECT first_name, last_name, provider_speciality 
        FROM providers;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
    const { first_name } = req.params;
    const query = `
        SELECT patient_id, first_name, last_name, date_of_birth 
        FROM patients 
        WHERE first_name = ?;
    `;
    connection.query(query, [first_name], (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    const query = `
        SELECT first_name, last_name, provider_speciality 
        FROM providers 
        WHERE provider_speciality = ?;
    `;
    connection.query(query, [specialty], (err, results) => {
        if (err) {
            console.error('Error running query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get all diseases and their medicines
app.get('/api/diseases', (req, res) => {
    // Read the JSON data file
    fs.readFile(path.join(__dirname, 'data', 'diseases.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const diseases = JSON.parse(data).diseases; // Ensure diseases is correctly extracted
            res.json(diseases);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

// Endpoint to get medicines for a specific disease
app.get('/api/diseases/:name', (req, res) => {
    const diseaseName = req.params.name.toLowerCase();

    // Read the JSON data file
    fs.readFile(path.join(__dirname, 'data', 'diseases.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const diseases = JSON.parse(data).diseases; // Ensure diseases is correctly extracted
            const foundDisease = diseases.find(disease => disease.name.toLowerCase() === diseaseName);

            if (!foundDisease) {
                res.status(404).json({ error: 'Disease not found' });
            } else {
                res.json(foundDisease.medicines);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

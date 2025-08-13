// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Import the database and routes
const db = require('./db/database');
const candidateRoutes = require('./routes/candidateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const instituteRoutes = require('./routes/instituteRoutes');

// Middleware to enable CORS for the frontend origin
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
};

// app.use(cors(corsOptions));
app.use(cors());
// Middleware to parse JSON bodies from requests
app.use(express.json());

// Main entry point for our candidate-related APIs
app.use('/api/candidates', candidateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/institutes', instituteRoutes);

// Correct the root directory path for your frontend files.
const frontendPath = path.join(__dirname, './rams-frontend/public');

// Explicitly serve static files from the frontend directory.
// This handles all assets like images, CSS, and JS files.
app.use(express.static(frontendPath));

// Server-side routes for your frontend pages.
// These routes handle clean URLs by serving the correct HTML file.
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(frontendPath, 'dashboard.html'));
});

app.get('/institutes', (req, res) => {
    res.sendFile(path.join(frontendPath, 'institutes.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'register.html'));
});

app.get('/custom-register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'custom-register.html'));
});

// A simple health check route
app.get('/', (req, res) => {
    res.send('Welcome to the RAMS backend API!');
});

// Start the server and connect to the database
async function startServer() {
    try {
        await db.pool.connect();
        console.log('✅ Connected successfully to the Neon database.');
        app.listen(port, () => {
            console.log(`🚀 RAMS backend and frontend listening on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    }
}

startServer();

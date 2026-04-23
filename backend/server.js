const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle SPA routing - send all other requests to index.html
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the portal at: http://localhost:${PORT}`);
});

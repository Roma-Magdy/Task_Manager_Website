require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // <--- Import routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
require('./src/config/db');

// Routes
app.use('/api/auth', authRoutes); // 

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const projectsRoutes = require('./src/routes/projectsRoutes');
const tasksRoutes = require('./src/routes/tasksRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Database Connection
require('./src/config/db');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
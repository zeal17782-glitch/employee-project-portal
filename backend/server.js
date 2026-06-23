const express = require('express');
const cors = require('cors');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// ============================================
// IMPORT ROUTES
// ============================================
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const projectRoutes = require('./routes/projects');

// ============================================
// IMPORT MIDDLEWARE & DATABASE
// ============================================
const { authenticateToken } = require('./middleware/auth');
const pool = require('./config/database');

// ============================================
// TEST ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend server is running successfully!',
    version: '1.0',
    timestamp: new Date()
  });
});

app.post('/test', (req, res) => {
  console.log('TEST ROUTE HIT!');
  console.log('Body:', req.body);
  res.json({ 
    message: 'Test works!', 
    body: req.body 
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/projects', projectRoutes);

// ============================================
// DASHBOARD ROUTE
// ============================================
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const totalEmployees = await pool.query('SELECT COUNT(*) FROM employees');
    const totalProjects = await pool.query('SELECT COUNT(*) FROM projects');
    const activeProjects = await pool.query("SELECT COUNT(*) FROM projects WHERE status = 'Active'");

    res.json({
      totalEmployees: parseInt(totalEmployees.rows[0].count),
      totalProjects: parseInt(totalProjects.rows[0].count),
      activeProjects: parseInt(activeProjects.rows[0].count)
    });
  } catch (error) {
    console.log('Dashboard error:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found.' 
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong.' 
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Server is ready to accept requests!');
});
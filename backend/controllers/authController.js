const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key_change_this_later_12345';

exports.signup = async (req, res) => {
  try {
    console.log('=== SIGNUP STARTED ===');
    console.log('Body:', req.body);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide name, email and password.' 
      });
    }

    // Check if email exists
    const checkQuery = 'SELECT id FROM users WHERE email = $1';
    const checkValues = [email];
    const existingUser = await pool.query(checkQuery, checkValues);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Email is already registered.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Insert user
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
    const insertValues = [name, email, hashedPassword];
    const result = await pool.query(insertQuery, insertValues);

    console.log('=== USER CREATED ===', result.rows[0]);

    return res.status(201).json({ 
      message: 'User registered successfully!',
      user: result.rows[0]
    });

  } catch (error) {
    console.log('=== SIGNUP ERROR ===');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Detail:', error.detail);
    
    return res.status(500).json({ 
      error: 'Server error during signup.',
      details: error.message,
      code: error.code
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('=== LOGIN STARTED ===');

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password.' 
      });
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const user = await pool.query(query, values);

    if (user.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Email not found.' 
      });
    }

    const userData = user.rows[0];
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(400).json({ 
        error: 'Incorrect password.' 
      });
    }

    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        name: userData.name 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('=== LOGIN SUCCESSFUL ===');

    return res.json({ 
      message: 'Login successful!',
      token: token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    });

  } catch (error) {
    console.log('=== LOGIN ERROR ===');
    console.log('Message:', error.message);
    
    return res.status(500).json({ 
      error: 'Server error during login.',
      details: error.message
    });
  }
};
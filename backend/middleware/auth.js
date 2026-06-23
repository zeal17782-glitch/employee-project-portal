const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key_change_this_later_12345';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required. Please login first.' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid or expired token.' 
      });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
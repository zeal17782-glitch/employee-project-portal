const { Pool } = require('pg');

console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  hasPassword: !!process.env.DB_PASSWORD,
  hasURL: !!process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Error details:', err);
  } else {
    console.log('✅ Database connected successfully!');
    release();
  }
});

module.exports = pool;
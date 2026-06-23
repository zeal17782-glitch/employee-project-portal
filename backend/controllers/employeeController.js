const pool = require('../config/database');

// ============================================
// GET ALL EMPLOYEES
// ============================================
exports.getAllEmployees = async (req, res) => {
  try {
    console.log('=== GET ALL EMPLOYEES ===');

    const result = await pool.query(
      'SELECT * FROM employees ORDER BY created_at DESC'
    );

    res.json({
      message: 'Employees fetched successfully!',
      count: result.rows.length,
      employees: result.rows
    });

  } catch (error) {
    console.log('GET EMPLOYEES ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while fetching employees.',
      details: error.message
    });
  }
};

// ============================================
// GET SINGLE EMPLOYEE
// ============================================
exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== GET EMPLOYEE BY ID:', id, '===');

    const result = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Employee not found.' 
      });
    }

    // Get assigned projects for this employee
    const projects = await pool.query(
      `SELECT p.* FROM projects p 
       INNER JOIN employee_projects ep ON p.id = ep.project_id 
       WHERE ep.employee_id = $1`,
      [id]
    );

    res.json({
      message: 'Employee fetched successfully!',
      employee: result.rows[0],
      projects: projects.rows
    });

  } catch (error) {
    console.log('GET EMPLOYEE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while fetching employee.',
      details: error.message
    });
  }
};

// ============================================
// CREATE EMPLOYEE
// ============================================
exports.createEmployee = async (req, res) => {
  try {
    console.log('=== CREATE EMPLOYEE ===');
    console.log('Body:', req.body);

    const full_name = req.body.full_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const designation = req.body.designation;
    const department = req.body.department;
    const joining_date = req.body.joining_date;
    const profile_image = req.file ? req.file.filename : null;

    if (!full_name || !email) {
      return res.status(400).json({ 
        error: 'Full name and email are required.' 
      });
    }

    // Check if email already exists
    const existingEmployee = await pool.query(
      'SELECT id FROM employees WHERE email = $1',
      [email]
    );

    if (existingEmployee.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Employee with this email already exists.' 
      });
    }

    const result = await pool.query(
      `INSERT INTO employees 
       (full_name, email, phone, designation, department, joining_date, profile_image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [full_name, email, phone, designation, department, joining_date, profile_image]
    );

    console.log('=== EMPLOYEE CREATED ===', result.rows[0]);

    res.status(201).json({
      message: 'Employee created successfully!',
      employee: result.rows[0]
    });

  } catch (error) {
    console.log('CREATE EMPLOYEE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while creating employee.',
      details: error.message
    });
  }
};

// ============================================
// UPDATE EMPLOYEE
// ============================================
exports.updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== UPDATE EMPLOYEE:', id, '===');

    // Check if employee exists
    const existing = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Employee not found.' 
      });
    }

    const full_name = req.body.full_name || existing.rows[0].full_name;
    const email = req.body.email || existing.rows[0].email;
    const phone = req.body.phone || existing.rows[0].phone;
    const designation = req.body.designation || existing.rows[0].designation;
    const department = req.body.department || existing.rows[0].department;
    const joining_date = req.body.joining_date || existing.rows[0].joining_date;
    const profile_image = req.file ? req.file.filename : existing.rows[0].profile_image;

    const result = await pool.query(
      `UPDATE employees SET 
       full_name = $1,
       email = $2,
       phone = $3,
       designation = $4,
       department = $5,
       joining_date = $6,
       profile_image = $7
       WHERE id = $8
       RETURNING *`,
      [full_name, email, phone, designation, department, joining_date, profile_image, id]
    );

    console.log('=== EMPLOYEE UPDATED ===', result.rows[0]);

    res.json({
      message: 'Employee updated successfully!',
      employee: result.rows[0]
    });

  } catch (error) {
    console.log('UPDATE EMPLOYEE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while updating employee.',
      details: error.message
    });
  }
};

// ============================================
// DELETE EMPLOYEE
// ============================================
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== DELETE EMPLOYEE:', id, '===');

    const existing = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Employee not found.' 
      });
    }

    await pool.query(
      'DELETE FROM employees WHERE id = $1',
      [id]
    );

    console.log('=== EMPLOYEE DELETED ===');

    res.json({
      message: 'Employee deleted successfully!'
    });

  } catch (error) {
    console.log('DELETE EMPLOYEE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while deleting employee.',
      details: error.message
    });
  }
};
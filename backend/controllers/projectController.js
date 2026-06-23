const pool = require('../config/database');

// ============================================
// GET ALL PROJECTS
// ============================================
exports.getAllProjects = async (req, res) => {
  try {
    console.log('=== GET ALL PROJECTS ===');

    const result = await pool.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );

    res.json({
      message: 'Projects fetched successfully!',
      count: result.rows.length,
      projects: result.rows
    });

  } catch (error) {
    console.log('GET PROJECTS ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while fetching projects.',
      details: error.message
    });
  }
};

// ============================================
// GET SINGLE PROJECT
// ============================================
exports.getProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== GET PROJECT BY ID:', id, '===');

    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Project not found.' 
      });
    }

    // Get assigned employees for this project
    const employees = await pool.query(
      `SELECT e.* FROM employees e 
       INNER JOIN employee_projects ep ON e.id = ep.employee_id 
       WHERE ep.project_id = $1`,
      [id]
    );

    res.json({
      message: 'Project fetched successfully!',
      project: result.rows[0],
      employees: employees.rows
    });

  } catch (error) {
    console.log('GET PROJECT ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while fetching project.',
      details: error.message
    });
  }
};

// ============================================
// CREATE PROJECT
// ============================================
exports.createProject = async (req, res) => {
  try {
    console.log('=== CREATE PROJECT ===');
    console.log('Body:', req.body);

    const project_name = req.body.project_name;
    const description = req.body.description;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const status = req.body.status || 'Active';

    if (!project_name) {
      return res.status(400).json({ 
        error: 'Project name is required.' 
      });
    }

    if (!['Active', 'Completed', 'On Hold'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be Active, Completed, or On Hold.' 
      });
    }

    const result = await pool.query(
      `INSERT INTO projects 
       (project_name, description, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [project_name, description, start_date, end_date, status]
    );

    console.log('=== PROJECT CREATED ===', result.rows[0]);

    res.status(201).json({
      message: 'Project created successfully!',
      project: result.rows[0]
    });

  } catch (error) {
    console.log('CREATE PROJECT ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while creating project.',
      details: error.message
    });
  }
};

// ============================================
// UPDATE PROJECT
// ============================================
exports.updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== UPDATE PROJECT:', id, '===');

    const existing = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Project not found.' 
      });
    }

    const project_name = req.body.project_name || existing.rows[0].project_name;
    const description = req.body.description || existing.rows[0].description;
    const start_date = req.body.start_date || existing.rows[0].start_date;
    const end_date = req.body.end_date || existing.rows[0].end_date;
    const status = req.body.status || existing.rows[0].status;

    if (!['Active', 'Completed', 'On Hold'].includes(status)) {
      return res.status(400).json({ 
        error: 'Status must be Active, Completed, or On Hold.' 
      });
    }

    const result = await pool.query(
      `UPDATE projects SET 
       project_name = $1,
       description = $2,
       start_date = $3,
       end_date = $4,
       status = $5
       WHERE id = $6
       RETURNING *`,
      [project_name, description, start_date, end_date, status, id]
    );

    console.log('=== PROJECT UPDATED ===', result.rows[0]);

    res.json({
      message: 'Project updated successfully!',
      project: result.rows[0]
    });

  } catch (error) {
    console.log('UPDATE PROJECT ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while updating project.',
      details: error.message
    });
  }
};

// ============================================
// DELETE PROJECT
// ============================================
exports.deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('=== DELETE PROJECT:', id, '===');

    const existing = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Project not found.' 
      });
    }

    await pool.query(
      'DELETE FROM projects WHERE id = $1',
      [id]
    );

    console.log('=== PROJECT DELETED ===');

    res.json({
      message: 'Project deleted successfully!'
    });

  } catch (error) {
    console.log('DELETE PROJECT ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while deleting project.',
      details: error.message
    });
  }
};

// ============================================
// ASSIGN EMPLOYEE TO PROJECT
// ============================================
exports.assignEmployee = async (req, res) => {
  try {
    const project_id = req.params.id;
    const employee_id = req.body.employee_id;

    console.log('=== ASSIGN EMPLOYEE ===');
    console.log('Project ID:', project_id);
    console.log('Employee ID:', employee_id);

    if (!employee_id) {
      return res.status(400).json({ 
        error: 'Employee ID is required.' 
      });
    }

    // Check if project exists
    const project = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [project_id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Project not found.' 
      });
    }

    // Check if employee exists
    const employee = await pool.query(
      'SELECT * FROM employees WHERE id = $1',
      [employee_id]
    );

    if (employee.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Employee not found.' 
      });
    }

    // Check if already assigned
    const existing = await pool.query(
      'SELECT * FROM employee_projects WHERE employee_id = $1 AND project_id = $2',
      [employee_id, project_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Employee is already assigned to this project.' 
      });
    }

    // Assign employee to project
    await pool.query(
      'INSERT INTO employee_projects (employee_id, project_id) VALUES ($1, $2)',
      [employee_id, project_id]
    );

    console.log('=== EMPLOYEE ASSIGNED ===');

    res.json({
      message: 'Employee assigned to project successfully!'
    });

  } catch (error) {
    console.log('ASSIGN ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while assigning employee.',
      details: error.message
    });
  }
};

// ============================================
// REMOVE EMPLOYEE FROM PROJECT
// ============================================
exports.removeEmployee = async (req, res) => {
  try {
    const project_id = req.params.id;
    const employee_id = req.params.employeeId;

    console.log('=== REMOVE EMPLOYEE FROM PROJECT ===');

    const existing = await pool.query(
      'SELECT * FROM employee_projects WHERE employee_id = $1 AND project_id = $2',
      [employee_id, project_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Assignment not found.' 
      });
    }

    await pool.query(
      'DELETE FROM employee_projects WHERE employee_id = $1 AND project_id = $2',
      [employee_id, project_id]
    );

    console.log('=== EMPLOYEE REMOVED FROM PROJECT ===');

    res.json({
      message: 'Employee removed from project successfully!'
    });

  } catch (error) {
    console.log('REMOVE ERROR:', error.message);
    res.status(500).json({ 
      error: 'Server error while removing employee.',
      details: error.message
    });
  }
};
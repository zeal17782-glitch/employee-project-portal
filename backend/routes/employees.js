const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const employeeController = require('../controllers/employeeController');
const { authenticateToken } = require('../middleware/auth');

// ============================================
// MULTER SETUP (For Profile Image Upload)
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// ============================================
// EMPLOYEE ROUTES (All Protected with JWT)
// ============================================

// GET all employees
router.get('/', authenticateToken, employeeController.getAllEmployees);

// GET single employee
router.get('/:id', authenticateToken, employeeController.getEmployeeById);

// POST create employee
router.post('/', authenticateToken, upload.single('profile_image'), employeeController.createEmployee);

// PUT update employee
router.put('/:id', authenticateToken, upload.single('profile_image'), employeeController.updateEmployee);

// DELETE employee
router.delete('/:id', authenticateToken, employeeController.deleteEmployee);

module.exports = router;
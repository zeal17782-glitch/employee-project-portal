const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');

// GET all projects
router.get('/', authenticateToken, projectController.getAllProjects);

// GET single project
router.get('/:id', authenticateToken, projectController.getProjectById);

// POST create project
router.post('/', authenticateToken, projectController.createProject);

// PUT update project
router.put('/:id', authenticateToken, projectController.updateProject);

// DELETE project
router.delete('/:id', authenticateToken, projectController.deleteProject);

// POST assign employee to project
router.post('/:id/assign', authenticateToken, projectController.assignEmployee);

// DELETE remove employee from project
router.delete('/:id/remove/:employeeId', authenticateToken, projectController.removeEmployee);

module.exports = router;
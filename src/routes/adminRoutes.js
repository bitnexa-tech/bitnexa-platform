const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// Analytics & Overview
router.get('/overview', adminController.getAdminOverview);

// Task management
router.get('/tasks', adminController.getAllTasks);
router.patch('/tasks/:taskId/assign', adminController.assignWorker);
router.patch('/tasks/:taskId', adminController.updateTaskAdmin);

// User & Worker management
router.get('/workers', adminController.getWorkersList);
router.get('/users', adminController.getAllUsers);

module.exports = router;

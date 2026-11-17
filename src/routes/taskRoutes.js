const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All task routes require authentication
router.use(authenticateToken);

// Client-specific endpoints
router.post('/', requireRole('client', 'admin'), taskController.createTask);
router.get('/my-client-tasks', requireRole('client', 'admin'), taskController.getClientTasks);

// Worker-specific endpoints
router.get('/my-worker-tasks', requireRole('worker', 'admin'), taskController.getWorkerTasks);
router.patch('/:taskId/progress', requireRole('worker', 'admin'), taskController.updateWorkerTask);

// Shared: get full task details & activity history
router.get('/:taskId', taskController.getTaskDetails);

module.exports = router;

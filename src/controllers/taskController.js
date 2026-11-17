const db = require('../config/db');

// Allowed service categories as requested by user
const VALID_CATEGORIES = [
  'Website Frontend',
  'Website Backend',
  'Render Deployment',
  'Domain & DNS Setup',
  'Reels & Video Editing',
  'Instagram Promotion',
  'Full-Stack Custom',
];

/**
 * Client: Create a new project / task requirement
 */
async function createTask(req, res) {
  try {
    const clientId = req.user.id;
    const {
      title,
      service_category,
      description,
      budget_inr,
      deadline,
      contact_number,
      attachment_url,
    } = req.body;

    // Validation
    if (!title || !description || !service_category) {
      return res.status(400).json({
        success: false,
        message: 'Title, Service Category, and Description are required fields.',
      });
    }

    const budget = parseInt(budget_inr, 10) || 0;
    if (budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget (₹ INR) must be a positive amount.',
      });
    }

    const finalCategory = VALID_CATEGORIES.includes(service_category)
      ? service_category
      : 'Full-Stack Custom';

    const insertTask = db.prepare(`
      INSERT INTO tasks (
        client_id,
        title,
        service_category,
        description,
        budget_inr,
        deadline,
        contact_number,
        attachment_url,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Approval', datetime('now'), datetime('now'))
    `);

    const result = insertTask.run(
      clientId,
      title.trim(),
      finalCategory,
      description.trim(),
      budget,
      (deadline || 'Flexible').trim(),
      (contact_number || req.user.phone || 'Not provided').trim(),
      (attachment_url || '').trim()
    );

    const taskId = result.lastInsertRowid;

    // Log Activity
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (task_id, user_id, action, details)
      VALUES (?, ?, 'TASK_CREATED', ?)
    `);
    insertLog.run(taskId, clientId, `Client submitted new project "${title}" with budget ₹${budget}`);

    const newTask = db.prepare(`
      SELECT t.*, u.name as client_name, u.email as client_email
      FROM tasks t
      JOIN users u ON t.client_id = u.id
      WHERE t.id = ?
    `).get(taskId);

    return res.status(201).json({
      success: true,
      message: 'Project posted successfully! Our admin team is reviewing your requirement.',
      task: newTask,
    });
  } catch (error) {
    console.error('[TaskController.createTask] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task.',
      error: error.message,
    });
  }
}

/**
 * Client: Get all tasks created by the logged-in client
 */
async function getClientTasks(req, res) {
  try {
    const clientId = req.user.id;

    const query = db.prepare(`
      SELECT 
        t.*,
        w.name as worker_name,
        w.email as worker_email,
        w.phone as worker_phone
      FROM tasks t
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.client_id = ?
      ORDER BY t.created_at DESC
    `);

    const tasks = query.all(clientId);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('[TaskController.getClientTasks] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch client tasks.',
      error: error.message,
    });
  }
}

/**
 * Worker: Get tasks assigned to this worker (plus any available pool if unassigned)
 */
async function getWorkerTasks(req, res) {
  try {
    const workerId = req.user.id;

    const query = db.prepare(`
      SELECT 
        t.*,
        c.name as client_name,
        c.email as client_email,
        c.phone as client_phone
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      WHERE t.worker_id = ?
      ORDER BY 
        CASE 
          WHEN t.status = 'In Progress' THEN 1
          WHEN t.status = 'Assigned' THEN 2
          WHEN t.status = 'Under Review' THEN 3
          WHEN t.status = 'Completed' THEN 4
          ELSE 5
        END,
        t.created_at DESC
    `);

    const tasks = query.all(workerId);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('[TaskController.getWorkerTasks] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch worker tasks.',
      error: error.message,
    });
  }
}

/**
 * Worker: Update task progress, submission link, and notes
 */
async function updateWorkerTask(req, res) {
  try {
    const workerId = req.user.id;
    const { taskId } = req.params;
    const { status, worker_notes, submission_link } = req.body;

    // Verify task is assigned to this worker
    const findTask = db.prepare('SELECT * FROM tasks WHERE id = ?');
    const task = findTask.get(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    if (task.worker_id !== workerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not assigned to this project.',
      });
    }

    const allowedWorkerStatuses = ['In Progress', 'Under Review', 'Completed'];
    const newStatus = (status && allowedWorkerStatuses.includes(status)) ? status : task.status;

    const updateStmt = db.prepare(`
      UPDATE tasks
      SET 
        status = ?,
        worker_notes = COALESCE(?, worker_notes),
        submission_link = COALESCE(?, submission_link),
        updated_at = datetime('now')
      WHERE id = ?
    `);

    updateStmt.run(
      newStatus,
      worker_notes !== undefined ? worker_notes.trim() : null,
      submission_link !== undefined ? submission_link.trim() : null,
      taskId
    );

    // Log Activity
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (task_id, user_id, action, details)
      VALUES (?, ?, 'STATUS_UPDATE', ?)
    `);
    insertLog.run(
      taskId,
      workerId,
      `Worker updated status to "${newStatus}"${worker_notes ? ` | Notes: ${worker_notes}` : ''}`
    );

    const updatedTask = db.prepare(`
      SELECT t.*, c.name as client_name, c.email as client_email
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      WHERE t.id = ?
    `).get(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task progress updated successfully.',
      task: updatedTask,
    });
  } catch (error) {
    console.error('[TaskController.updateWorkerTask] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task progress.',
      error: error.message,
    });
  }
}

/**
 * Get single task details with logs (accessible by Client owner, Assigned Worker, or Admin)
 */
async function getTaskDetails(req, res) {
  try {
    const { taskId } = req.params;
    const user = req.user;

    const getTask = db.prepare(`
      SELECT 
        t.*,
        c.name as client_name,
        c.email as client_email,
        c.phone as client_phone,
        w.name as worker_name,
        w.email as worker_email,
        w.phone as worker_phone
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.id = ?
    `);

    const task = getTask.get(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Permission check
    if (user.role !== 'admin' && task.client_id !== user.id && task.worker_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this task.',
      });
    }

    // Fetch activity logs
    const getLogs = db.prepare(`
      SELECT l.*, u.name as user_name, u.role as user_role
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.task_id = ?
      ORDER BY l.created_at DESC
    `);
    const logs = getLogs.all(taskId);

    return res.status(200).json({
      success: true,
      task,
      logs,
    });
  } catch (error) {
    console.error('[TaskController.getTaskDetails] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task details.',
      error: error.message,
    });
  }
}

module.exports = {
  VALID_CATEGORIES,
  createTask,
  getClientTasks,
  getWorkerTasks,
  updateWorkerTask,
  getTaskDetails,
};

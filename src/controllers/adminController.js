const db = require('../config/db');

/**
 * Admin: Platform Analytics & KPI Overview
 */
async function getAdminOverview(req, res) {
  try {
    // Total Pipeline Revenue (sum of budget_inr)
    const revenueRow = db.prepare("SELECT COALESCE(SUM(budget_inr), 0) as totalRevenue FROM tasks WHERE status != 'Cancelled'").get();
    const completedRevenueRow = db.prepare("SELECT COALESCE(SUM(budget_inr), 0) as completedRevenue FROM tasks WHERE status = 'Completed'").get();

    // Counts by Status
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM tasks 
      GROUP BY status
    `).all();

    // Format status counts object
    const statusSummary = {
      'Pending Approval': 0,
      'Assigned': 0,
      'In Progress': 0,
      'Under Review': 0,
      'Completed': 0,
      'Cancelled': 0,
    };
    statusCounts.forEach(sc => {
      statusSummary[sc.status] = sc.count;
    });

    // Counts by Service Category
    const categoryCounts = db.prepare(`
      SELECT service_category, COUNT(*) as count, SUM(budget_inr) as total_budget
      FROM tasks 
      GROUP BY service_category
    `).all();

    // User counts
    const clientCountRow = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'client'").get();
    const workerCountRow = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'worker'").get();
    const totalTasksRow = db.prepare("SELECT COUNT(*) as count FROM tasks").get();

    // Recent 5 activities
    const recentActivities = db.prepare(`
      SELECT l.*, u.name as user_name, u.role as user_role, t.title as task_title
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN tasks t ON l.task_id = t.id
      ORDER BY l.created_at DESC
      LIMIT 6
    `).all();

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue: revenueRow.totalRevenue,
        completedRevenue: completedRevenueRow.completedRevenue,
        totalTasks: totalTasksRow.count,
        totalClients: clientCountRow.count,
        totalWorkers: workerCountRow.count,
        statusSummary,
        categoryCounts,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('[AdminController.getAdminOverview] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin overview statistics.',
      error: error.message,
    });
  }
}

/**
 * Admin: Get all tasks with complete details, client info, worker info & filtering
 */
async function getAllTasks(req, res) {
  try {
    const { status, category, search } = req.query;

    let queryStr = `
      SELECT 
        t.*,
        c.name as client_name,
        c.email as client_email,
        c.phone as client_phone,
        w.name as worker_name,
        w.email as worker_email,
        w.phone as worker_phone,
        w.skills as worker_skills
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'All') {
      queryStr += ` AND t.status = ?`;
      params.push(status);
    }

    if (category && category !== 'All') {
      queryStr += ` AND t.service_category = ?`;
      params.push(category);
    }

    if (search && search.trim() !== '') {
      queryStr += ` AND (t.title LIKE ? OR t.description LIKE ? OR c.name LIKE ? OR c.email LIKE ?)`;
      const searchWild = `%${search.trim()}%`;
      params.push(searchWild, searchWild, searchWild, searchWild);
    }

    queryStr += ` ORDER BY t.created_at DESC`;

    const getStmt = db.prepare(queryStr);
    const tasks = getStmt.all(...params);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('[AdminController.getAllTasks] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks.',
      error: error.message,
    });
  }
}

/**
 * Admin: Assign a worker to a task
 */
async function assignWorker(req, res) {
  try {
    const adminId = req.user.id;
    const { taskId } = req.params;
    const { worker_id } = req.body;

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    let workerName = 'Unassigned';
    if (worker_id) {
      const worker = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'worker'").get(worker_id);
      if (!worker) {
        return res.status(400).json({ success: false, message: 'Invalid worker ID.' });
      }
      workerName = worker.name;
    }

    const nextStatus = worker_id ? (task.status === 'Pending Approval' ? 'Assigned' : task.status) : 'Pending Approval';

    const updateStmt = db.prepare(`
      UPDATE tasks 
      SET 
        worker_id = ?,
        status = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);
    updateStmt.run(worker_id ? parseInt(worker_id, 10) : null, nextStatus, taskId);

    // Log Activity
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (task_id, user_id, action, details)
      VALUES (?, ?, 'WORKER_ASSIGNED', ?)
    `);
    insertLog.run(
      taskId,
      adminId,
      worker_id
        ? `Assigned project to worker ${workerName} (Status: ${nextStatus})`
        : `Removed assigned worker from project.`
    );

    const refreshedTask = db.prepare(`
      SELECT 
        t.*,
        c.name as client_name,
        c.email as client_email,
        w.name as worker_name,
        w.email as worker_email
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.id = ?
    `).get(taskId);

    return res.status(200).json({
      success: true,
      message: `Task assigned to ${workerName} successfully.`,
      task: refreshedTask,
    });
  } catch (error) {
    console.error('[AdminController.assignWorker] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign worker.',
      error: error.message,
    });
  }
}

/**
 * Admin: Update any task property (status, budget, worker notes, etc.)
 */
async function updateTaskAdmin(req, res) {
  try {
    const adminId = req.user.id;
    const { taskId } = req.params;
    const { status, budget_inr, title, description, worker_notes, submission_link } = req.body;

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const newStatus = status || task.status;
    const newBudget = budget_inr !== undefined ? parseInt(budget_inr, 10) : task.budget_inr;
    const newTitle = title !== undefined ? title.trim() : task.title;
    const newDesc = description !== undefined ? description.trim() : task.description;

    const updateStmt = db.prepare(`
      UPDATE tasks
      SET 
        status = ?,
        budget_inr = ?,
        title = ?,
        description = ?,
        worker_notes = COALESCE(?, worker_notes),
        submission_link = COALESCE(?, submission_link),
        updated_at = datetime('now')
      WHERE id = ?
    `);

    updateStmt.run(
      newStatus,
      newBudget,
      newTitle,
      newDesc,
      worker_notes !== undefined ? worker_notes.trim() : null,
      submission_link !== undefined ? submission_link.trim() : null,
      taskId
    );

    // Log activity
    const insertLog = db.prepare(`
      INSERT INTO activity_logs (task_id, user_id, action, details)
      VALUES (?, ?, 'ADMIN_UPDATE', ?)
    `);
    insertLog.run(taskId, adminId, `Admin updated task details. Status: ${newStatus}, Budget: ₹${newBudget}`);

    const refreshedTask = db.prepare(`
      SELECT 
        t.*,
        c.name as client_name,
        c.email as client_email,
        w.name as worker_name,
        w.email as worker_email
      FROM tasks t
      JOIN users c ON t.client_id = c.id
      LEFT JOIN users w ON t.worker_id = w.id
      WHERE t.id = ?
    `).get(taskId);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully by admin.',
      task: refreshedTask,
    });
  } catch (error) {
    console.error('[AdminController.updateTaskAdmin] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task.',
      error: error.message,
    });
  }
}

/**
 * Admin: Get list of active workers for dropdown
 */
async function getWorkersList(req, res) {
  try {
    const workers = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.phone, u.skills,
        (SELECT COUNT(*) FROM tasks WHERE worker_id = u.id AND status IN ('Assigned', 'In Progress')) as active_tasks_count,
        (SELECT COUNT(*) FROM tasks WHERE worker_id = u.id AND status = 'Completed') as completed_tasks_count
      FROM users u
      WHERE u.role = 'worker'
      ORDER BY u.name ASC
    `).all();

    return res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve workers list.',
      error: error.message,
    });
  }
}

/**
 * Admin: Get all registered clients and workers with stats
 */
async function getAllUsers(req, res) {
  try {
    const { role } = req.query;

    let queryStr = `
      SELECT 
        u.id, u.name, u.email, u.role, u.skills, u.phone, u.created_at,
        (CASE 
          WHEN u.role = 'client' THEN (SELECT COUNT(*) FROM tasks WHERE client_id = u.id)
          WHEN u.role = 'worker' THEN (SELECT COUNT(*) FROM tasks WHERE worker_id = u.id)
          ELSE 0 
        END) as task_count,
        (CASE 
          WHEN u.role = 'client' THEN (SELECT COALESCE(SUM(budget_inr), 0) FROM tasks WHERE client_id = u.id AND status != 'Cancelled')
          WHEN u.role = 'worker' THEN (SELECT COALESCE(SUM(budget_inr), 0) FROM tasks WHERE worker_id = u.id AND status = 'Completed')
          ELSE 0 
        END) as total_volume_inr
      FROM users u
      WHERE 1=1
    `;

    const params = [];
    if (role && ['client', 'worker', 'admin'].includes(role)) {
      queryStr += ` AND u.role = ?`;
      params.push(role);
    }

    queryStr += ` ORDER BY u.created_at DESC`;

    const users = db.prepare(queryStr).all(...params);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users list.',
      error: error.message,
    });
  }
}

module.exports = {
  getAdminOverview,
  getAllTasks,
  assignWorker,
  updateTaskAdmin,
  getWorkersList,
  getAllUsers,
};

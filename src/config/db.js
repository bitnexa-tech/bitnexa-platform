const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

// Ensure data directory exists
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'agency.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for concurrency and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      role TEXT NOT NULL CHECK(role IN ('client', 'worker', 'admin')),
      skills TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // OTPs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL COLLATE NOCASE,
      otp TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      worker_id INTEGER NULL,
      title TEXT NOT NULL,
      service_category TEXT NOT NULL,
      description TEXT NOT NULL,
      budget_inr INTEGER NOT NULL DEFAULT 0,
      deadline TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      attachment_url TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending Approval' CHECK(status IN ('Pending Approval', 'Assigned', 'In Progress', 'Under Review', 'Completed', 'Cancelled')),
      worker_notes TEXT DEFAULT '',
      submission_link TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Activity logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NULL,
      user_id INTEGER NULL,
      action TEXT NOT NULL,
      details TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Create indexes for optimal performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_tasks_client ON tasks(client_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_worker ON tasks(worker_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
  `);

  // Auto-seed Default Admin from env if not already present
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@agency.com').trim().toLowerCase();
  const adminName = process.env.ADMIN_NAME || 'Admin Boss';

  const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?');
  const existingAdmin = checkAdmin.get(adminEmail);

  if (!existingAdmin) {
    const insertAdmin = db.prepare(`
      INSERT INTO users (name, email, role, skills, phone)
      VALUES (?, ?, 'admin', 'Full Platform Management', '+91 9876543210')
    `);
    insertAdmin.run(adminName, adminEmail);
    console.log(`[DB] Created default Admin account: ${adminEmail}`);
  }
}

initializeDatabase();

module.exports = db;

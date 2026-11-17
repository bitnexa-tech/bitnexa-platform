require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');

// Ensure DB is initialized
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static frontend assets for 3D Bitnexa Agency Website (with GLB MIME support)
app.use(express.static(path.join(__dirname, '../bitnexa-website'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.glb')) res.setHeader('Content-Type', 'model/gltf-binary');
    if (filePath.endsWith('.gltf')) res.setHeader('Content-Type', 'model/gltf+json');
    if (filePath.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
  }
}));

// Static frontend assets for Workflow Portals
app.use(express.static(path.join(__dirname, '../public')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Direct Website Lead / Proposal Submission API
app.post('/api/inquiry', (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.join(__dirname, '../data/agency.db');
    const db = new DatabaseSync(dbPath);

    // Find or create client user
    let user = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get(email);
    let clientId;
    if (!user) {
      const info = db.prepare('INSERT INTO users (name, email, role, phone) VALUES (?, ?, ?, ?)').run(name, email, 'client', phone || '');
      clientId = Number(info.lastInsertRowid);
    } else {
      clientId = user.id;
    }

    // Insert task / inquiry
    const taskTitle = `[Website Lead] ${service || 'General Project Proposal'}`;
    const taskDesc = message ? `${message}\n\nClient Phone: ${phone || 'N/A'}` : `Website Inquiry from ${name}. Phone: ${phone || 'N/A'}`;
    const deadline = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const taskInfo = db.prepare(`
      INSERT INTO tasks (client_id, title, service_category, description, budget_inr, deadline, contact_number, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Approval')
    `).run(clientId, taskTitle, service || 'Website Development', 0, deadline, phone || '');

    const taskId = Number(taskInfo.lastInsertRowid);

    // Record activity
    db.prepare(`
      INSERT INTO task_activity (task_id, user_id, action, notes)
      VALUES (?, ?, 'Lead Captured', ?)
    `).run(taskId, clientId, `Captured from Bitnexa 3D Website proposal form`);

    res.status(201).json({
      success: true,
      message: 'Inquiry saved to database successfully',
      taskId: taskId
    });
  } catch (err) {
    console.error('[Inquiry Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to record inquiry.' });
  }
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'Agency Workflow API & Bitnexa 3D Platform',
    database: 'SQLite (node:sqlite active)',
  });
});

// Dedicated Portal & Website Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../bitnexa-website/index.html'));
});

app.get('/warp-field', (req, res) => {
  res.sendFile(path.join(__dirname, '../bitnexa-website/warp-field.html'));
});

app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/client.html'));
});

app.get('/worker', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/worker.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Single Page Application Fallback for all other non-API GET requests
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../bitnexa-website/index.html'));
  }
  next();
});

// 404 Handler for undefined API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.originalUrl}' not found.`,
    });
  }
  res.status(404).send('Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

let server = null;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Agency Hub Server is RUNNING at: http://localhost:${PORT}`);
    console.log(`🛡️  Admin Account: ${process.env.ADMIN_EMAIL || 'admin@agency.com'}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Ready for Localhost & Render Deployment`);
    console.log(`======================================================\n`);
  });
}

module.exports = { app, server };

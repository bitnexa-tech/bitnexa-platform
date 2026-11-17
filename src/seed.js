require('dotenv').config();
const db = require('./config/db');

console.log('🌱 Starting database seeding with realistic demo records...');

// 1. Seed Users
const users = [
  {
    name: 'Rohit Sharma (Startup Founder)',
    email: 'client.rohit@example.com',
    role: 'client',
    phone: '+91 9820112233',
    skills: '',
  },
  {
    name: 'Priya Patel (E-commerce Brand Owner)',
    email: 'client.priya@example.com',
    role: 'client',
    phone: '+91 9876543211',
    skills: '',
  },
  {
    name: 'Vikram Singh',
    email: 'worker.vikram@agency.com',
    role: 'worker',
    phone: '+91 9911223344',
    skills: 'React, Node.js, Express, Render, Cloudflare, Docker',
  },
  {
    name: 'Ananya Verma',
    email: 'worker.ananya@agency.com',
    role: 'worker',
    phone: '+91 9811334455',
    skills: 'Premiere Pro, After Effects, CapCut, Instagram Growth, Meta Ads',
  },
];

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, email, role, phone, skills)
  VALUES (?, ?, ?, ?, ?)
`);

users.forEach(u => {
  insertUser.run(u.name, u.email, u.role, u.phone, u.skills);
});

// Fetch user IDs
const rohit = db.prepare('SELECT id FROM users WHERE email = ?').get('client.rohit@example.com');
const priya = db.prepare('SELECT id FROM users WHERE email = ?').get('client.priya@example.com');
const vikram = db.prepare('SELECT id FROM users WHERE email = ?').get('worker.vikram@agency.com');
const ananya = db.prepare('SELECT id FROM users WHERE email = ?').get('worker.ananya@agency.com');

// 2. Check existing tasks to avoid duplication
const taskCount = db.prepare('SELECT COUNT(*) as c FROM tasks').get().c;

if (taskCount === 0 && rohit && priya && vikram && ananya) {
  const sampleTasks = [
    {
      client_id: rohit.id,
      worker_id: vikram.id,
      title: 'Modern React & Tailwind Frontend for SaaS Dashboard',
      service_category: 'Website Frontend',
      description: 'Need a crisp, high-converting dashboard with responsive charts, dark mode, and client management table.',
      budget_inr: 22000,
      deadline: '7 Days',
      contact_number: '+91 9820112233',
      attachment_url: 'https://figma.com/file/sample-saas-dashboard-spec',
      status: 'In Progress',
      worker_notes: 'Initial component library setup complete. Working on chart widgets and table pagination.',
      submission_link: 'https://github.com/agency-demo/saas-dashboard-frontend',
    },
    {
      client_id: rohit.id,
      worker_id: vikram.id,
      title: 'Deploy Full-Stack Express & PostgreSQL App on Render',
      service_category: 'Render Deployment',
      description: 'Configure build scripts, environment secrets, health checks, and auto-deploy pipeline on Render web service.',
      budget_inr: 6500,
      deadline: '2 Days',
      contact_number: '+91 9820112233',
      attachment_url: '',
      status: 'Completed',
      worker_notes: 'Successfully deployed on Render with green health check status and automatic git push deployment.',
      submission_link: 'https://my-saas-api.onrender.com/api/health',
    },
    {
      client_id: priya.id,
      worker_id: null,
      title: 'Connect Custom Domain (shopbrand.in) with SSL & Cloudflare DNS',
      service_category: 'Domain & DNS Setup',
      description: 'Point GoDaddy domain to Render server, set up Cloudflare SSL certificates, and configure www redirect.',
      budget_inr: 4500,
      deadline: '1 Day',
      contact_number: '+91 9876543211',
      attachment_url: '',
      status: 'Pending Approval',
      worker_notes: '',
      submission_link: '',
    },
    {
      client_id: priya.id,
      worker_id: ananya.id,
      title: '12 Viral Instagram Reels for Summer Collection Launch',
      service_category: 'Reels & Video Editing',
      description: 'Produce high-energy 1080x1920 reels with trendy sound synching, animated captions, color grading and CTA.',
      budget_inr: 15000,
      deadline: '5 Days',
      contact_number: '+91 9876543211',
      attachment_url: 'https://drive.google.com/drive/folders/sample-reels-raw-footage',
      status: 'Under Review',
      worker_notes: 'All 12 reels exported in 4K/1080p with burned-in animated subtitles and sound design. Ready for review.',
      submission_link: 'https://drive.google.com/drive/folders/sample-reels-final-deliverables',
    },
    {
      client_id: priya.id,
      worker_id: ananya.id,
      title: 'Targeted Instagram Promotion & Influencer Outreach Campaign',
      service_category: 'Instagram Promotion',
      description: 'Setup targeted Instagram ads and reach 50 niche micro-creators in fashion for brand collab.',
      budget_inr: 25000,
      deadline: '14 Days',
      contact_number: '+91 9876543211',
      attachment_url: '',
      status: 'Assigned',
      worker_notes: 'Audience targeting persona mapped. Preparing creative campaign copy.',
      submission_link: '',
    },
    {
      client_id: rohit.id,
      worker_id: null,
      title: 'Node.js & MongoDB Backend with JWT & Razorpay Integration',
      service_category: 'Website Backend',
      description: 'Robust authentication, role authorization, webhook processing for payment gateway, and email triggers.',
      budget_inr: 30000,
      deadline: '10 Days',
      contact_number: '+91 9820112233',
      attachment_url: '',
      status: 'Pending Approval',
      worker_notes: '',
      submission_link: '',
    },
  ];

  const insertTask = db.prepare(`
    INSERT INTO tasks (
      client_id, worker_id, title, service_category, description,
      budget_inr, deadline, contact_number, attachment_url, status,
      worker_notes, submission_link
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLog = db.prepare(`
    INSERT INTO activity_logs (task_id, user_id, action, details)
    VALUES (?, ?, ?, ?)
  `);

  sampleTasks.forEach(task => {
    const res = insertTask.run(
      task.client_id,
      task.worker_id,
      task.title,
      task.service_category,
      task.description,
      task.budget_inr,
      task.deadline,
      task.contact_number,
      task.attachment_url,
      task.status,
      task.worker_notes,
      task.submission_link
    );

    insertLog.run(
      res.lastInsertRowid,
      task.client_id,
      'SEED_INIT',
      `Demo project initialized with status: ${task.status}`
    );
  });

  console.log(`✅ Seeded ${sampleTasks.length} realistic tasks across all categories!`);
} else {
  console.log('ℹ️ Database already contains records or users. Skipping task seed.');
}

console.log('🎉 Seeding completed successfully!');

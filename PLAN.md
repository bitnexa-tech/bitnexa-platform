# Project Spec & Roadmap: Client-Worker-Admin Agency Workflow Platform

## 1. Executive Overview
A full-stack, production-ready freelance & technical service platform connecting:
- **Clients**: Request services (Web Frontend, Backend, Render Deployment, Domain Setup, Reels/Video, Instagram Promotion, etc.) with budget (₹ INR) and deadlines.
- **Workers**: View assigned jobs, access specifications, deliver work, and update task stages.
- **Admin (Owner)**: Complete visibility of all clients, task requirements, budgets (₹), worker assignment, status management, and platform metrics.
- **Auth**: Email OTP-based verification & JWT-secured role-based access control.

---

## 2. Architecture & Tech Stack

### Backend
- **Runtime**: Node.js (v26+ compatible)
- **Framework**: Express.js
- **Database**: SQLite3 / persistent storage with zero external dependencies for localhost, seamless migration support for Render (PostgreSQL / persistent disk).
- **Authentication**: Email OTP verification + JWT (JSON Web Tokens) with Role-Based Access Control (`client`, `worker`, `admin`).
- **Mailing**: Nodemailer (supports SMTP / Gmail / Resend; includes Dev Fallback logger so localhost testing is never blocked if SMTP credentials are yet to be configured).

### Frontend
- **Design System**: Modern, responsive, premium UI (Tailwind CSS styling + modern UI components).
- **Navigation**: Dedicated panels for Client, Worker, and Admin with role switching and authentication modals.
- **Features**: Real-time status badges, budget displays in ₹ INR, interactive task creation modal with categorized service selection, task assignment, progress tracker, and notifications.

---

## 3. Database Schema

### Table: `users`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `role` (TEXT: 'client', 'worker', 'admin')
- `skills` (TEXT, optional for workers)
- `phone` (TEXT, optional)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

### Table: `otps`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `email` (TEXT)
- `otp` (TEXT)
- `expires_at` (DATETIME)
- `used` (INTEGER DEFAULT 0)

### Table: `tasks`
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `client_id` (INTEGER, FK -> users.id)
- `worker_id` (INTEGER NULLABLE, FK -> users.id)
- `title` (TEXT)
- `service_category` (TEXT) -- 'Frontend Web', 'Backend Web', 'Render Deployment', 'Domain Setup', 'Reel & Video Editing', 'Instagram Promotion', 'Other'
- `description` (TEXT)
- `budget_inr` (INTEGER) -- In ₹ Rupees
- `deadline` (TEXT)
- `contact_number` (TEXT)
- `attachment_url` (TEXT NULLABLE)
- `status` (TEXT) -- 'Pending Approval', 'Assigned', 'In Progress', 'Under Review', 'Completed', 'Cancelled'
- `worker_notes` (TEXT NULLABLE)
- `submission_link` (TEXT NULLABLE)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## 4. Service Categories & Presets
1. **Website Frontend Development**: React, Vue, Next.js, HTML/Tailwind/CSS, responsive UI.
2. **Website Backend Development**: Node.js/Express, Python/FastAPI, REST APIs, Database integration.
3. **Render Deployment & Hosting**: Cloud setup on Render, environment config, web service build.
4. **Custom Domain Setup**: DNS records (A, CNAME), SSL/HTTPS, Cloudflare/GoDaddy/Namecheap linking.
5. **Instagram & YouTube Reels Editing**: Short-form video editing, captions, hooks, viral sound design.
6. **Instagram Promotion & Marketing**: Page growth, targeted outreach, promotional campaigns.
7. **Custom Full-Stack / Other**: Custom requirements.

---

## 5. Development Phases (Atomic Execution Plan)

### Phase 1: Environment & Project Scaffolding
- Initialize `package.json`, install required dependencies (`express`, `better-sqlite3` or `sqlite3`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `nodemailer`, `uuid`).
- Setup project folder structure:
  - `/src/server.js` (Express entrypoint)
  - `/src/config/db.js` (Database initialization & schemas)
  - `/src/middleware/auth.js` (JWT & Role authorization)
  - `/src/controllers/authController.js` (OTP generation & verify)
  - `/src/controllers/taskController.js` (CRUD, assignment, status update)
  - `/src/controllers/adminController.js` (Stats, user management, global oversight)
  - `/src/utils/mailer.js` (Nodemailer with auto-dev logging)
  - `/public/` (Static client with modern, responsive multi-panel UI)

### Phase 2: Database & Backend API Implementation
- Create SQLite tables with foreign keys and indexes.
- Implement OTP generation with 10-minute expiry and rate limit protection.
- Build Role-Based Auth APIs (`/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/me`).
- Build Task Management APIs:
  - Client: Create task, get my tasks, cancel task.
  - Worker: Get assigned tasks, update progress/status, submit deliverable.
  - Admin: Get all tasks (with client & worker details, budget filter), assign task to worker, update status, view platform stats.

### Phase 3: Frontend Implementation (Client, Worker & Admin Panels)
- **Landing / Auth View**: Clean hero, quick feature preview, Email OTP login/signup modal with role selector.
- **Client Dashboard**:
  - "Post New Task" modal with categorized services, budget in ₹, deadline, requirements.
  - Active & Past Task cards with live status progress bar and worker notes.
- **Worker Dashboard**:
  - Assigned projects list with client details & budget.
  - Quick action buttons to update status (`In Progress`, `Under Review`, `Completed`) and submit project deliverables.
- **Admin Dashboard**:
  - KPI summary metrics (Total Revenue ₹, Active Projects, Clients, Workers).
  - Comprehensive Task Management Table with instant filters by service type & status.
  - 1-click Worker Assignment dropdown.
  - User management tab (view all registered clients & workers).

### Phase 4: Verification, Self-Testing & Seed Data
- Create seed data (pre-configured Admin, sample Clients, sample Workers, demo tasks in different stages).
- Automated API and workflow test script to verify:
  1. OTP generation and verification for Client, Worker, and Admin.
  2. Client task submission with ₹ budget and service category.
  3. Admin view and worker assignment.
  4. Worker status updates and deliverable submission.
  5. Admin status approval and completion.
- Verify localhost launch and Render deployment readiness (`render.yaml` or Procfile / build script).

---

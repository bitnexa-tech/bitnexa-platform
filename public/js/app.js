/**
 * DevFlow Studio Pro - Frontend Application Engine
 */

// Application State
const state = {
  token: localStorage.getItem('agency_token') || null,
  user: null,
  currentPanel: 'client',
  adminSubtab: 'tasks',
  workersList: [],
  adminTasks: [],
  lastSentEmail: '',
};

// API Helper
async function api(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(path, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error (${res.status})`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${method} ${path}]:`, err);
    throw err;
  }
}

// Format INR Currency
function formatINR(amount) {
  const num = parseInt(amount, 10) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

// Category Icons & Badges
function getCategoryBadge(category) {
  const configs = {
    'Website Frontend': { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30', icon: '💻' },
    'Website Backend': { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: '⚙️' },
    'Render Deployment': { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: '🚀' },
    'Domain & DNS Setup': { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: '🌐' },
    'Reels & Video Editing': { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: '🎬' },
    'Instagram Promotion': { bg: 'bg-pink-500/10 text-pink-400 border-pink-500/30', icon: '📈' },
    'Full-Stack Custom': { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: '⚡' },
  };

  const cfg = configs[category] || { bg: 'bg-slate-700/20 text-slate-300 border-slate-700', icon: '📌' };
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${cfg.bg}">
    <span>${cfg.icon}</span>
    <span>${category}</span>
  </span>`;
}

// Status Badges
function getStatusBadge(status) {
  const configs = {
    'Pending Approval': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Assigned': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    'In Progress': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Under Review': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const cls = configs[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}">
    <span class="w-2 h-2 rounded-full bg-current"></span>
    <span>${status}</span>
  </span>`;
}

// Visual 5-Stage Milestone Stepper
function renderMilestoneStepper(status) {
  const stages = [
    { key: 'Pending Approval', label: '1. Submitted' },
    { key: 'Assigned', label: '2. Assigned' },
    { key: 'In Progress', label: '3. Developing' },
    { key: 'Under Review', label: '4. QA Review' },
    { key: 'Completed', label: '5. Delivered' },
  ];

  const statusWeights = {
    'Pending Approval': 1,
    'Assigned': 2,
    'In Progress': 3,
    'Under Review': 4,
    'Completed': 5,
    'Cancelled': 0,
  };

  const currentWeight = statusWeights[status] || 1;

  return `
    <div class="pt-2 pb-1">
      <div class="grid grid-cols-5 gap-1 text-center">
        ${stages.map((st, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum <= currentWeight;
          const isCurrent = stepNum === currentWeight;

          let colorCls = 'text-slate-600 bg-surface-950 border-white/5';
          let barCls = 'bg-surface-950';

          if (isDone) {
            colorCls = isCurrent
              ? 'text-brand-300 font-bold bg-brand-500/20 border-brand-500/50 shadow-sm shadow-brand-500/20'
              : 'text-emerald-400 font-semibold bg-emerald-500/10 border-emerald-500/30';
            barCls = 'bg-brand-500';
          }

          return `
            <div class="flex flex-col items-center">
              <div class="w-full h-1.5 rounded-full ${barCls} mb-2 transition-all"></div>
              <span class="text-[10px] ${colorCls} px-2 py-0.5 rounded-lg border w-full truncate">
                ${st.label}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Toast System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');

  const borderCls = type === 'error' ? 'border-rose-500/40 bg-surface-900 text-rose-300' : 'border-emerald-500/40 bg-surface-900 text-emerald-300';
  const icon = type === 'error' ? '⚠️' : '✅';

  toast.className = `p-4 rounded-2xl border ${borderCls} shadow-2xl flex items-center gap-3 text-sm pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300`;
  toast.innerHTML = `
    <span class="text-base">${icon}</span>
    <span class="flex-1 font-medium text-slate-100">${message}</span>
    <button class="text-slate-400 hover:text-white" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Panel Switching
function switchPanel(panelName) {
  state.currentPanel = panelName;

  ['client', 'worker', 'admin'].forEach(p => {
    const btn = document.getElementById(`nav-${p}`);
    const mBtn = document.getElementById(`m-nav-${p}`);
    const panel = document.getElementById(`panel-${p}`);

    if (p === panelName) {
      if (btn) {
        btn.className = 'px-4 py-2 rounded-xl transition-all flex items-center gap-2 bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-600/30';
      }
      if (mBtn) {
        mBtn.className = 'text-brand-400 font-bold py-1.5 px-3 border-b-2 border-brand-500';
      }
      if (panel) {
        panel.classList.remove('hidden');
      }
    } else {
      if (btn) {
        btn.className = 'px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold';
      }
      if (mBtn) {
        mBtn.className = 'text-slate-400 py-1.5 px-3';
      }
      if (panel) {
        panel.classList.add('hidden');
      }
    }
  });

  if (panelName === 'client') {
    loadClientTasks();
  } else if (panelName === 'worker') {
    loadWorkerTasks();
  } else if (panelName === 'admin') {
    loadAdminOverview();
    loadAdminTasks();
    loadAdminWorkers();
  }
}

// Admin Subtabs
function switchAdminSubtab(subtab) {
  state.adminSubtab = subtab;
  const tabs = ['tasks', 'users', 'activity'];
  tabs.forEach(t => {
    const btn = document.getElementById(`admin-subtab-${t}`);
    const view = document.getElementById(`admin-view-${t}`);
    if (t === subtab) {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-md';
      view.classList.remove('hidden');
    } else {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surface-850';
      view.classList.add('hidden');
    }
  });

  const filterBar = document.getElementById('admin-filters-bar');
  if (filterBar) {
    if (subtab === 'tasks') {
      filterBar.classList.remove('hidden');
    } else {
      filterBar.classList.add('hidden');
    }
  }

  if (subtab === 'users') {
    loadAdminUsers();
  }
}

// ==========================================
// AUTHENTICATION & OTP
// ==========================================

function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-step-email').classList.remove('hidden');
  document.getElementById('auth-step-otp').classList.add('hidden');
  document.getElementById('dev-otp-helper').classList.add('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function quickFillAccount(email, name, role) {
  document.getElementById('auth-email-input').value = email;
  document.getElementById('auth-name-input').value = name;
  document.getElementById('auth-role-select').value = role;
  handleSendOtp();
}

async function handleSendOtp() {
  const emailInput = document.getElementById('auth-email-input');
  const nameInput = document.getElementById('auth-name-input');
  const roleSelect = document.getElementById('auth-role-select');
  const btn = document.getElementById('btn-send-otp');

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();
  const role = roleSelect.value;

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending Code...</span>';

  try {
    const data = await api('/api/auth/send-otp', 'POST', { email, name, role });
    state.lastSentEmail = email;

    document.getElementById('auth-step-email').classList.add('hidden');
    document.getElementById('auth-step-otp').classList.remove('hidden');
    document.getElementById('auth-otp-sent-to').innerText = `Code sent to: ${email}`;

    if (data.devOtp) {
      document.getElementById('dev-otp-display').innerText = data.devOtp;
      document.getElementById('dev-otp-helper').classList.remove('hidden');
      document.getElementById('auth-otp-input').value = data.devOtp;
      showToast(`Dev OTP Code: ${data.devOtp}`, 'success');
    } else {
      showToast(data.message, 'success');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Get Verification Code &rarr;</span>';
  }
}

function autoFillDevOtp() {
  const devCode = document.getElementById('dev-otp-display').innerText;
  if (devCode) {
    document.getElementById('auth-otp-input').value = devCode;
    showToast('OTP auto-filled!', 'success');
  }
}

function backToEmailStep() {
  document.getElementById('auth-step-email').classList.remove('hidden');
  document.getElementById('auth-step-otp').classList.add('hidden');
  document.getElementById('dev-otp-helper').classList.add('hidden');
}

async function handleVerifyOtp() {
  const otpInput = document.getElementById('auth-otp-input');
  const nameInput = document.getElementById('auth-name-input');
  const roleSelect = document.getElementById('auth-role-select');
  const btn = document.getElementById('btn-verify-otp');

  const email = state.lastSentEmail;
  const otp = otpInput.value.trim();
  const name = nameInput.value.trim();
  const role = roleSelect.value;

  if (!otp || otp.length < 4) {
    showToast('Please enter the 6-digit OTP code.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Verifying...</span>';

  try {
    const data = await api('/api/auth/verify-otp', 'POST', {
      email,
      otp,
      name,
      role,
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('agency_token', data.token);

    updateUserInterface();
    closeAuthModal();
    showToast(`Welcome back, ${data.user.name}!`, 'success');

    if (data.user.role === 'admin') {
      switchPanel('admin');
    } else if (data.user.role === 'worker') {
      switchPanel('worker');
    } else {
      switchPanel('client');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Verify &amp; Enter Platform</span>';
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('agency_token');
  updateUserInterface();
  showToast('Logged out successfully.', 'success');
  switchPanel('client');
}

function updateUserInterface() {
  const loggedOutBlock = document.getElementById('auth-logged-out');
  const loggedInBlock = document.getElementById('auth-logged-in');

  if (state.user) {
    loggedOutBlock.classList.add('hidden');
    loggedInBlock.classList.remove('hidden');

    document.getElementById('user-name').innerText = state.user.name;
    document.getElementById('user-role-badge').innerText = state.user.role;
    document.getElementById('user-avatar').innerText = state.user.name.charAt(0).toUpperCase();
  } else {
    loggedOutBlock.classList.remove('hidden');
    loggedInBlock.classList.add('hidden');
  }
}

async function checkSession() {
  if (!state.token) {
    updateUserInterface();
    switchPanel('client');
    return;
  }

  try {
    const data = await api('/api/auth/me');
    state.user = data.user;
    updateUserInterface();
    
    if (state.user.role === 'admin') {
      switchPanel('admin');
    } else if (state.user.role === 'worker') {
      switchPanel('worker');
    } else {
      switchPanel('client');
    }
  } catch (err) {
    console.warn('Session expired or invalid, clearing token.');
    logout();
  }
}

// ==========================================
// CLIENT PANEL LOGIC
// ==========================================

function openNewTaskModal(preselectedCategory = '') {
  if (!state.user) {
    showToast('Please sign in with Email OTP first to post a project.', 'error');
    openAuthModal();
    return;
  }

  if (preselectedCategory) {
    document.getElementById('task-category-select').value = preselectedCategory;
  }

  if (state.user.phone) {
    document.getElementById('task-phone-input').value = state.user.phone;
  }

  document.getElementById('new-task-modal').classList.remove('hidden');
}

function closeNewTaskModal() {
  document.getElementById('new-task-modal').classList.add('hidden');
}

function setBudget(val) {
  document.getElementById('task-budget-input').value = val;
}

function scrollToMyTasks() {
  document.getElementById('my-projects-section').scrollIntoView({ behavior: 'smooth' });
}

async function handleCreateTask(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-task');

  const title = document.getElementById('task-title-input').value.trim();
  const service_category = document.getElementById('task-category-select').value;
  const description = document.getElementById('task-desc-input').value.trim();
  const budget_inr = document.getElementById('task-budget-input').value;
  const deadline = document.getElementById('task-deadline-input').value.trim();
  const contact_number = document.getElementById('task-phone-input').value.trim();
  const attachment_url = document.getElementById('task-link-input').value.trim();

  btn.disabled = true;
  btn.innerHTML = '<span>Submitting Project...</span>';

  try {
    await api('/api/tasks', 'POST', {
      title,
      service_category,
      description,
      budget_inr,
      deadline,
      contact_number,
      attachment_url,
    });

    closeNewTaskModal();
    document.getElementById('new-task-form').reset();
    showToast('Project requirement submitted successfully! Our team is reviewing it.', 'success');
    loadClientTasks();
    scrollToMyTasks();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Submit Project Requirement &rarr;</span>';
  }
}

async function loadClientTasks() {
  const container = document.getElementById('client-tasks-list');
  const countBadge = document.getElementById('client-task-count');

  if (!state.user) {
    container.innerHTML = `
      <div class="p-10 text-center bg-surface-900/60 rounded-3xl border border-white/10">
        <div class="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-3 text-xl">
          🔐
        </div>
        <h4 class="text-base font-bold text-white">Login to View Your Project Pipeline</h4>
        <p class="text-xs text-slate-400 mt-1 mb-5 max-w-sm mx-auto">Enter your email to receive an instant OTP code and track your requests live.</p>
        <button onclick="openAuthModal()" class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md">
          Login with Email OTP
        </button>
      </div>
    `;
    countBadge.innerText = '0';
    return;
  }

  try {
    const data = await api('/api/tasks/my-client-tasks');
    countBadge.innerText = data.tasks.length;

    if (data.tasks.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center bg-surface-900/40 rounded-3xl border border-white/10">
          <div class="text-4xl mb-3">📁</div>
          <h4 class="text-lg font-bold text-white">No Projects In Progress</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-5">
            Tell us what you need built (Frontend, Backend, Render Deploy, Domain, or Reels) and our team will get to work!
          </p>
          <button onclick="openNewTaskModal()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-xs font-bold shadow-md">
            + Post Your First Project Requirement
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = data.tasks.map(t => `
      <div class="p-6 sm:p-7 rounded-3xl bg-surface-900 border border-white/10 hover:border-brand-500/30 transition-all shadow-xl space-y-5">
        
        <!-- Header row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="text-xs font-mono font-bold text-brand-400">#${t.id}</span>
            ${getCategoryBadge(t.service_category)}
            ${getStatusBadge(t.status)}
          </div>
          
          <div class="text-right">
            <div class="text-2xl font-bold font-mono text-emerald-400">${formatINR(t.budget_inr)}</div>
            <div class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Approved Budget</div>
          </div>
        </div>

        <!-- Project Title & Scope -->
        <div>
          <h3 class="text-xl font-bold text-white">${t.title}</h3>
          <p class="text-sm text-slate-300 mt-2 leading-relaxed">${t.description}</p>
        </div>

        <!-- Visual Milestone Stepper -->
        <div class="bg-surface-950 p-4 rounded-2xl border border-white/5 space-y-2">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Execution Milestone Progress:</span>
          ${renderMilestoneStepper(t.status)}
        </div>

        <!-- Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-surface-950/70 p-4 rounded-2xl border border-white/5">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Target Timeline:</span>
            <span class="font-bold text-amber-300 text-sm">${t.deadline}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone:</span>
            <span class="font-semibold text-slate-200">${t.contact_number || 'Not provided'}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Specialist:</span>
            <span class="font-bold ${t.worker_name ? 'text-brand-400' : 'text-amber-400'}">
              ${t.worker_name ? `🛠️ ${t.worker_name}` : '🟡 In Review / Assigning'}
            </span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Requirement Link:</span>
            ${t.attachment_url ? `<a href="${t.attachment_url}" target="_blank" class="text-brand-400 hover:underline truncate block font-mono font-medium">Open Attachment &nearr;</a>` : '<span class="text-slate-500">None attached</span>'}
          </div>
        </div>

        <!-- Deliverable & Worker Notes -->
        ${(t.worker_notes || t.submission_link) ? `
          <div class="p-5 rounded-2xl bg-brand-500/5 border border-brand-500/20 text-xs space-y-2.5">
            <div class="font-bold text-brand-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-brand-400"></span>
              <span>Latest Deliverable &amp; Notes from Worker</span>
            </div>
            ${t.worker_notes ? `<p class="text-slate-200 text-sm leading-relaxed">${t.worker_notes}</p>` : ''}
            ${t.submission_link ? `
              <div class="pt-2">
                <a href="${t.submission_link}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/20">
                  <span>🚀 Open Live Work / Deliverable Link</span>
                  <span>&nearr;</span>
                </a>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Footer -->
        <div class="text-[11px] text-slate-500 pt-3 border-t border-white/5 flex items-center justify-between">
          <span>Submitted on ${new Date(t.created_at).toLocaleDateString()}</span>
          <span class="font-mono text-slate-400">Last activity: ${new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-rose-400 text-xs bg-rose-500/10 rounded-2xl border border-rose-500/20">${err.message}</div>`;
  }
}

// ==========================================
// WORKER PANEL LOGIC
// ==========================================

async function loadWorkerTasks() {
  const container = document.getElementById('worker-tasks-list');
  const queueBadge = document.getElementById('worker-queue-badge');
  const activeCount = document.getElementById('worker-active-count');
  const completedCount = document.getElementById('worker-completed-count');

  if (!state.user) {
    container.innerHTML = `
      <div class="p-10 text-center bg-surface-900 rounded-3xl border border-white/10">
        <h4 class="text-base font-bold text-white">Worker Authentication Required</h4>
        <p class="text-xs text-slate-400 mt-1 mb-5">Please log into your worker account to view assigned jobs.</p>
        <button onclick="quickFillAccount('worker.vikram@agency.com', 'Vikram Singh', 'worker')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
          Fast Login as Demo Worker
        </button>
      </div>
    `;
    return;
  }

  try {
    const data = await api('/api/tasks/my-worker-tasks');
    queueBadge.innerText = data.tasks.length;

    const active = data.tasks.filter(t => t.status === 'Assigned' || t.status === 'In Progress').length;
    const completed = data.tasks.filter(t => t.status === 'Completed').length;
    activeCount.innerText = active;
    completedCount.innerText = completed;

    if (data.tasks.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center bg-surface-900 rounded-3xl border border-white/10">
          <div class="text-4xl mb-3">🎉</div>
          <h4 class="text-lg font-bold text-white">No Pending Tasks In Queue</h4>
          <p class="text-xs text-slate-400 mt-1">You are all caught up! New client projects assigned by the Admin will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.tasks.map(t => `
      <div class="p-6 sm:p-7 rounded-3xl bg-surface-900 border border-white/10 hover:border-brand-500/30 transition-all shadow-xl space-y-5">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="text-xs font-mono font-bold text-brand-400">#${t.id}</span>
            ${getCategoryBadge(t.service_category)}
            ${getStatusBadge(t.status)}
          </div>
          
          <div class="text-right">
            <div class="text-2xl font-bold font-mono text-emerald-400">${formatINR(t.budget_inr)}</div>
            <div class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Assigned Payout</div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white">${t.title}</h3>
          <p class="text-sm text-slate-300 mt-2 leading-relaxed">${t.description}</p>
        </div>

        <!-- Client & Job Meta -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-surface-950/80 p-4 rounded-2xl border border-white/5">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Client Contact:</span>
            <span class="font-bold text-white text-sm">${t.client_name}</span>
            <span class="text-slate-400 block">${t.client_email}</span>
            <span class="text-brand-400 font-mono font-semibold">${t.contact_number || t.client_phone || ''}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Completion Deadline:</span>
            <span class="font-bold text-amber-300 text-sm">${t.deadline}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-semibold">Client Attachment:</span>
            ${t.attachment_url ? `<a href="${t.attachment_url}" target="_blank" class="text-brand-400 hover:underline truncate block font-mono font-semibold">Open Project Reference &nearr;</a>` : '<span class="text-slate-500">None attached</span>'}
          </div>
        </div>

        <!-- Current Deliverables / Notes -->
        ${(t.worker_notes || t.submission_link) ? `
          <div class="p-4 rounded-2xl bg-surface-950 border border-white/5 text-xs space-y-1.5">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Your Submitted Notes &amp; Link:</span>
            ${t.worker_notes ? `<p class="text-slate-200 text-sm">${t.worker_notes}</p>` : ''}
            ${t.submission_link ? `<a href="${t.submission_link}" target="_blank" class="text-brand-400 hover:underline truncate block font-mono font-medium">${t.submission_link} &nearr;</a>` : ''}
          </div>
        ` : ''}

        <!-- Action Control Buttons -->
        <div class="pt-3 flex items-center justify-between border-t border-white/5">
          <span class="text-xs text-slate-500 font-mono">Last updated: ${new Date(t.updated_at).toLocaleDateString()}</span>
          
          <button onclick="openWorkerUpdateModal(${t.id}, '${escapeHtml(t.title)}', '${t.status}', '${escapeHtml(t.worker_notes || '')}', '${escapeHtml(t.submission_link || '')}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2">
            <span>⚙️ Update Stage &amp; Submit Work</span>
          </button>
        </div>

      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-rose-400 text-xs bg-rose-500/10 rounded-2xl border border-rose-500/20">${err.message}</div>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function openWorkerUpdateModal(taskId, title, status, notes, link) {
  document.getElementById('worker-modal-task-id').value = taskId;
  document.getElementById('worker-modal-task-title').innerText = `#${taskId} - ${title}`;
  document.getElementById('worker-modal-status-select').value = status === 'Completed' ? 'Completed' : (status === 'Under Review' ? 'Under Review' : 'In Progress');
  document.getElementById('worker-modal-notes').value = notes;
  document.getElementById('worker-modal-link').value = link;
  document.getElementById('worker-update-modal').classList.remove('hidden');
}

function closeWorkerUpdateModal() {
  document.getElementById('worker-update-modal').classList.add('hidden');
}

async function handleWorkerUpdateSubmit(e) {
  e.preventDefault();
  const taskId = document.getElementById('worker-modal-task-id').value;
  const status = document.getElementById('worker-modal-status-select').value;
  const worker_notes = document.getElementById('worker-modal-notes').value.trim();
  const submission_link = document.getElementById('worker-modal-link').value.trim();

  try {
    await api(`/api/tasks/${taskId}/progress`, 'PATCH', {
      status,
      worker_notes,
      submission_link,
    });

    closeWorkerUpdateModal();
    showToast('Task progress and deliverables updated successfully!', 'success');
    loadWorkerTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// ADMIN PANEL LOGIC (Owner Command Center)
// ==========================================

async function loadAdminOverview() {
  if (!state.user || state.user.role !== 'admin') return;

  try {
    const data = await api('/api/admin/overview');
    const stats = data.stats;

    document.getElementById('kpi-revenue').innerText = formatINR(stats.totalRevenue);
    document.getElementById('kpi-tasks').innerText = stats.totalTasks;
    document.getElementById('kpi-clients').innerText = stats.totalClients;
    document.getElementById('kpi-workers').innerText = stats.totalWorkers;

    const activityStream = document.getElementById('admin-activity-stream');
    if (activityStream && stats.recentActivities) {
      if (stats.recentActivities.length === 0) {
        activityStream.innerHTML = `<div class="text-xs text-slate-500 py-3 text-center">No recent activity logs.</div>`;
      } else {
        activityStream.innerHTML = stats.recentActivities.map(act => `
          <div class="p-4 rounded-2xl bg-surface-950 border border-white/5 text-xs flex items-start gap-3">
            <span class="p-2 rounded-xl bg-surface-900 border border-white/5 text-base">⚡</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-200">${act.action}</span>
                <span class="text-[10px] text-slate-500 font-mono">${new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p class="text-slate-400 mt-1">${act.details}</p>
              ${act.task_title ? `<span class="text-[11px] text-brand-400 font-mono mt-1.5 inline-block font-semibold">Project: ${act.task_title}</span>` : ''}
            </div>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Failed to load admin overview:', err);
  }
}

let adminSearchDebounceTimer = null;
function debounceAdminSearch() {
  clearTimeout(adminSearchDebounceTimer);
  adminSearchDebounceTimer = setTimeout(() => {
    loadAdminTasks();
  }, 300);
}

async function loadAdminTasks() {
  const container = document.getElementById('admin-tasks-container');

  if (!state.user || state.user.role !== 'admin') {
    container.innerHTML = `
      <div class="p-12 text-center bg-surface-900 rounded-3xl border border-white/10">
        <h4 class="text-lg font-bold text-white">Admin Privileges Required</h4>
        <p class="text-xs text-slate-400 mt-1 mb-5">Please log in as the agency owner to access the full command center.</p>
        <button onclick="quickFillAccount('admin@agency.com', 'Admin Boss', 'admin')" class="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md">
          👑 1-Click Login as Admin
        </button>
      </div>
    `;
    return;
  }

  const status = document.getElementById('admin-filter-status').value;
  const category = document.getElementById('admin-filter-category').value;
  const search = document.getElementById('admin-search-input').value.trim();

  let query = `?status=${encodeURIComponent(status)}&category=${encodeURIComponent(category)}`;
  if (search) {
    query += `&search=${encodeURIComponent(search)}`;
  }

  try {
    const data = await api(`/api/admin/tasks${query}`);
    state.adminTasks = data.tasks;

    if (data.tasks.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center bg-surface-900 rounded-3xl border border-white/10">
          <div class="text-4xl mb-3">🔍</div>
          <h4 class="text-base font-bold text-white">No Matching Projects Found</h4>
          <p class="text-xs text-slate-400 mt-1">Try resetting your search query or status filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.tasks.map(t => {
      const cleanPhone = (t.contact_number || t.client_phone || '').replace(/[^0-9]/g, '');
      const emailLink = t.client_email ? `mailto:${t.client_email}?subject=Bitnexa%20Agency%20Update%20-%20${encodeURIComponent(t.title)}` : null;

      return `
        <div class="p-6 sm:p-7 rounded-3xl bg-surface-900 border border-white/10 hover:border-brand-500/30 transition-all shadow-xl space-y-5">
          
          <!-- Top Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-xs font-mono font-bold text-brand-400">#${t.id}</span>
              ${getCategoryBadge(t.service_category)}
              ${getStatusBadge(t.status)}
            </div>
            
            <div class="text-right">
              <span class="text-[10px] text-slate-500 block uppercase font-semibold">Contract Budget:</span>
              <span class="text-2xl font-bold font-mono text-emerald-400">${formatINR(t.budget_inr)}</span>
            </div>
          </div>

          <!-- Title & Description -->
          <div>
            <h3 class="text-xl font-bold text-white">${t.title}</h3>
            <p class="text-sm text-slate-300 mt-2 leading-relaxed">${t.description}</p>
          </div>

          <!-- Client & Worker Inspector Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 bg-surface-950 p-5 rounded-2xl border border-white/5">
            
            <!-- Client Card -->
            <div class="space-y-2 text-xs">
              <div class="text-[10px] text-brand-400 font-bold uppercase tracking-widest flex items-center justify-between">
                <span>👤 CLIENT DETAILS:</span>
                ${emailLink ? `
                  <a href="${emailLink}" target="_blank" class="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold">
                    <span>✉️ Email Client</span> &nearr;
                  </a>
                ` : ''}
              </div>
              
              <div class="font-bold text-white text-base">${t.client_name}</div>
              <div class="text-slate-400">${t.client_email}</div>
              <div class="text-slate-300 font-mono">Phone: <strong class="text-white">${t.contact_number || t.client_phone || 'N/A'}</strong></div>
              
              ${t.attachment_url ? `
                <div class="pt-1.5">
                  <a href="${t.attachment_url}" target="_blank" class="text-brand-400 hover:underline inline-flex items-center gap-1 font-mono font-medium">
                    <span>📎 Project Reference / Figma / Drive Link</span> &nearr;
                  </a>
                </div>
              ` : ''}
            </div>

            <!-- Assigned Worker & Inline Reassignment -->
            <div class="space-y-2.5 text-xs">
              <div class="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span>🛠️ ASSIGNED WORKER / ENGINEER:</span>
              </div>
              
              <div class="flex items-center gap-2">
                <select onchange="assignWorkerDirect(${t.id}, this.value)" class="flex-1 bg-surface-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 shadow-sm">
                  <option value="">-- Unassigned (Select to assign worker) --</option>
                  ${state.workersList.map(w => `
                    <option value="${w.id}" ${t.worker_id === w.id ? 'selected' : ''}>
                      ${w.name} (${w.skills ? w.skills.split(',')[0] : 'General'})
                    </option>
                  `).join('')}
                </select>
              </div>

              ${t.worker_id ? `
                <div class="text-slate-400 text-xs space-y-0.5">
                  <div>Email: <span class="text-slate-200">${t.worker_email}</span></div>
                  <div>Skills: <span class="text-brand-300">${t.worker_skills || 'Fullstack'}</span></div>
                </div>
              ` : '<div class="text-amber-400 text-xs font-semibold">⚠️ No worker assigned yet! Select from dropdown to dispatch work.</div>'}

            </div>

          </div>

          <!-- Deliverable & Progress if any -->
          ${(t.worker_notes || t.submission_link) ? `
            <div class="p-4 rounded-2xl bg-surface-950 border border-white/5 text-xs space-y-1.5">
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker Deliverable / Live Link:</span>
              ${t.worker_notes ? `<p class="text-slate-200 text-sm">${t.worker_notes}</p>` : ''}
              ${t.submission_link ? `<a href="${t.submission_link}" target="_blank" class="text-brand-400 hover:underline truncate block font-mono font-medium text-sm">${t.submission_link} &nearr;</a>` : ''}
            </div>
          ` : ''}

          <!-- Bottom Actions Row -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
            <div class="text-slate-500 text-[11px] font-mono">
              Created: ${new Date(t.created_at).toLocaleDateString()} &bull; Target: <strong class="text-slate-300">${t.deadline}</strong>
            </div>
            
            <div class="flex items-center gap-2">
              <button onclick="openAdminManageModal(${t.id})" class="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-2 transition-all">
                <span>✏️ Manage &amp; Status Override</span>
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-rose-400 text-xs bg-rose-500/10 rounded-2xl border border-rose-500/20">${err.message}</div>`;
  }
}

async function loadAdminWorkers() {
  if (!state.user || state.user.role !== 'admin') return;

  try {
    const data = await api('/api/admin/workers');
    state.workersList = data.workers;

    const select = document.getElementById('admin-modal-worker-select');
    if (select) {
      select.innerHTML = `
        <option value="">-- No Worker Assigned (Unassigned) --</option>
        ${data.workers.map(w => `
          <option value="${w.id}">${w.name} (${w.skills || 'All skills'}) [Active: ${w.active_tasks_count}]</option>
        `).join('')}
      `;
    }
  } catch (err) {
    console.error('Failed to load workers list:', err);
  }
}

async function assignWorkerDirect(taskId, workerId) {
  try {
    const res = await api(`/api/admin/tasks/${taskId}/assign`, 'PATCH', {
      worker_id: workerId ? parseInt(workerId, 10) : null,
    });
    showToast(res.message, 'success');
    loadAdminTasks();
    loadAdminOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openAdminManageModal(taskId) {
  const task = state.adminTasks.find(t => t.id === taskId);
  if (!task) return;

  document.getElementById('admin-modal-task-id').value = task.id;
  document.getElementById('admin-modal-task-title').innerText = `#${task.id} - ${task.title}`;
  document.getElementById('admin-modal-worker-select').value = task.worker_id || '';
  document.getElementById('admin-modal-status-select').value = task.status;
  document.getElementById('admin-modal-budget').value = task.budget_inr;
  document.getElementById('admin-modal-notes').value = task.worker_notes || '';
  document.getElementById('admin-modal-link').value = task.submission_link || '';

  document.getElementById('admin-manage-modal').classList.remove('hidden');
}

function closeAdminManageModal() {
  document.getElementById('admin-manage-modal').classList.add('hidden');
}

async function handleAdminManageSubmit(e) {
  e.preventDefault();
  const taskId = document.getElementById('admin-modal-task-id').value;
  const worker_id = document.getElementById('admin-modal-worker-select').value;
  const status = document.getElementById('admin-modal-status-select').value;
  const budget_inr = document.getElementById('admin-modal-budget').value;
  const worker_notes = document.getElementById('admin-modal-notes').value.trim();
  const submission_link = document.getElementById('admin-modal-link').value.trim();

  try {
    await api(`/api/admin/tasks/${taskId}/assign`, 'PATCH', {
      worker_id: worker_id ? parseInt(worker_id, 10) : null,
    });

    await api(`/api/admin/tasks/${taskId}`, 'PATCH', {
      status,
      budget_inr,
      worker_notes,
      submission_link,
    });

    closeAdminManageModal();
    showToast('Project updated successfully by Admin.', 'success');
    loadAdminTasks();
    loadAdminOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadAdminUsers() {
  if (!state.user || state.user.role !== 'admin') return;

  const clientsList = document.getElementById('admin-clients-list');
  const workersList = document.getElementById('admin-workers-list');
  const clientCountEl = document.getElementById('user-dir-client-count');
  const workerCountEl = document.getElementById('user-dir-worker-count');

  try {
    const data = await api('/api/admin/users');
    const clients = data.users.filter(u => u.role === 'client');
    const workers = data.users.filter(u => u.role === 'worker');

    clientCountEl.innerText = clients.length;
    workerCountEl.innerText = workers.length;

    clientsList.innerHTML = clients.map(c => `
      <div class="p-4 rounded-2xl bg-surface-950 border border-white/5 text-xs flex items-center justify-between">
        <div>
          <div class="font-bold text-white text-sm">${c.name}</div>
          <div class="text-slate-400">${c.email}</div>
          <div class="text-slate-500 font-mono text-[10px] mt-0.5">Phone: ${c.phone || 'N/A'}</div>
        </div>
        <div class="text-right">
          <div class="text-emerald-400 font-mono font-bold text-sm">${formatINR(c.total_volume_inr)}</div>
          <div class="text-[10px] text-slate-500">${c.task_count} tasks posted</div>
        </div>
      </div>
    `).join('') || '<div class="text-xs text-slate-500">No clients registered yet.</div>';

    workersList.innerHTML = workers.map(w => `
      <div class="p-4 rounded-2xl bg-surface-950 border border-white/5 text-xs flex items-center justify-between">
        <div>
          <div class="font-bold text-white text-sm">${w.name}</div>
          <div class="text-slate-400">${w.email}</div>
          <div class="text-brand-400 text-[11px] mt-0.5">Skills: ${w.skills || 'General Tech'}</div>
        </div>
        <div class="text-right">
          <div class="text-brand-400 font-mono font-bold text-sm">${w.task_count} Jobs</div>
          <div class="text-[10px] text-slate-500">Completed: ${formatINR(w.total_volume_inr)}</div>
        </div>
      </div>
    `).join('') || '<div class="text-xs text-slate-500">No workers registered yet.</div>';
  } catch (err) {
    console.error('Failed to load users directory:', err);
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
});

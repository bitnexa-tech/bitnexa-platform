/**
 * DevFlow Studio Pro - Dedicated Worker Kanban Workstation Engine
 * Agile sprint board with 4 columns: Assigned, In Progress, Under Review, Completed.
 * Uses isolated `agency_worker_token` & background live-sync polling.
 */

const state = {
  token: localStorage.getItem('agency_worker_token') || null,
  user: null,
  tasks: [],
  lastSentEmail: '',
  pollInterval: null,
};

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
    console.error(`Worker API Error [${method} ${path}]:`, err);
    throw err;
  }
}

function formatINR(amount) {
  const num = parseInt(amount, 10) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

function getCategoryBadge(category) {
  const configs = {
    'Website Frontend': { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30', icon: '💻' },
    'Website Backend': { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: '⚙️' },
    'Domain & Cloud Deployment': { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: '🚀' },
    'Domain & DNS Setup': { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: '🌐' },
    'Reels & Video Editing': { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: '🎬' },
    'Instagram Promotion': { bg: 'bg-pink-500/10 text-pink-400 border-pink-500/30', icon: '📈' },
    'Full-Stack Custom': { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: '⚡' },
  };

  const cfg = configs[category] || { bg: 'bg-slate-700/20 text-slate-300 border-slate-700', icon: '📌' };
  return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${cfg.bg}">
    <span>${cfg.icon}</span>
    <span>${category}</span>
  </span>`;
}

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

function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-step-email').classList.remove('hidden');
  document.getElementById('auth-step-otp').classList.add('hidden');
  document.getElementById('dev-otp-helper').classList.add('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function quickFillWorker(email, name) {
  document.getElementById('auth-email-input').value = email;
  document.getElementById('auth-name-input').value = name;
  handleSendOtp();
}

async function handleSendOtp() {
  const emailInput = document.getElementById('auth-email-input');
  const nameInput = document.getElementById('auth-name-input');
  const btn = document.getElementById('btn-send-otp');

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid worker email address.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending Code...</span>';

  try {
    const data = await api('/api/auth/send-otp', 'POST', { email, name, role: 'worker' });
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
}

async function handleVerifyOtp() {
  const otpInput = document.getElementById('auth-otp-input');
  const nameInput = document.getElementById('auth-name-input');
  const btn = document.getElementById('btn-verify-otp');

  const email = state.lastSentEmail;
  const otp = otpInput.value.trim();
  const name = nameInput.value.trim();

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
      role: 'worker',
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('agency_worker_token', data.token);

    updateUserInterface();
    closeAuthModal();
    showToast(`Welcome to Worker Desk, ${data.user.name}!`, 'success');
    loadWorkerTasks();
    startPolling();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Verify &amp; Enter Worker Desk</span>';
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('agency_worker_token');
  stopPolling();
  updateUserInterface();
  showToast('Logged out from Worker Desk.', 'success');
  renderKanbanBoard([]);
}

function updateUserInterface() {
  const loggedOutBlock = document.getElementById('auth-logged-out');
  const loggedInBlock = document.getElementById('auth-logged-in');

  if (state.user) {
    loggedOutBlock.classList.add('hidden');
    loggedInBlock.classList.remove('hidden');
    document.getElementById('user-name').innerText = state.user.name;
    document.getElementById('user-avatar').innerText = state.user.name.charAt(0).toUpperCase();
  } else {
    loggedOutBlock.classList.remove('hidden');
    loggedInBlock.classList.add('hidden');
  }
}

async function checkSession() {
  if (!state.token) {
    updateUserInterface();
    renderLoggedOutKanban();
    return;
  }

  try {
    const data = await api('/api/auth/me');
    state.user = data.user;
    updateUserInterface();
    loadWorkerTasks();
    startPolling();
  } catch (err) {
    logout();
  }
}

function renderLoggedOutKanban() {
  const cols = ['assigned', 'progress', 'review', 'completed'];
  cols.forEach(col => {
    document.getElementById(`col-cards-${col}`).innerHTML = `
      <div class="p-6 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-2xl">
        Sign in to view tasks
      </div>
    `;
    document.getElementById(`col-count-${col}`).innerText = '0';
  });
  document.getElementById('stat-todo-count').innerText = '0';
  document.getElementById('stat-active-count').innerText = '0';
  document.getElementById('stat-done-count').innerText = '0';
}

async function loadWorkerTasks() {
  if (!state.user) {
    renderLoggedOutKanban();
    return;
  }

  try {
    const data = await api('/api/tasks/my-worker-tasks');
    state.tasks = data.tasks || [];
    filterWorkerCards();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function filterWorkerCards() {
  const searchTerm = (document.getElementById('worker-search-input')?.value || '').toLowerCase();
  const categoryFilter = document.getElementById('worker-category-filter')?.value || 'All';

  let filtered = state.tasks;
  if (categoryFilter !== 'All') {
    filtered = filtered.filter(t => t.service_category === categoryFilter);
  }
  if (searchTerm) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(searchTerm) || 
      (t.client_name && t.client_name.toLowerCase().includes(searchTerm)) ||
      (t.description && t.description.toLowerCase().includes(searchTerm))
    );
  }

  renderKanbanBoard(filtered);
}

function renderKanbanBoard(tasks) {
  const assigned = tasks.filter(t => t.status === 'Assigned' || t.status === 'Pending Approval');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const underReview = tasks.filter(t => t.status === 'Under Review');
  const completed = tasks.filter(t => t.status === 'Completed');

  // Update Counters
  document.getElementById('col-count-assigned').innerText = assigned.length;
  document.getElementById('col-count-progress').innerText = inProgress.length;
  document.getElementById('col-count-review').innerText = underReview.length;
  document.getElementById('col-count-completed').innerText = completed.length;

  document.getElementById('stat-todo-count').innerText = assigned.length;
  document.getElementById('stat-active-count').innerText = inProgress.length;
  document.getElementById('stat-done-count').innerText = completed.length;

  // Render Column Cards
  document.getElementById('col-cards-assigned').innerHTML = assigned.length === 0 ? renderEmptyCol('No assigned tasks') : assigned.map(renderTaskCard).join('');
  document.getElementById('col-cards-progress').innerHTML = inProgress.length === 0 ? renderEmptyCol('No active tasks') : inProgress.map(renderTaskCard).join('');
  document.getElementById('col-cards-review').innerHTML = underReview.length === 0 ? renderEmptyCol('No tasks in review') : underReview.map(renderTaskCard).join('');
  document.getElementById('col-cards-completed').innerHTML = completed.length === 0 ? renderEmptyCol('No completed tasks') : completed.map(renderTaskCard).join('');
}

function renderEmptyCol(msg) {
  return `<div class="p-6 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-2xl">${msg}</div>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function renderTaskCard(t) {
  const cleanPhone = (t.contact_number || t.client_phone || '').replace(/[^0-9]/g, '');
  const isAssigned = t.status === 'Assigned' || t.status === 'Pending Approval';
  const isInProgress = t.status === 'In Progress';
  const isReview = t.status === 'Under Review';
  const isCompleted = t.status === 'Completed';

  return `
    <div class="worker-task-card space-y-3">
      
      <!-- Card Top: Category & Payout -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] font-mono font-bold text-emerald-400">#${t.id}</span>
          ${getCategoryBadge(t.service_category)}
        </div>
        <div class="text-right">
          <span class="font-bold font-mono text-emerald-400 text-sm">${formatINR(t.budget_inr)}</span>
        </div>
      </div>

      <!-- Card Title & Scope Preview -->
      <div>
        <h4 class="text-sm font-bold text-white leading-snug hover:text-emerald-300 transition-colors">${t.title}</h4>
        <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">${t.description}</p>
      </div>

      <!-- Client & Deadline Info -->
      <div class="p-2.5 rounded-xl bg-surface-950/80 border border-white/5 text-[11px] space-y-1">
        <div class="flex items-center justify-between text-slate-300">
          <span>Client: <strong class="text-white">${t.client_name || 'Anonymous'}</strong></span>
          ${cleanPhone ? `<span class="text-emerald-400 font-mono">${cleanPhone}</span>` : ''}
        </div>
        <div class="flex items-center justify-between text-slate-400 font-mono">
          <span>Deadline:</span>
          <span class="text-amber-300 font-bold">${t.deadline}</span>
        </div>
        ${t.attachment_url ? `
          <div class="pt-1">
            <a href="${t.attachment_url}" target="_blank" class="text-emerald-400 hover:underline flex items-center gap-1 font-mono">
              <span>📎 View Reference</span> &nearr;
            </a>
          </div>
        ` : ''}
      </div>

      <!-- Deliverable Link Preview (If added) -->
      ${(t.submission_link || t.worker_notes) ? `
        <div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] space-y-0.5">
          ${t.submission_link ? `<a href="${t.submission_link}" target="_blank" class="text-emerald-300 hover:underline font-mono truncate block font-semibold">${t.submission_link} &nearr;</a>` : ''}
          ${t.worker_notes ? `<p class="text-slate-300 line-clamp-1 italic text-[10px]">${t.worker_notes}</p>` : ''}
        </div>
      ` : ''}

      <!-- Stage Transition Actions -->
      <div class="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
        
        ${isAssigned ? `
          <button onclick="quickUpdateStatus(${t.id}, 'In Progress')" class="w-full py-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all">
            <span>⚡ Start Working</span>
          </button>
        ` : ''}

        ${isInProgress ? `
          <button onclick="openWorkerUpdateModal(${t.id}, '${escapeHtml(t.title)}', 'Under Review', '${escapeHtml(t.worker_notes || '')}', '${escapeHtml(t.submission_link || '')}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all">
            <span>🚀 Submit &amp; Review</span>
          </button>
        ` : ''}

        ${isReview ? `
          <div class="grid grid-cols-2 gap-2 w-full">
            <button onclick="openWorkerUpdateModal(${t.id}, '${escapeHtml(t.title)}', '${t.status}', '${escapeHtml(t.worker_notes || '')}', '${escapeHtml(t.submission_link || '')}')" class="py-1.5 rounded-xl bg-surface-900 border border-white/10 text-slate-300 text-xs font-semibold hover:border-emerald-400">
              Edit
            </button>
            <button onclick="quickUpdateStatus(${t.id}, 'Completed')" class="py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-sm">
              ✅ Mark Done
            </button>
          </div>
        ` : ''}

        ${isCompleted ? `
          <div class="w-full flex items-center justify-between text-xs text-emerald-400 font-semibold px-1">
            <span>🎉 Job Completed</span>
            <button onclick="openWorkerUpdateModal(${t.id}, '${escapeHtml(t.title)}', '${t.status}', '${escapeHtml(t.worker_notes || '')}', '${escapeHtml(t.submission_link || '')}')" class="text-slate-400 hover:text-white underline text-[11px]">
              Notes
            </button>
          </div>
        ` : ''}

      </div>

    </div>
  `;
}

async function quickUpdateStatus(taskId, newStatus) {
  try {
    await api(`/api/tasks/${taskId}/progress`, 'PATCH', {
      status: newStatus,
    });
    showToast(`Job status updated to "${newStatus}"!`, 'success');
    loadWorkerTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
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
    showToast('Task progress and deliverable submitted successfully!', 'success');
    loadWorkerTasks();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function startPolling() {
  stopPolling();
  state.pollInterval = setInterval(() => {
    if (state.token && state.user) {
      loadWorkerTasks();
    }
  }, 8000);
}

function stopPolling() {
  if (state.pollInterval) {
    clearInterval(state.pollInterval);
    state.pollInterval = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkSession();
});

/**
 * DevFlow Studio Pro - Dedicated Admin Command Center Engine
 * High-density operations CRM table, Direct 1-click email client contact,
 * direct worker assignment dropdown, and financial analytics.
 * Uses isolated `agency_admin_token` & background live-sync polling.
 */

const state = {
  token: localStorage.getItem('agency_admin_token') || null,
  user: null,
  adminSubtab: 'tasks',
  workersList: [],
  adminTasks: [],
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
    console.error(`Admin API Error [${method} ${path}]:`, err);
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
    'Render Deployment': { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: '🚀' },
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
  const borderCls = type === 'error' ? 'border-rose-500/40 bg-surface-900 text-rose-300' : 'border-purple-500/40 bg-surface-900 text-purple-300';
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

function switchAdminSubtab(subtab) {
  state.adminSubtab = subtab;
  const tabs = ['tasks', 'users', 'activity'];
  tabs.forEach(t => {
    const btn = document.getElementById(`admin-subtab-${t}`);
    const view = document.getElementById(`admin-view-${t}`);
    if (t === subtab) {
      btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-md';
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

function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-step-email').classList.remove('hidden');
  document.getElementById('auth-step-otp').classList.add('hidden');
  document.getElementById('dev-otp-helper').classList.add('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function quickFillAdmin() {
  document.getElementById('auth-email-input').value = 'admin@agency.com';
  handleSendOtp();
}

async function handleSendOtp() {
  const emailInput = document.getElementById('auth-email-input');
  const btn = document.getElementById('btn-send-otp');
  const email = emailInput.value.trim();

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid admin email address.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending Code...</span>';

  try {
    const data = await api('/api/auth/send-otp', 'POST', { email, name: 'Admin Boss', role: 'admin' });
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
  const btn = document.getElementById('btn-verify-otp');
  const email = state.lastSentEmail;
  const otp = otpInput.value.trim();

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
      name: 'Admin Boss',
      role: 'admin',
    });

    if (data.user.role !== 'admin') {
      throw new Error('Access denied: Designated account is not configured as an administrator.');
    }

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('agency_admin_token', data.token);

    updateUserInterface();
    closeAuthModal();
    showToast(`Welcome Owner, ${data.user.name}!`, 'success');
    refreshAllAdminData();
    startPolling();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Verify &amp; Enter Admin Command</span>';
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('agency_admin_token');
  stopPolling();
  updateUserInterface();
  showToast('Logged out from Admin Command Center.', 'success');
  renderLoggedOutTable();
}

function updateUserInterface() {
  const loggedOutBlock = document.getElementById('auth-logged-out');
  const loggedInBlock = document.getElementById('auth-logged-in');

  if (state.user && state.user.role === 'admin') {
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
    renderLoggedOutTable();
    return;
  }

  try {
    const data = await api('/api/auth/me');
    if (data.user.role === 'admin') {
      state.user = data.user;
      updateUserInterface();
      refreshAllAdminData();
      startPolling();
    } else {
      logout();
    }
  } catch (err) {
    logout();
  }
}

function renderLoggedOutTable() {
  const tbody = document.getElementById('admin-tasks-table-body');
  tbody.innerHTML = `
    <tr>
      <td colspan="8" class="p-12 text-center">
        <h4 class="text-base font-bold text-white mb-1">Owner Authentication Required</h4>
        <p class="text-xs text-slate-400 mb-4">Please log in with the administrator account to view and manage projects.</p>
        <button onclick="quickFillAdmin()" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md">
          👑 1-Click Login as Admin
        </button>
      </td>
    </tr>
  `;
  document.getElementById('kpi-revenue').innerText = '₹0';
  document.getElementById('kpi-tasks').innerText = '0';
  document.getElementById('kpi-unassigned').innerText = '0';
  document.getElementById('kpi-clients').innerText = '0';
  document.getElementById('kpi-workers').innerText = '0';
}

async function refreshAllAdminData() {
  if (!state.user || state.user.role !== 'admin') return;
  await loadAdminWorkers();
  await loadAdminOverview();
  await loadAdminTasks();
}

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
          <div class="p-4 rounded-2xl bg-surface-950 border border-purple-500/15 text-xs flex items-start gap-3">
            <span class="p-2 rounded-xl bg-surface-900 border border-purple-500/20 text-base">⚡</span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-200">${act.action}</span>
                <span class="text-[10px] text-slate-500 font-mono">${new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p class="text-slate-400 mt-1">${act.details}</p>
              ${act.task_title ? `<span class="text-[11px] text-purple-300 font-mono mt-1.5 inline-block font-semibold">Project: ${act.task_title}</span>` : ''}
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

async function loadAdminWorkers() {
  if (!state.user || state.user.role !== 'admin') return;

  try {
    const data = await api('/api/admin/workers');
    state.workersList = data.workers || [];

    const select = document.getElementById('admin-modal-worker-select');
    if (select) {
      select.innerHTML = `
        <option value="">-- No Worker Assigned (Unassigned) --</option>
        ${state.workersList.map(w => `
          <option value="${w.id}">${w.name} (${w.skills ? w.skills.split(',')[0] : 'General'}) [Active: ${w.active_tasks_count}]</option>
        `).join('')}
      `;
    }
  } catch (err) {
    console.error('Failed to load workers list:', err);
  }
}

async function loadAdminTasks() {
  const tbody = document.getElementById('admin-tasks-table-body');
  if (!state.user || state.user.role !== 'admin') return;

  const status = document.getElementById('admin-filter-status').value;
  const category = document.getElementById('admin-filter-category').value;
  const search = document.getElementById('admin-search-input').value.trim();

  let query = `?status=${encodeURIComponent(status)}&category=${encodeURIComponent(category)}`;
  if (search) {
    query += `&search=${encodeURIComponent(search)}`;
  }

  try {
    const data = await api(`/api/admin/tasks${query}`);
    state.adminTasks = data.tasks || [];

    // Calculate unassigned
    const unassignedCount = state.adminTasks.filter(t => !t.worker_id).length;
    document.getElementById('kpi-unassigned').innerText = unassignedCount;

    if (state.adminTasks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="p-12 text-center text-xs text-slate-400">
            No matching projects found. Try resetting filters or search query.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = state.adminTasks.map(t => {
      const cleanPhone = (t.contact_number || t.client_phone || '').replace(/[^0-9]/g, '');
      const emailLink = t.client_email ? `mailto:${t.client_email}?subject=Bitnexa%20Agency%20Update%20-%20${encodeURIComponent(t.title)}` : null;

      return `
        <tr class="hover:bg-purple-500/5 transition-colors">
          
          <!-- ID & Category -->
          <td class="font-mono text-purple-300 font-bold">
            <div>#${t.id}</div>
            <div class="text-[10px] text-slate-500 font-sans mt-1">${new Date(t.created_at).toLocaleDateString()}</div>
          </td>

          <!-- Client Contact & 1-Click Email -->
          <td>
            <div class="font-bold text-white text-sm flex items-center gap-2">
              <span>${t.client_name || 'Client'}</span>
            </div>
            <div class="text-xs text-slate-400">${t.client_email}</div>
            
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              ${cleanPhone ? `
                <a href="${emailLink}" target="_blank" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-[11px] border border-emerald-500/30 transition-colors">
                  <span>✉️ Email</span> &nearr;
                </a>
              ` : '<span class="text-slate-500 text-[10px]">No phone</span>'}
              <span class="text-[11px] text-slate-400 font-mono">${cleanPhone || ''}</span>
            </div>
          </td>

          <!-- Project Title & Scope -->
          <td class="max-w-xs">
            <div class="mb-1">${getCategoryBadge(t.service_category)}</div>
            <div class="font-bold text-white text-xs leading-snug">${t.title}</div>
            <div class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">${t.description}</div>
            ${t.attachment_url ? `
              <div class="mt-1">
                <a href="${t.attachment_url}" target="_blank" class="text-purple-300 hover:underline inline-flex items-center gap-1 font-mono text-[11px]">
                  <span>📎 Attachment Link</span> &nearr;
                </a>
              </div>
            ` : ''}
          </td>

          <!-- Budget (₹) -->
          <td class="text-right">
            <div class="font-mono font-bold text-emerald-400 text-base">${formatINR(t.budget_inr)}</div>
            <div class="text-[10px] text-slate-500 font-mono">Target: ${t.deadline}</div>
            <button onclick="quickEditBudget(${t.id}, ${t.budget_inr})" class="text-[10px] text-purple-300 hover:underline mt-0.5 inline-block">
              Edit ₹
            </button>
          </td>

          <!-- Assign Worker (Interactive Dropdown) -->
          <td>
            <div class="space-y-1">
              <select onchange="assignWorkerDirect(${t.id}, this.value)" class="w-48 bg-surface-900 border ${t.worker_id ? 'border-purple-500/30 text-white' : 'border-amber-500/40 text-amber-300'} rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-400 shadow-sm">
                <option value="">-- Select Worker --</option>
                ${state.workersList.map(w => `
                  <option value="${w.id}" ${t.worker_id === w.id ? 'selected' : ''}>
                    ${w.name} (${w.skills ? w.skills.split(',')[0] : 'Tech'}) [${w.active_tasks_count}]
                  </option>
                `).join('')}
              </select>
              ${t.worker_id ? `
                <div class="text-[10px] text-emerald-400 font-mono">Assigned: ${t.worker_name}</div>
              ` : '<div class="text-[10px] text-amber-400 font-semibold">⚠️ Needs Assignment</div>'}
            </div>
          </td>

          <!-- Status Stage (Interactive Dropdown) -->
          <td>
            <select onchange="updateStatusDirect(${t.id}, this.value)" class="bg-surface-900 border border-purple-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 shadow-sm font-semibold">
              <option value="Pending Approval" ${t.status === 'Pending Approval' ? 'selected' : ''}>🟡 Pending Approval</option>
              <option value="Assigned" ${t.status === 'Assigned' ? 'selected' : ''}>🔵 Assigned</option>
              <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>🟣 In Progress</option>
              <option value="Under Review" ${t.status === 'Under Review' ? 'selected' : ''}>🟠 Under Review</option>
              <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>🟢 Completed</option>
              <option value="Cancelled" ${t.status === 'Cancelled' ? 'selected' : ''}>🔴 Cancelled</option>
            </select>
          </td>

          <!-- Deliverables & Worker Notes -->
          <td class="max-w-[200px]">
            ${t.submission_link ? `
              <a href="${t.submission_link}" target="_blank" class="text-purple-300 hover:underline font-mono text-[11px] truncate block font-bold">
                🚀 ${t.submission_link} &nearr;
              </a>
            ` : '<span class="text-slate-500 text-[11px] font-mono">Pending delivery</span>'}
            ${t.worker_notes ? `
              <div class="text-[10px] text-slate-400 line-clamp-2 italic mt-0.5">${t.worker_notes}</div>
            ` : ''}
          </td>

          <!-- Actions -->
          <td class="text-right">
            <button onclick="openAdminManageModal(${t.id})" class="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all">
              Manage
            </button>
          </td>

        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-rose-400 text-xs">${err.message}</td></tr>`;
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

async function updateStatusDirect(taskId, newStatus) {
  try {
    await api(`/api/admin/tasks/${taskId}`, 'PATCH', {
      status: newStatus,
    });
    showToast(`Task #${taskId} status updated to "${newStatus}"!`, 'success');
    loadAdminTasks();
    loadAdminOverview();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function quickEditBudget(taskId, currentBudget) {
  const newBudget = prompt('Enter new approved budget in ₹ INR:', currentBudget);
  if (newBudget === null) return;
  const num = parseInt(newBudget, 10);
  if (isNaN(num) || num < 0) {
    showToast('Please enter a valid numeric budget.', 'error');
    return;
  }

  try {
    await api(`/api/admin/tasks/${taskId}`, 'PATCH', {
      budget_inr: num,
    });
    showToast(`Budget for Task #${taskId} updated to ₹${num.toLocaleString('en-IN')}`, 'success');
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
      <div class="p-4 rounded-2xl bg-surface-950 border border-purple-500/15 text-xs flex items-center justify-between">
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
      <div class="p-4 rounded-2xl bg-surface-950 border border-purple-500/15 text-xs flex items-center justify-between">
        <div>
          <div class="font-bold text-white text-sm">${w.name}</div>
          <div class="text-slate-400">${w.email}</div>
          <div class="text-purple-300 text-[11px] mt-0.5">Skills: ${w.skills || 'General Tech'}</div>
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

function startPolling() {
  stopPolling();
  state.pollInterval = setInterval(() => {
    if (state.token && state.user) {
      loadAdminOverview();
      loadAdminTasks();
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

/**
 * DevFlow Studio Pro - Dedicated Client Customer Portal
 * Complete UI isolation with custom sections and automatic live sync
 */

const state = {
  token: localStorage.getItem('agency_client_token') || null,
  user: null,
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
    console.error(`Client API Error [${method} ${path}]:`, err);
    throw err;
  }
}

function formatINR(amount) {
  const num = parseInt(amount, 10) || 0;
  return '₹' + num.toLocaleString('en-IN');
}

function showClientSection(sectionName) {
  const secOrders = document.getElementById('section-orders');
  const secCatalog = document.getElementById('section-catalog');
  const navOrders = document.getElementById('nav-btn-orders');
  const navCatalog = document.getElementById('nav-btn-catalog');
  const heading = document.getElementById('page-heading');

  if (sectionName === 'catalog') {
    secOrders.classList.add('hidden');
    secCatalog.classList.remove('hidden');
    navOrders.className = 'w-full px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-all text-left';
    navCatalog.className = 'w-full px-3.5 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-2.5 transition-all text-left';
    heading.innerText = 'Services Store & Order Builder';
  } else {
    secOrders.classList.remove('hidden');
    secCatalog.classList.add('hidden');
    navOrders.className = 'w-full px-3.5 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold flex items-center gap-2.5 transition-all text-left';
    navCatalog.className = 'w-full px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2.5 transition-all text-left';
    heading.innerText = 'Customer Order Dashboard';
    loadClientTasks();
  }
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
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${cfg.bg}">
    <span>${cfg.icon}</span>
    <span>${category}</span>
  </span>`;
}

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
    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
    <span>${status}</span>
  </span>`;
}

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
              ? 'text-sky-300 font-bold bg-sky-500/20 border-sky-500/50 shadow-sm shadow-sky-500/20'
              : 'text-emerald-400 font-semibold bg-emerald-500/10 border-emerald-500/30';
            barCls = 'bg-sky-500';
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

function quickFillClient() {
  document.getElementById('auth-email-input').value = 'client.rohit@example.com';
  document.getElementById('auth-name-input').value = 'Rohit Sharma';
  handleSendOtp();
}

async function handleSendOtp() {
  const emailInput = document.getElementById('auth-email-input');
  const nameInput = document.getElementById('auth-name-input');
  const btn = document.getElementById('btn-send-otp');

  const email = emailInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending Code...</span>';

  try {
    const data = await api('/api/auth/send-otp', 'POST', { email, name, role: 'client' });
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
      role: 'client',
    });

    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('agency_client_token', data.token);

    updateUserInterface();
    closeAuthModal();
    showToast(`Welcome, ${data.user.name}!`, 'success');
    loadClientTasks();
    startPolling();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Verify &amp; Enter Client Portal</span>';
  }
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('agency_client_token');
  stopPolling();
  updateUserInterface();
  showToast('Logged out from Client Portal.', 'success');
  loadClientTasks();
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
    loadClientTasks();
    return;
  }

  try {
    const data = await api('/api/auth/me');
    state.user = data.user;
    updateUserInterface();
    loadClientTasks();
    startPolling();
  } catch (err) {
    logout();
  }
}

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
  btn.innerHTML = '<span>Submitting Order...</span>';

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
    showClientSection('orders');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span>Submit Order Requirement &rarr;</span>';
  }
}

async function loadClientTasks() {
  const container = document.getElementById('client-tasks-list');
  const countBadge = document.getElementById('client-order-count-badge');

  if (!state.user) {
    container.innerHTML = `
      <div class="client-card p-10 text-center">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3 text-xl">
          🔐
        </div>
        <h4 class="text-base font-bold text-white">Login to View Your Orders</h4>
        <p class="text-xs text-slate-400 mt-1 mb-5 max-w-sm mx-auto">Enter your email to receive an instant OTP code and track your requests live.</p>
        <button onclick="openAuthModal()" class="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md">
          Login with Email OTP
        </button>
      </div>
    `;
    if (countBadge) countBadge.innerText = '0';
    return;
  }

  try {
    const data = await api('/api/tasks/my-client-tasks');
    if (countBadge) countBadge.innerText = data.tasks.length;

    if (data.tasks.length === 0) {
      container.innerHTML = `
        <div class="client-card p-12 text-center">
          <div class="text-4xl mb-3">📁</div>
          <h4 class="text-lg font-bold text-white">No Active Orders Yet</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-5">
            Choose a service from our catalog (Frontend, Backend, Render Deploy, Domain, or Reels) to place your first order.
          </p>
          <button onclick="openNewTaskModal()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold shadow-md">
            + Place Your First Project Order
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = data.tasks.map(t => {
      const emailAdminLink = `mailto:bitnexatechnologies@gmail.com?subject=Bitnexa%20Inquiry%20-%20${encodeURIComponent(t.title)}`;

      return `
        <div class="client-card p-6 sm:p-7 space-y-5">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-xs font-mono font-bold text-sky-400">#${t.id}</span>
              ${getCategoryBadge(t.service_category)}
              ${getStatusBadge(t.status)}
            </div>
            
            <div class="text-right">
              <div class="text-2xl font-bold font-mono text-emerald-400">${formatINR(t.budget_inr)}</div>
              <div class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Approved Budget</div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-white">${t.title}</h3>
            <p class="text-sm text-slate-300 mt-2 leading-relaxed">${t.description}</p>
          </div>

          <div class="bg-surface-950 p-4 rounded-2xl border border-sky-500/15 space-y-2">
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Execution Milestone Progress:</span>
            ${renderMilestoneStepper(t.status)}
          </div>

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
              <span class="font-bold ${t.worker_name ? 'text-sky-300' : 'text-amber-400'}">
                ${t.worker_name ? `🛠️ ${t.worker_name}` : '🟡 In Review / Assigning'}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Requirement Link:</span>
              ${t.attachment_url ? `<a href="${t.attachment_url}" target="_blank" class="text-sky-400 hover:underline truncate block font-mono font-medium">Open Attachment &nearr;</a>` : '<span class="text-slate-500">None attached</span>'}
            </div>
          </div>

          ${(t.worker_notes || t.submission_link) ? `
            <div class="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/25 text-xs space-y-2.5">
              <div class="font-bold text-sky-300 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>Latest Deliverable &amp; Notes from Worker</span>
              </div>
              ${t.worker_notes ? `<p class="text-slate-200 text-sm leading-relaxed">${t.worker_notes}</p>` : ''}
              ${t.submission_link ? `
                <div class="pt-2 flex items-center gap-3">
                  <a href="${t.submission_link}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20">
                    <span>🚀 Open Live Work / Deliverable Link</span>
                    <span>&nearr;</span>
                  </a>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="text-[11px] text-slate-500 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
            <span>Submitted on ${new Date(t.created_at).toLocaleDateString()}</span>
            <div class="flex items-center gap-3">
              <a href="${emailAdminLink}" target="_blank" class="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold text-xs">
                <span>✉️ Email Support</span> &nearr;
              </a>
              <span class="font-mono text-slate-400">Last activity: ${new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-6 text-center text-rose-400 text-xs bg-rose-500/10 rounded-2xl border border-rose-500/20">${err.message}</div>`;
  }
}

function startPolling() {
  stopPolling();
  state.pollInterval = setInterval(() => {
    if (state.token && state.user) {
      loadClientTasks();
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

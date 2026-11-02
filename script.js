/**
 * ==============================================================================
 * AEIE CAREER NAVIGATOR (2026–2030) - FULL-STACK CLIENT ENGINE
 * Department of Applied Electronics & Instrumentation Engineering, UIT Burdwan
 *
 * Core Capabilities:
 * 1. REST API Integration with Express/MongoDB Backend & JWT Auth
 * 2. Hybrid Offline-First LocalStorage + Cloud Sync Engine
 * 3. Light / Dark Theme Toggle with Real-Time Chart.js Theme Adaptation
 * 4. Chart.js Semester Bar Chart & Engineering Skill Doughnut Chart
 * 5. Interactive 4-Year Timeline Navigation & Section ScrollSpy
 * 6. Semester Accordions with Expand/Collapse All
 * 7. Project Portfolio Filter (Embedded, IoT, Python, C)
 * 8. Learning Resources Directory with Search & Category Pills
 * 9. Personal Dashboard Drawer with Customized Milestones
 * 10. Print / PDF Export & Ephemeral Toast Notification System
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons immediately
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --------------------------------------------------------------------------
  // CONSTANTS & API CONFIGURATION
  // --------------------------------------------------------------------------
  const STORAGE_KEY_PROGRESS = 'aeie_career_blueprint_progress_2026_2030';
  const STORAGE_KEY_RESOURCES = 'aeie_completed_resources_2026_2030';
  const STORAGE_KEY_TOKEN = 'aeie_auth_token';
  const STORAGE_KEY_USER = 'aeie_auth_user';
  const STORAGE_KEY_THEME = 'aeie_theme';
  const STORAGE_KEY_GATE = 'aeie_gate_progress';
  const STORAGE_KEY_NOTES = 'aeie_personal_notes';

  // API Base URL (auto-detects origin, supports both npm start on port 5000 and static files)
  const API_BASE = window.location.protocol.startsWith('http')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

  // SVG Gauge circumference: 2 * Math.PI * 52 = ~326.726
  const GAUGE_CIRCUMFERENCE = 326.726;

  // State
  let userProgress = loadStoredProgress();
  let completedResources = loadStoredResources();
  let gateProgress = loadStoredGateProgress();
  let personalNotes = localStorage.getItem(STORAGE_KEY_NOTES) || '';
  let currentUser = loadStoredUser();
  let authToken = localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  let backendAvailable = false;
  let currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  let autoSaveTimer = null;

  // Chart instances
  let semesterChartInstance = null;
  let skillsChartInstance = null;

  // DOM Elements - Checkboxes
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"][data-task-id]');

  // DOM Elements - Hero & Nav Metrics
  const navProgressPercent = document.getElementById('nav-progress-percent');
  const heroProgressPercentage = document.getElementById('hero-progress-percentage');
  const heroProgressCount = document.getElementById('hero-progress-count');
  const heroProgressBar = document.getElementById('hero-progress-bar');
  const trackerSyncStatus = document.getElementById('tracker-sync-status');
  const dashPercentage = document.getElementById('dash-percentage');
  const trackerSvgFill = document.getElementById('tracker-svg-fill');

  // DOM Elements - Year Progress Breakdown
  const progressYear1 = document.getElementById('progress-year-1');
  const progressTextYear1 = document.getElementById('progress-text-year-1');
  const ypValY1 = document.getElementById('yp-val-y1');
  const ypFillY1 = document.getElementById('yp-fill-y1');

  const progressYear2 = document.getElementById('progress-year-2');
  const progressTextYear2 = document.getElementById('progress-text-year-2');
  const ypValY2 = document.getElementById('yp-val-y2');
  const ypFillY2 = document.getElementById('yp-fill-y2');

  const progressYear3 = document.getElementById('progress-year-3');
  const progressTextYear3 = document.getElementById('progress-text-year-3');
  const ypValY3 = document.getElementById('yp-val-y3');
  const ypFillY3 = document.getElementById('yp-fill-y3');

  const progressYear4 = document.getElementById('progress-year-4');
  const progressTextYear4 = document.getElementById('progress-text-year-4');
  const ypValY4 = document.getElementById('yp-val-y4');
  const ypFillY4 = document.getElementById('yp-fill-y4');

  const ypValProj = document.getElementById('yp-val-proj');
  const ypFillProj = document.getElementById('yp-fill-proj');

  // DOM Elements - Controls & Actions
  const themeToggleBtn = document.getElementById('theme-toggle');
  const btnResetProgress = document.getElementById('btn-reset-progress');
  const btnExportProgress = document.getElementById('btn-export-progress');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnDownloadPdfHero = document.getElementById('btn-download-pdf-hero');
  const btnExpandAll = document.getElementById('btn-expand-all');
  const btnCollapseAll = document.getElementById('btn-collapse-all');
  const roadmapSearch = document.getElementById('roadmap-search');
  const backToTopBtn = document.getElementById('back-to-top');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const toastContainer = document.getElementById('toast-container');

  // DOM Elements - Auth & Personal Dashboard
  const authContainer = document.getElementById('auth-container');
  const btnOpenAuth = document.getElementById('btn-open-auth');
  const authModal = document.getElementById('auth-modal');
  const btnCloseAuthModal = document.getElementById('btn-close-auth-modal');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const authModalTitle = document.getElementById('auth-modal-title');
  const personalDashboardSection = document.getElementById('personal-dashboard-section');
  const btnCloseDash = document.getElementById('btn-close-dash');
  const heroBtnProfile = document.getElementById('hero-btn-profile');
  const btnSyncCloud = document.getElementById('btn-sync-cloud');
  const btnSignOut = document.getElementById('btn-sign-out');

  // Personal Dashboard Fields
  const pdAvatarInitials = document.getElementById('pd-avatar-initials');
  const pdUserName = document.getElementById('pd-user-name');
  const pdUserEmail = document.getElementById('pd-user-email');
  const pdChipBatch = document.getElementById('pd-chip-batch');
  const pdChipSem = document.getElementById('pd-chip-sem');
  const pdChipGoal = document.getElementById('pd-chip-goal');
  const pdStatOverall = document.getElementById('pd-stat-overall');
  const pdStatCompletedTasks = document.getElementById('pd-stat-completed-tasks');
  const pdStatPendingTasks = document.getElementById('pd-stat-pending-tasks');
  const pdStatProjectsDone = document.getElementById('pd-stat-projects-done');

  // Resource Filter & Contact Form
  const resourceSearchInput = document.getElementById('resource-search-input');
  const resCategoryPills = document.getElementById('res-category-pills');
  const resourcesGrid = document.getElementById('resources-grid');
  const contactForm = document.getElementById('contact-form');

  // --------------------------------------------------------------------------
  // 1. THEME ENGINE (LIGHT / DARK)
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);

    // Refresh charts with theme-compliant colors
    if (semesterChartInstance && skillsChartInstance) {
      updateChartsTheme();
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      scheduleAutoSave();
      showToast(`Switched to ${nextTheme.toUpperCase()} theme`, 'info');
    });
  }
  applyTheme(currentTheme);

  // --------------------------------------------------------------------------
  // 2. STORAGE ENGINE (LOCAL PERSISTENCE)
  // --------------------------------------------------------------------------
  function loadStoredProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStoredProgress() {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function loadStoredResources() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESOURCES);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredResources() {
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(completedResources));
    } catch (e) {
      console.warn('Resource save failed:', e);
    }
  }

  function loadStoredGateProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GATE);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveStoredGateProgress() {
    try {
      localStorage.setItem(STORAGE_KEY_GATE, JSON.stringify(gateProgress));
    } catch (e) {
      console.warn('GATE storage save failed:', e);
    }
  }

  function loadStoredUser() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // 3. AUTO-SAVE & CLOUD PERSISTENCE ENGINE
  // --------------------------------------------------------------------------
  function updateSaveIndicator(status) {
    const indicator = document.getElementById('save-status-indicator');
    const label = document.getElementById('save-status-label');
    const icon = document.getElementById('save-status-icon');
    if (!indicator || !label) return;

    indicator.classList.remove('saved', 'saving', 'error');

    if (status === 'saving') {
      indicator.classList.add('saving');
      indicator.setAttribute('title', 'Saving changes to cloud...');
      label.textContent = 'Saving...';
      if (icon) {
        icon.setAttribute('data-lucide', 'refresh-cw');
      }
    } else if (status === 'saved') {
      indicator.classList.add('saved');
      indicator.setAttribute('title', authToken ? 'All changes saved to cloud database' : 'Saved locally in browser cache');
      label.textContent = authToken ? 'Saved ✓' : 'Saved (Local)';
      if (icon) {
        icon.setAttribute('data-lucide', 'check');
      }
    } else if (status === 'error') {
      indicator.classList.add('error');
      indicator.setAttribute('title', 'Unable to reach cloud server. Saved locally in browser.');
      label.textContent = 'Unable to save';
      if (icon) {
        icon.setAttribute('data-lucide', 'alert-triangle');
      }
    }

    if (window.lucide) {
      window.lucide.createIcons({ root: indicator });
    }
  }

  function scheduleAutoSave() {
    updateSaveIndicator('saving');
    const notesBadge = document.getElementById('notes-status-badge');
    if (notesBadge) notesBadge.textContent = 'Saving changes...';

    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      await performCloudSync();
    }, 700);
  }

  async function performCloudSync() {
    // 1. Always persist to localStorage first
    saveStoredProgress();
    saveStoredResources();
    saveStoredGateProgress();
    localStorage.setItem(STORAGE_KEY_NOTES, personalNotes);
    localStorage.setItem(STORAGE_KEY_THEME, currentTheme);

    // 2. If user is authenticated, sync with MongoDB backend
    if (authToken) {
      try {
        const completedSubjects = Object.keys(userProgress).filter((k) => !k.startsWith('proj-'));
        const completedProjects = Object.keys(userProgress).filter((k) => k.startsWith('proj-'));

        await apiRequest('/progress/sync', 'PUT', {
          completedSubjects,
          completedProjects,
          completedResources,
          gateProgress,
          personalNotes,
          themePreference: currentTheme,
        });

        updateSaveIndicator('saved');
        const notesBadge = document.getElementById('notes-status-badge');
        if (notesBadge) {
          notesBadge.innerHTML = '<i data-lucide="check-circle" class="mini-icon"></i> Cloud synced';
          if (window.lucide) window.lucide.createIcons({ root: notesBadge });
        }
      } catch (err) {
        console.warn('Auto cloud sync failed, stored in browser:', err.message);
        updateSaveIndicator('error');
        const notesBadge = document.getElementById('notes-status-badge');
        if (notesBadge) notesBadge.textContent = 'Saved in browser (offline)';
      }
    } else {
      updateSaveIndicator('saved');
      const notesBadge = document.getElementById('notes-status-badge');
      if (notesBadge) notesBadge.textContent = 'Saved in browser';
    }
  }

  // Restore authenticated user's state from cloud database
  async function fetchAndRestoreCloudState() {
    if (!authToken) return;
    try {
      updateSaveIndicator('saving');
      const res = await apiRequest('/progress', 'GET');
      if (res && res.data) {
        const d = res.data;

        // Restore subjects & projects
        userProgress = {};
        if (Array.isArray(d.completedSubjects)) {
          d.completedSubjects.forEach((s) => { userProgress[s] = true; });
        }
        if (Array.isArray(d.completedProjects)) {
          d.completedProjects.forEach((p) => { userProgress[p] = true; });
        }
        saveStoredProgress();

        // Restore learning resources
        if (Array.isArray(d.completedResources)) {
          completedResources = d.completedResources;
          saveStoredResources();
        }

        // Restore GATE checklist
        if (Array.isArray(d.gateProgress)) {
          gateProgress = d.gateProgress;
          saveStoredGateProgress();
          applyGateProgressToUI();
        }

        // Restore personal notes
        if (typeof d.personalNotes === 'string') {
          personalNotes = d.personalNotes;
          localStorage.setItem(STORAGE_KEY_NOTES, personalNotes);
          const pdNotes = document.getElementById('pd-personal-notes');
          if (pdNotes) pdNotes.value = personalNotes;
          const charSpan = document.getElementById('notes-char-count');
          if (charSpan) charSpan.textContent = personalNotes.length;
        }

        // Restore theme preference
        if (d.themePreference && (d.themePreference === 'light' || d.themePreference === 'dark')) {
          currentTheme = d.themePreference;
          applyTheme(currentTheme);
        }

        applyProgressToUI();
        updateSaveIndicator('saved');
        updateSyncStatusText();
      }
    } catch (err) {
      console.warn('Could not restore cloud state:', err.message);
      updateSaveIndicator('error');
    }
  }

  // --------------------------------------------------------------------------
  // 3. REST API BACKEND CLIENT
  // --------------------------------------------------------------------------
  async function checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      if (res.ok) {
        backendAvailable = true;
        updateSyncStatusText();
      }
    } catch (err) {
      backendAvailable = false;
      updateSyncStatusText();
    }
  }

  function updateSyncStatusText() {
    if (!trackerSyncStatus) return;
    if (authToken && currentUser) {
      trackerSyncStatus.textContent = `Status: Cloud Connected (${currentUser.name}) • Changes synced in real time.`;
      trackerSyncStatus.style.color = 'var(--emerald-accent)';
    } else if (backendAvailable) {
      trackerSyncStatus.textContent = 'Status: Guest Mode (Saved Locally). Sign in to sync with cloud backend.';
      trackerSyncStatus.style.color = 'var(--text-muted)';
    } else {
      trackerSyncStatus.textContent = 'Status: Offline Mode (Saved Locally to Browser).';
      trackerSyncStatus.style.color = 'var(--text-muted)';
    }
  }

  async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request error');
    }
    return data;
  }

  // --------------------------------------------------------------------------
  // 4. PROGRESS CALCULATION & CHART.JS INTEGRATION
  // --------------------------------------------------------------------------
  function calculateMetrics() {
    const totalItems = allCheckboxes.length || 44;
    let totalChecked = 0;

    const yearCounts = {
      'year-1': { total: 0, checked: 0 },
      'year-2': { total: 0, checked: 0 },
      'year-3': { total: 0, checked: 0 },
      'year-4': { total: 0, checked: 0 },
    };

    // Semester 1 to 8 counts
    const semCounts = {};
    for (let i = 1; i <= 8; i++) {
      semCounts[i] = { total: 0, checked: 0 };
    }

    let totalProjects = 0;
    let checkedProjects = 0;

    allCheckboxes.forEach((cb) => {
      const year = cb.getAttribute('data-year');
      const isProj = cb.id && cb.id.startsWith('proj-');
      const semCard = cb.closest('.semester-card');

      if (semCard && semCard.id) {
        const semNum = Number(semCard.id.replace('sem-card-', ''));
        if (semCounts[semNum]) {
          semCounts[semNum].total++;
          if (cb.checked) semCounts[semNum].checked++;
        }
      }

      if (year && yearCounts[year]) {
        yearCounts[year].total++;
        if (cb.checked) yearCounts[year].checked++;
      }

      if (isProj) {
        totalProjects++;
        if (cb.checked) checkedProjects++;
      }

      if (cb.checked) totalChecked++;
    });

    const overallPercent = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

    return {
      totalItems,
      totalChecked,
      overallPercent,
      yearCounts,
      semCounts,
      totalProjects,
      checkedProjects,
    };
  }

  function applyProgressToUI() {
    // 1. Update Checkboxes & Parent visuals
    allCheckboxes.forEach((cb) => {
      const taskId = cb.getAttribute('data-task-id');
      const isChecked = !!userProgress[taskId];
      cb.checked = isChecked;
      updateCheckboxVisual(cb, isChecked);
    });

    // 2. Metrics Calculation
    const m = calculateMetrics();

    // 3. Nav & Hero updates
    if (navProgressPercent) navProgressPercent.textContent = `${m.overallPercent}%`;
    if (heroProgressPercentage) heroProgressPercentage.textContent = `${m.overallPercent}%`;
    if (heroProgressCount) heroProgressCount.textContent = `${m.totalChecked} / ${m.totalItems} Completed`;
    if (heroProgressBar) heroProgressBar.style.width = `${m.overallPercent}%`;

    // 4. Radial Gauge
    if (dashPercentage) dashPercentage.textContent = `${m.overallPercent}%`;
    if (trackerSvgFill) {
      const offset = GAUGE_CIRCUMFERENCE - (m.overallPercent / 100) * GAUGE_CIRCUMFERENCE;
      trackerSvgFill.style.strokeDashoffset = offset;
    }

    // 5. Year Progress Bars
    updateYearUI(m.yearCounts['year-1'], progressYear1, progressTextYear1, ypValY1, ypFillY1);
    updateYearUI(m.yearCounts['year-2'], progressYear2, progressTextYear2, ypValY2, ypFillY2);
    updateYearUI(m.yearCounts['year-3'], progressYear3, progressTextYear3, ypValY3, ypFillY3);
    updateYearUI(m.yearCounts['year-4'], progressYear4, progressTextYear4, ypValY4, ypFillY4);

    // 6. Projects Breakdown
    if (ypValProj && ypFillProj) {
      const projPct = m.totalProjects > 0 ? Math.round((m.checkedProjects / m.totalProjects) * 100) : 0;
      ypValProj.textContent = `${m.checkedProjects} / ${m.totalProjects} projects (${projPct}%)`;
      ypFillProj.style.width = `${projPct}%`;
    }

    // 7. Personal Dashboard Stats
    if (pdStatOverall) pdStatOverall.textContent = `${m.overallPercent}%`;
    if (pdStatCompletedTasks) pdStatCompletedTasks.textContent = m.totalChecked;
    if (pdStatPendingTasks) pdStatPendingTasks.textContent = m.totalItems - m.totalChecked;
    if (pdStatProjectsDone) pdStatProjectsDone.textContent = `${m.checkedProjects} / ${m.totalProjects}`;

    // 8. Update Chart.js
    updateCharts(m);
  }

  function updateYearUI(counts, yearBar, yearText, ypVal, ypFill) {
    if (!counts) return;
    const pct = counts.total > 0 ? Math.round((counts.checked / counts.total) * 100) : 0;
    if (yearBar) yearBar.style.width = `${pct}%`;
    if (yearText) yearText.textContent = `${pct}%`;
    if (ypVal) ypVal.textContent = `${counts.checked} / ${counts.total} items (${pct}%)`;
    if (ypFill) ypFill.style.width = `${pct}%`;
  }

  function updateCheckboxVisual(cb, isChecked) {
    const checklistItem = cb.closest('.checklist-item');
    if (checklistItem) {
      if (isChecked) checklistItem.classList.add('item-completed');
      else checklistItem.classList.remove('item-completed');
    }

    const projectCard = cb.closest('.project-card');
    if (projectCard) {
      const label = projectCard.querySelector('.project-status-label');
      if (isChecked) {
        projectCard.classList.add('project-completed');
        if (label) label.textContent = 'Completed ✓';
      } else {
        projectCard.classList.remove('project-completed');
        if (label) label.textContent = 'Mark Completed';
      }
    }
  }

  // Handle checkbox changes
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', async (e) => {
      const taskId = e.target.getAttribute('data-task-id');
      const isChecked = e.target.checked;

      if (isChecked) {
        userProgress[taskId] = true;
        showToast('Milestone marked as complete!', 'success');
      } else {
        delete userProgress[taskId];
        showToast('Milestone status updated.', 'info');
      }

      saveStoredProgress();
      updateCheckboxVisual(e.target, isChecked);
      applyProgressToUI();
      scheduleAutoSave();
    });
  });

  // --------------------------------------------------------------------------
  // 5. CHART.JS INITIALIZATION & REAL-TIME UPDATES
  // --------------------------------------------------------------------------
  function initCharts() {
    const semCtx = document.getElementById('semesterChart');
    const skillsCtx = document.getElementById('skillsChart');

    if (semCtx && typeof Chart !== 'undefined') {
      const isDark = currentTheme === 'dark';
      const textColor = isDark ? '#94a3b8' : '#475569';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';

      semesterChartInstance = new Chart(semCtx, {
        type: 'bar',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
          datasets: [
            {
              label: 'Completion %',
              data: [0, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(0, 210, 255, 0.65)',
              borderColor: '#00d2ff',
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `Completed: ${ctx.parsed.y}%`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: { color: textColor, callback: (v) => v + '%' },
              grid: { color: gridColor },
            },
            x: {
              ticks: { color: textColor },
              grid: { display: false },
            },
          },
        },
      });
    }

    if (skillsCtx && typeof Chart !== 'undefined') {
      skillsChartInstance = new Chart(skillsCtx, {
        type: 'doughnut',
        data: {
          labels: [
            'AEIE Core & Transducers',
            'Embedded & Microcontrollers',
            'Programming & Python',
            'Math & Control Theory',
          ],
          datasets: [
            {
              data: [14, 10, 12, 8],
              backgroundColor: [
                '#00d2ff',
                '#8b5cf6',
                '#10b981',
                '#f59e0b',
              ],
              borderColor: currentTheme === 'dark' ? '#111a2e' : '#ffffff',
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: currentTheme === 'dark' ? '#94a3b8' : '#475569',
                font: { size: 11 },
                boxWidth: 12,
              },
            },
          },
          cutout: '70%',
        },
      });
    }
  }

  function updateCharts(m) {
    if (!semesterChartInstance) return;

    const semData = [];
    for (let i = 1; i <= 8; i++) {
      const s = m.semCounts[i];
      const pct = s && s.total > 0 ? Math.round((s.checked / s.total) * 100) : 0;
      semData.push(pct);
    }

    semesterChartInstance.data.datasets[0].data = semData;
    semesterChartInstance.update();
  }

  function updateChartsTheme() {
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';

    if (semesterChartInstance) {
      semesterChartInstance.options.scales.x.ticks.color = textColor;
      semesterChartInstance.options.scales.y.ticks.color = textColor;
      semesterChartInstance.options.scales.y.grid.color = gridColor;
      semesterChartInstance.update();
    }

    if (skillsChartInstance) {
      skillsChartInstance.options.plugins.legend.labels.color = textColor;
      skillsChartInstance.data.datasets[0].borderColor = isDark ? '#111a2e' : '#ffffff';
      skillsChartInstance.update();
    }
  }

  // --------------------------------------------------------------------------
  // 6. AUTHENTICATION & USER PROFILE MODAL
  // --------------------------------------------------------------------------
  function updateAuthUI() {
    if (!authContainer) return;

    if (authToken && currentUser) {
      authContainer.innerHTML = `
        <button class="btn btn-primary btn-outline-sm" id="btn-user-profile-toggle">
          <i data-lucide="user-check" class="btn-icon-sm"></i>
          <span>${currentUser.name.split(' ')[0]}</span>
        </button>
      `;

      if (pdAvatarInitials) {
        const initials = currentUser.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        pdAvatarInitials.textContent = initials || 'AE';
      }
      if (pdUserName) pdUserName.textContent = currentUser.name;
      if (pdUserEmail) pdUserEmail.textContent = currentUser.email;
      if (pdChipBatch) pdChipBatch.textContent = currentUser.batch || 'Batch 2026–2030';
      if (pdChipSem) pdChipSem.textContent = `Semester ${currentUser.currentSemester || 1}`;
      if (pdChipGoal) pdChipGoal.textContent = currentUser.careerGoal || 'Core Electronics';

      const btnProfile = document.getElementById('btn-user-profile-toggle');
      if (btnProfile) {
        btnProfile.addEventListener('click', () => {
          togglePersonalDashboard();
        });
      }
    } else {
      authContainer.innerHTML = `
        <button class="btn btn-outline-sm btn-auth" id="btn-open-auth">
          <i data-lucide="user" class="btn-icon-sm"></i>
          <span>Sign In</span>
        </button>
      `;
      const btnOpen = document.getElementById('btn-open-auth');
      if (btnOpen) {
        btnOpen.addEventListener('click', openAuthModal);
      }
    }

    updateSyncStatusText();
    if (window.lucide) window.lucide.createIcons({ root: authContainer });
  }

  function openAuthModal() {
    if (authModal) {
      authModal.classList.add('active');
      authModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeAuthModal() {
    if (authModal) {
      authModal.classList.remove('active');
      authModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (btnCloseAuthModal) btnCloseAuthModal.addEventListener('click', closeAuthModal);
  if (btnOpenAuth) btnOpenAuth.addEventListener('click', openAuthModal);

  // Close modal when clicking on backdrop or pressing Escape
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal.classList.contains('active')) {
        closeAuthModal();
      }
    });
  }

  // Tab switching between Sign In & Register
  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      formLogin.style.display = 'flex';
      formRegister.style.display = 'none';
      if (authModalTitle) authModalTitle.textContent = 'Sign In to Account';
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      formRegister.style.display = 'flex';
      formLogin.style.display = 'none';
      if (authModalTitle) authModalTitle.textContent = 'Create Student Account';
    });
  }

  // Form Submit: Login
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));

        closeAuthModal();
        updateAuthUI();
        showToast(`Welcome back, ${currentUser.name}!`, 'success');

        // Restore cloud state for this authenticated user
        await fetchAndRestoreCloudState();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    });
  }

  // Form Submit: Register
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const currentSemester = Number(document.getElementById('reg-sem').value);
      const careerGoal = document.getElementById('reg-goal').value;

      try {
        const data = await apiRequest('/auth/register', 'POST', {
          name,
          email,
          password,
          college: 'UIT Burdwan',
          department: 'AEIE',
          currentSemester,
          careerGoal,
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));

        closeAuthModal();
        updateAuthUI();
        showToast('Registration successful! Welcome to AEIE Navigator.', 'success');

        // Persist existing guest progress into the newly created account
        await performCloudSync();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    });
  }

  // Manual Cloud Sync Handler
  if (btnSyncCloud) {
    btnSyncCloud.addEventListener('click', async () => {
      showToast('Syncing with cloud database...', 'info');
      await performCloudSync();
      showToast('Roadmap progress synchronized with cloud.', 'success');
    });
  }

  // Sign Out Handler
  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      authToken = null;
      currentUser = null;
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      updateAuthUI();
      updateSaveIndicator('saved');
      if (personalDashboardSection) personalDashboardSection.style.display = 'none';
      showToast('Signed out successfully. Guest mode active.', 'info');
    });
  }

  function togglePersonalDashboard() {
    if (!personalDashboardSection) return;
    const isVisible = personalDashboardSection.style.display === 'block';
    personalDashboardSection.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      personalDashboardSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (btnCloseDash) {
    btnCloseDash.addEventListener('click', () => {
      if (personalDashboardSection) personalDashboardSection.style.display = 'none';
    });
  }
  if (heroBtnProfile) {
    heroBtnProfile.addEventListener('click', () => {
      if (currentUser) {
        togglePersonalDashboard();
      } else {
        openAuthModal();
      }
    });
  }

  // Student Profile Settings Panel Handlers
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const pdSettingsPanel = document.getElementById('pd-settings-panel');
  const btnCancelSettings = document.getElementById('btn-cancel-settings');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const pdSettingSem = document.getElementById('pd-setting-sem');
  const pdSettingGoal = document.getElementById('pd-setting-goal');
  const pdSettingCgpa = document.getElementById('pd-setting-cgpa');

  if (btnOpenSettings && pdSettingsPanel) {
    btnOpenSettings.addEventListener('click', () => {
      const isVisible = pdSettingsPanel.style.display === 'block';
      pdSettingsPanel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && currentUser) {
        if (pdSettingSem) pdSettingSem.value = currentUser.currentSemester || 1;
        if (pdSettingGoal) pdSettingGoal.value = currentUser.careerGoal || 'Core Electronics & Embedded';
        if (pdSettingCgpa) pdSettingCgpa.value = currentUser.targetCGPA || 8.5;
      }
    });
  }

  if (btnCancelSettings && pdSettingsPanel) {
    btnCancelSettings.addEventListener('click', () => {
      pdSettingsPanel.style.display = 'none';
    });
  }

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', async () => {
      if (!authToken) {
        showToast('Please sign in to save settings.', 'warning');
        return;
      }

      const currentSemester = Number(pdSettingSem ? pdSettingSem.value : 1);
      const careerGoal = pdSettingGoal ? pdSettingGoal.value : 'Core Electronics & Embedded';
      const targetCGPA = Number(pdSettingCgpa ? pdSettingCgpa.value : 8.5);

      btnSaveSettings.disabled = true;
      btnSaveSettings.innerHTML = '<i data-lucide="refresh-cw" class="btn-icon-sm"></i> Saving...';
      if (window.lucide) window.lucide.createIcons({ root: btnSaveSettings });

      try {
        const updateRes = await apiRequest('/auth/profile', 'PUT', {
          currentSemester,
          careerGoal,
        });

        if (updateRes && updateRes.user) {
          currentUser = { ...currentUser, ...updateRes.user, targetCGPA };
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
          updateAuthUI();
        }

        await apiRequest('/progress/sync', 'PUT', {
          dashboardPreferences: { targetCGPA },
        });

        if (pdSettingsPanel) pdSettingsPanel.style.display = 'none';
        showToast('Profile & target settings saved to cloud!', 'success');
      } catch (err) {
        showToast(err.message || 'Failed to update settings.', 'warning');
      } finally {
        btnSaveSettings.disabled = false;
        btnSaveSettings.innerHTML = '<i data-lucide="check"></i> Save Settings';
        if (window.lucide) window.lucide.createIcons({ root: btnSaveSettings });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. PROJECT PORTFOLIO SHOWCASE & CATEGORY FILTERS
  // --------------------------------------------------------------------------
  const portfolioGrid = document.getElementById('portfolio-grid');
  const projectFilterButtons = document.querySelectorAll('#project-filters .filter-btn');

  const portfolioProjectsData = [
    {
      id: 'proj-y1-1',
      title: 'Student Management System using C',
      category: 'C Language',
      desc: 'Command-line student records database using C. Implements file handling, memory management, roll number lookups, and GPA calculation.',
      tech: ['C Programming', 'File I/O', 'Structs', 'Makefile', 'Git'],
      deliverables: 'Modular .c/.h code, Makefile, and sample data persistence.',
      year: 'Year 1 • Sem 1',
    },
    {
      id: 'proj-y1-2',
      title: 'Python Sensor Data Logger',
      category: 'Python',
      desc: 'Automated telemetry script reading USB/UART serial data, writing timestamped CSV records, and plotting live time-series charts via Matplotlib.',
      tech: ['Python 3', 'PySerial', 'CSV', 'Matplotlib', 'Automation'],
      deliverables: 'Real-time serial logger with outlier alert thresholds.',
      year: 'Year 1 • Sem 2',
    },
    {
      id: 'proj-y2-1',
      title: 'Temperature Monitoring & Alert Station',
      category: 'Embedded',
      desc: 'Microcontroller station interfaced with LM35 / DS18B20 digital sensors, I2C 16x2 LCD, threshold alarms, and continuous calibration.',
      tech: ['Arduino / AVR', 'ADC', 'I2C LCD', 'Timers', 'Calibration'],
      deliverables: 'Schematic, firmware in C++, and error benchmark report.',
      year: 'Year 2 • Sem 3',
    },
    {
      id: 'proj-y2-2',
      title: 'Virtual Instrumentation Dashboard',
      category: 'Python',
      desc: 'PC-based virtual instrument desktop dashboard with real-time dial gauges, strip charts, min/max metrics, and data export built with PyQt / Streamlit.',
      tech: ['PyQt / Tkinter', 'Serial Protocol', 'NumPy', 'Pandas', 'HMI'],
      deliverables: 'Responsive GUI with live multi-channel graphs and emergency stops.',
      year: 'Year 2 • Sem 4',
    },
    {
      id: 'proj-y3-1',
      title: 'Industrial IoT Condition Monitoring System',
      category: 'IoT',
      desc: 'Predictive maintenance edge node using ESP32. Transmits motor vibration, temperature, and current consumption via MQTT to a cloud dashboard.',
      tech: ['ESP32', 'FreeRTOS', 'MQTT Protocol', 'Node-RED', 'Cloud'],
      deliverables: 'MQTT telemetry pipeline, TLS security, and email anomaly triggers.',
      year: 'Year 3 • Sem 5',
    },
    {
      id: 'proj-y3-2',
      title: 'Closed-Loop DC Motor Speed Controller (PID)',
      category: 'Embedded',
      desc: 'Discrete PID algorithm implemented in bare-metal C to regulate motor RPM under load fluctuations using optical encoder feedback and H-Bridge PWM.',
      tech: ['Embedded C', 'Digital PID', 'Optical Encoder', 'PWM', 'Simulink'],
      deliverables: 'Simulink math model, translated C code, settling time < 500ms.',
      year: 'Year 3 • Sem 6',
    },
  ];

  function renderPortfolioProjects(filter = 'all') {
    if (!portfolioGrid) return;
    portfolioGrid.innerHTML = '';

    const filtered = portfolioProjectsData.filter((p) => {
      if (filter === 'all') return true;
      return p.category.toLowerCase().includes(filter.toLowerCase());
    });

    filtered.forEach((p) => {
      const isDone = !!userProgress[p.id];
      const card = document.createElement('div');
      card.className = `card project-card ${isDone ? 'project-completed' : ''}`;
      card.innerHTML = `
        <div class="project-header">
          <div class="project-tag-wrap">
            <span class="project-type-badge">${p.year}</span>
            <label class="custom-checkbox project-checkbox-wrap">
              <input type="checkbox" data-task-id="${p.id}" data-year="year-${p.year[5]}" ${isDone ? 'checked' : ''}>
              <span class="checkbox-box"><i data-lucide="check"></i></span>
              <span class="project-status-label">${isDone ? 'Completed ✓' : 'Mark Completed'}</span>
            </label>
          </div>
          <h5 class="project-name">${p.title}</h5>
        </div>
        <p class="project-description">${p.desc}</p>
        <div class="project-skills">
          ${p.tech.map((t) => `<span class="skill-chip">${t}</span>`).join('')}
        </div>
        <div class="project-deliverables">
          <strong>Deliverable:</strong> ${p.deliverables}
        </div>
      `;

      // Attach checkbox listener to synchronize with global progress
      const cb = card.querySelector('input[type="checkbox"]');
      cb.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        if (isChecked) userProgress[p.id] = true;
        else delete userProgress[p.id];
        saveStoredProgress();
        applyProgressToUI();
        renderPortfolioProjects(filter);
        scheduleAutoSave();
      });

      portfolioGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons({ root: portfolioGrid });
  }

  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolioProjects(btn.getAttribute('data-filter'));
    });
  });

  renderPortfolioProjects('all');

  // --------------------------------------------------------------------------
  // 8. FREE LEARNING RESOURCES DIRECTORY (SEARCH & FILTER)
  // --------------------------------------------------------------------------
  const initialResources = [
    {
      title: 'NPTEL (SWAYAM) - Control & Transducers',
      url: 'https://nptel.ac.in/',
      provider: 'NPTEL',
      category: 'Simulation & Math',
      badge: 'IIT / IISc Video Lectures',
      desc: 'In-depth video lectures from premier IIT professors covering Control Systems, Transducers, Signals, and Process Automation.',
    },
    {
      title: 'Harvard CS50x - Computer Science',
      url: 'https://cs50.harvard.edu/x/',
      provider: 'Harvard CS50',
      category: 'Computer Science',
      badge: 'Self-Paced Course',
      desc: 'The world’s gold standard introductory computer science course teaching C programming, memory, data structures, and algorithms.',
    },
    {
      title: 'freeCodeCamp - Python & Algorithms',
      url: 'https://www.freecodecamp.org/learn/',
      provider: 'freeCodeCamp',
      category: 'Python & Data Science',
      badge: '100% Free Certifications',
      desc: 'Interactive, project-driven learning tracks covering Python, Scientific Computing, Algorithms, and Responsive Web Design.',
    },
    {
      title: 'Wokwi Simulator - Embedded Systems',
      url: 'https://wokwi.com/',
      provider: 'Wokwi',
      category: 'Hardware Simulator',
      badge: 'In-Browser Simulator',
      desc: 'Simulate Arduino Uno/Mega, ESP32, and Raspberry Pi Pico in your web browser with virtual LCDs, sensors, and relays.',
    },
    {
      title: 'Kaggle Learn - Python, NumPy & Pandas',
      url: 'https://www.kaggle.com/learn',
      provider: 'Kaggle Learn',
      category: 'Python & Data Science',
      badge: 'Hands-On Notebooks',
      desc: 'Bite-sized micro-courses to master practical Python dataframes, vectorized computations in NumPy, and data cleansing.',
    },
    {
      title: 'GitHub Skills - Git & DevOps Workflows',
      url: 'https://skills.github.com/',
      provider: 'GitHub Skills',
      category: 'DevOps & Version Control',
      badge: 'Interactive Repos',
      desc: 'Interactive bot-driven tutorials teaching pull requests, merge conflict resolution, GitHub Pages deployment, and Markdown.',
    },
    {
      title: 'Python Official Language Tutorial',
      url: 'https://docs.python.org/3/tutorial/',
      provider: 'Python Docs',
      category: 'Official Documentation',
      badge: 'Authoritative Reference',
      desc: 'The official Python documentation covering syntax, standard libraries, modules, exception handling, and OOP.',
    },
    {
      title: 'Arduino Official Documentation',
      url: 'https://docs.arduino.cc/',
      provider: 'Arduino Docs',
      category: 'Hardware Simulator',
      badge: 'Hardware Guides',
      desc: 'Official schematics, reference APIs, and circuit tutorials for sensors, actuators, serial UART, and PWM controls.',
    },
    {
      title: 'MATLAB Academy Onramp Courses',
      url: 'https://matlabacademy.mathworks.com/',
      provider: 'MATLAB Academy',
      category: 'Simulation & Math',
      badge: 'Free Interactive Onramp',
      desc: 'Free self-paced interactive tutorials by MathWorks covering MATLAB basics and Simulink modeling for feedback control loops.',
    },
  ];

  function renderResourcesGrid(searchQuery = '', categoryFilter = 'All') {
    if (!resourcesGrid) return;
    resourcesGrid.innerHTML = '';

    const filtered = initialResources.filter((r) => {
      let matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
      let matchesSearch =
        searchQuery === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      resourcesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          No learning resources found matching your search. Try adjusting your query or filter.
        </div>
      `;
      return;
    }

    filtered.forEach((r) => {
      const isCompleted = completedResources.includes(r.title);
      const card = document.createElement('div');
      card.className = 'resource-card card';
      card.innerHTML = `
        <div>
          <div class="resource-header">
            <div class="resource-icon-box">
              <i data-lucide="book-open"></i>
            </div>
            <span class="resource-category-tag">${r.category}</span>
          </div>
          <h3 class="resource-name">${r.title}</h3>
          <p class="resource-description">${r.desc}</p>
        </div>
        <div class="resource-footer">
          <span class="resource-badge">${r.badge}</span>
          <div class="resource-actions-wrap">
            <button class="btn-toggle-resource ${isCompleted ? 'completed' : ''}" data-title="${r.title}">
              <i data-lucide="${isCompleted ? 'check-circle-2' : 'circle'}"></i>
              <span>${isCompleted ? 'Done' : 'Mark Done'}</span>
            </button>
            <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
              <span>Access</span>
              <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </div>
      `;

      const btnToggle = card.querySelector('.btn-toggle-resource');
      btnToggle.addEventListener('click', () => {
        const idx = completedResources.indexOf(r.title);
        if (idx > -1) {
          completedResources.splice(idx, 1);
          showToast(`Unmarked ${r.title}`, 'info');
        } else {
          completedResources.push(r.title);
          showToast(`Marked ${r.title} as completed!`, 'success');
        }
        saveStoredResources();
        renderResourcesGrid(searchQuery, categoryFilter);
        scheduleAutoSave();
      });

      resourcesGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons({ root: resourcesGrid });
  }

  const btnClearResourceSearch = document.getElementById('btn-clear-resource-search');
  if (resourceSearchInput) {
    resourceSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (btnClearResourceSearch) {
        btnClearResourceSearch.style.display = q ? 'flex' : 'none';
      }
      const activeCat = document.querySelector('#res-category-pills .cat-pill.active');
      const cat = activeCat ? activeCat.getAttribute('data-cat') : 'All';
      renderResourcesGrid(q, cat);
    });

    if (btnClearResourceSearch) {
      btnClearResourceSearch.addEventListener('click', () => {
        resourceSearchInput.value = '';
        btnClearResourceSearch.style.display = 'none';
        const activeCat = document.querySelector('#res-category-pills .cat-pill.active');
        const cat = activeCat ? activeCat.getAttribute('data-cat') : 'All';
        renderResourcesGrid('', cat);
        resourceSearchInput.focus();
      });
    }
  }

  if (resCategoryPills) {
    const pills = resCategoryPills.querySelectorAll('.cat-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const q = resourceSearchInput ? resourceSearchInput.value.trim() : '';
        renderResourcesGrid(q, pill.getAttribute('data-cat'));
      });
    });
  }

  renderResourcesGrid('', 'All');

  // --------------------------------------------------------------------------
  // 9. GATE CHECKLIST & PERSONAL STUDY NOTES ENGINE
  // --------------------------------------------------------------------------
  const gateCheckboxes = document.querySelectorAll('.gate-checkbox');
  const gateCounter = document.getElementById('gate-checklist-counter');

  function applyGateProgressToUI() {
    let checkedCount = 0;
    gateCheckboxes.forEach((cb) => {
      const gid = cb.getAttribute('data-gate-id');
      const isChecked = gateProgress.includes(gid);
      cb.checked = isChecked;
      const parentLabel = cb.closest('.gate-check-label');
      if (parentLabel) {
        if (isChecked) parentLabel.classList.add('is-checked');
        else parentLabel.classList.remove('is-checked');
      }
      if (isChecked) checkedCount++;
    });
    if (gateCounter) {
      gateCounter.textContent = `${checkedCount} / ${gateCheckboxes.length || 6} Milestones Completed`;
    }
  }

  gateCheckboxes.forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const gid = e.target.getAttribute('data-gate-id');
      const isChecked = e.target.checked;
      const parentLabel = e.target.closest('.gate-check-label');
      if (parentLabel) {
        if (isChecked) parentLabel.classList.add('is-checked');
        else parentLabel.classList.remove('is-checked');
      }
      if (isChecked) {
        if (!gateProgress.includes(gid)) gateProgress.push(gid);
        showToast('GATE milestone marked complete!', 'success');
      } else {
        gateProgress = gateProgress.filter((id) => id !== gid);
        showToast('GATE milestone status updated.', 'info');
      }
      applyGateProgressToUI();
      scheduleAutoSave();
    });
  });

  // Personal Study Notes Widget
  const pdNotesTextarea = document.getElementById('pd-personal-notes');
  const notesCharCount = document.getElementById('notes-char-count');
  const btnSaveNotes = document.getElementById('btn-save-notes');
  const notesStatusBadge = document.getElementById('notes-status-badge');

  if (pdNotesTextarea) {
    pdNotesTextarea.value = personalNotes;
    if (notesCharCount) notesCharCount.textContent = personalNotes.length;

    pdNotesTextarea.addEventListener('input', (e) => {
      personalNotes = e.target.value;
      if (notesCharCount) notesCharCount.textContent = personalNotes.length;
      if (notesStatusBadge) notesStatusBadge.textContent = 'Editing notes...';
      scheduleAutoSave();
    });
  }

  if (btnSaveNotes) {
    btnSaveNotes.addEventListener('click', async () => {
      if (notesStatusBadge) notesStatusBadge.textContent = 'Saving...';
      await performCloudSync();
      showToast('Personal study notes saved successfully!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 10. PROFESSIONAL CONTACT US & FEEDBACK ENGINE
  // --------------------------------------------------------------------------
  const feedbackForm = document.getElementById('contact-feedback-form');
  const fbName = document.getElementById('fb-name');
  const fbEmail = document.getElementById('fb-email');
  const fbSubject = document.getElementById('fb-subject');
  const fbCategory = document.getElementById('fb-category');
  const fbMessage = document.getElementById('fb-message');
  const fbCharCount = document.getElementById('fb-char-count');
  const fbSubmitBtn = document.getElementById('fb-submit-btn');
  const fbBtnLabel = document.getElementById('fb-btn-label');
  const fbResponseAlert = document.getElementById('fb-response-alert');

  if (fbMessage && fbCharCount) {
    fbMessage.addEventListener('input', () => {
      fbCharCount.textContent = fbMessage.value.length;
    });
  }

  function showFeedbackAlert(msg, type) {
    if (!fbResponseAlert) return;
    fbResponseAlert.className = `feedback-alert ${type}`;
    fbResponseAlert.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-circle'}"></i>
      <span>${msg}</span>
    `;
    fbResponseAlert.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons({ root: fbResponseAlert });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = fbName ? fbName.value.trim() : '';
      const email = fbEmail ? fbEmail.value.trim() : '';
      const subject = fbSubject ? fbSubject.value.trim() : '';
      const category = fbCategory ? fbCategory.value : 'General Feedback';
      const message = fbMessage ? fbMessage.value.trim() : '';

      // Validate required inputs
      if (!name || !email || !subject || !message) {
        showFeedbackAlert('Please fill out all required fields before submitting.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFeedbackAlert('Please enter a valid email address.', 'error');
        return;
      }

      // Prevent spam & repeated clicks
      if (fbSubmitBtn) fbSubmitBtn.disabled = true;
      if (fbBtnLabel) fbBtnLabel.textContent = 'Sending feedback...';

      try {
        const response = await fetch(`${API_BASE}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, category, message }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to submit feedback. Please try again.');
        }

        // Accurately show delivery status without claiming false email delivery
        let successMessage = `Thank you, ${escapeHtml(name)}! Your feedback has been saved securely in our database.`;
        if (data.emailSent) {
          successMessage += ` A copy was emailed directly to debdeveloper2207@gmail.com.`;
        } else {
          successMessage += ` It is queued for review by the AEIE mentorship team.`;
        }

        showFeedbackAlert(successMessage, 'success');
        showToast('Feedback submitted successfully!', 'success');
        feedbackForm.reset();
        if (fbCharCount) fbCharCount.textContent = '0';
      } catch (err) {
        showFeedbackAlert(err.message || 'Failed to submit feedback. Please try again.', 'error');
        showToast(err.message, 'warning');
      } finally {
        if (fbSubmitBtn) fbSubmitBtn.disabled = false;
        if (fbBtnLabel) fbBtnLabel.textContent = 'Submit Feedback';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. TIMELINE STEP BUTTONS & SCROLLING
  // --------------------------------------------------------------------------
  const timelineSteps = document.querySelectorAll('.timeline-step');

  timelineSteps.forEach((step) => {
    const btn = step.querySelector('.step-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const targetId = step.getAttribute('data-year-target');
      const targetElement = document.getElementById(targetId);

      timelineSteps.forEach((s) => s.classList.remove('active'));
      step.classList.add('active');

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetElement.style.transition = 'box-shadow 0.4s ease';
        targetElement.style.boxShadow = '0 0 35px var(--blue-glow)';
        setTimeout(() => {
          targetElement.style.boxShadow = 'none';
        }, 1500);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. SEMESTER ACCORDION (EXPAND / COLLAPSE)
  // --------------------------------------------------------------------------
  const semesterHeaders = document.querySelectorAll('.semester-header');

  semesterHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      toggleSemesterCard(header);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSemesterCard(header);
      }
    });
  });

  function toggleSemesterCard(header) {
    const card = header.closest('.semester-card');
    if (!card) return;

    const isCollapsed = card.classList.contains('collapsed');
    if (isCollapsed) {
      card.classList.remove('collapsed');
      header.setAttribute('aria-expanded', 'true');
    } else {
      card.classList.add('collapsed');
      header.setAttribute('aria-expanded', 'false');
    }
  }

  if (btnExpandAll) {
    btnExpandAll.addEventListener('click', () => {
      document.querySelectorAll('.semester-card').forEach((card) => {
        card.classList.remove('collapsed');
        const header = card.querySelector('.semester-header');
        if (header) header.setAttribute('aria-expanded', 'true');
      });
      showToast('All 8 semesters expanded', 'info');
    });
  }

  if (btnCollapseAll) {
    btnCollapseAll.addEventListener('click', () => {
      document.querySelectorAll('.semester-card').forEach((card) => {
        card.classList.add('collapsed');
        const header = card.querySelector('.semester-header');
        if (header) header.setAttribute('aria-expanded', 'false');
      });
      showToast('All semesters collapsed', 'info');
    });
  }

  // --------------------------------------------------------------------------
  // 12. LIVE ROADMAP SEARCH & FILTER
  // --------------------------------------------------------------------------
  const btnClearRoadmapSearch = document.getElementById('btn-clear-roadmap-search');
  if (roadmapSearch) {
    roadmapSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (btnClearRoadmapSearch) {
        btnClearRoadmapSearch.style.display = query ? 'flex' : 'none';
      }
      const checklistItems = document.querySelectorAll('.checklist-item');
      const projectCards = document.querySelectorAll('.project-card');

      checklistItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });

      projectCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      if (query.length > 1) {
        document.querySelectorAll('.semester-card').forEach((card) => {
          card.classList.remove('collapsed');
        });
      }
    });

    if (btnClearRoadmapSearch) {
      btnClearRoadmapSearch.addEventListener('click', () => {
        roadmapSearch.value = '';
        btnClearRoadmapSearch.style.display = 'none';
        roadmapSearch.dispatchEvent(new Event('input'));
        roadmapSearch.focus();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 13. RESET ALL PROGRESS HANDLER
  // --------------------------------------------------------------------------
  if (btnResetProgress) {
    btnResetProgress.addEventListener('click', async () => {
      const confirmReset = window.confirm(
        'Are you sure you want to reset all your tracked progress? This will uncheck all subjects and projects.'
      );

      if (confirmReset) {
        userProgress = {};
        completedResources = [];
        gateProgress = [];
        personalNotes = '';
        saveStoredProgress();
        saveStoredResources();
        saveStoredGateProgress();
        localStorage.removeItem(STORAGE_KEY_NOTES);

        const pdNotes = document.getElementById('pd-personal-notes');
        if (pdNotes) pdNotes.value = '';
        const charSpan = document.getElementById('notes-char-count');
        if (charSpan) charSpan.textContent = '0';

        applyGateProgressToUI();
        applyProgressToUI();
        renderPortfolioProjects();
        renderResourcesGrid();

        if (authToken) {
          try {
            await apiRequest('/progress/reset', 'DELETE');
          } catch (e) {}
        }

        updateSaveIndicator(authToken ? 'saved' : 'saved');
        showToast('All progress has been reset successfully.', 'warning');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 14. PRINT / EXPORT ROADMAP AS PDF
  // --------------------------------------------------------------------------
  function triggerPrintPdf() {
    document.querySelectorAll('.semester-card').forEach((card) => {
      card.classList.remove('collapsed');
    });
    showToast('Preparing clean print/PDF view of your roadmap...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  }

  if (btnExportProgress) btnExportProgress.addEventListener('click', triggerPrintPdf);
  if (btnDownloadPdf) btnDownloadPdf.addEventListener('click', triggerPrintPdf);
  if (btnDownloadPdfHero) btnDownloadPdfHero.addEventListener('click', triggerPrintPdf);

  // --------------------------------------------------------------------------
  // 15. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('nav-open');
      if (isOpen) {
        navLinks.classList.remove('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll handler for all internal page anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        if (navLinks && navLinks.classList.contains('nav-open')) {
          navLinks.classList.remove('nav-open');
          if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 16. BACK TO TOP BUTTON & SCROLLSPY
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    updateScrollSpy();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateScrollSpy() {
    const sections = document.querySelectorAll('section[id], header[id="top"]');
    const scrollPosition = window.scrollY + 130;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 17. EPHEMERAL TOAST NOTIFICATION ENGINE
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle-2';
    if (type === 'warning') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    if (window.lucide) {
      window.lucide.createIcons({ root: toast });
    }

    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.3s forwards';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // INITIAL STARTUP
  // --------------------------------------------------------------------------
  initCharts();
  applyProgressToUI();
  applyGateProgressToUI();
  updateAuthUI();
  updateSaveIndicator(authToken ? 'saved' : 'saved');
  checkBackendHealth();

  // If user was previously authenticated, fetch their complete cloud state
  if (authToken) {
    fetchAndRestoreCloudState();
  }
});

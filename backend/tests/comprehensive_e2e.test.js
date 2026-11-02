/**
 * AEIE Career Navigator - Comprehensive End-to-End Bug Fix & Integrity Test Suite
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const http = require('http');

console.log('=== STARTING COMPREHENSIVE AEIE BUG FIX & INTEGRITY TEST SUITE ===\n');

// 1. Static Asset Verification on Disk
console.log('[1] Verifying all local SVG and graphic assets on disk...');
const assets = [
  'favicon.svg',
  'logo.svg',
  'hero-diagram.svg',
  'year1-foundation.svg',
  'year2-embedded.svg',
  'year3-automation.svg',
  'year4-career.svg'
];

assets.forEach((file) => {
  const filePath = path.join(__dirname, '../../assets', file);
  assert(fs.existsSync(filePath), `Asset missing: ${file}`);
  const stats = fs.statSync(filePath);
  assert(stats.size > 200, `Asset ${file} is too small or empty (${stats.size} bytes)`);
  console.log(`  ✓ Asset verified: assets/${file} (${stats.size} bytes)`);
});

// 2. Syntax Check of Frontend & Backend Files
console.log('\n[2] Checking syntax of JavaScript files...');
const jsFiles = [
  path.join(__dirname, '../../script.js'),
  path.join(__dirname, '../server.js'),
  path.join(__dirname, '../config/db.js'),
  path.join(__dirname, '../config/mailer.js'),
  path.join(__dirname, '../controllers/authController.js'),
  path.join(__dirname, '../controllers/feedbackController.js'),
  path.join(__dirname, '../controllers/progressController.js'),
  path.join(__dirname, '../controllers/resourceController.js'),
  path.join(__dirname, '../controllers/roadmapController.js')
];

jsFiles.forEach((file) => {
  const code = fs.readFileSync(file, 'utf8');
  assert.doesNotThrow(() => {
    new Function(code);
  }, `Syntax error in ${path.basename(file)}`);
  console.log(`  ✓ Syntax check passed: ${path.basename(file)}`);
});

// 3. HTML DOM Elements & Logo Consistency Check
console.log('\n[3] Verifying DOM elements, logo consistency, and buttons in index.html...');
const html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');

// Logo checks
assert(html.includes('assets/favicon.svg'), 'Favicon SVG link missing in index.html');
assert(html.includes('assets/hero-diagram.svg'), 'Hero architecture diagram missing');
assert(html.includes('assets/year1-foundation.svg'), 'Year 1 SVG image missing');
assert(html.includes('assets/year2-embedded.svg'), 'Year 2 SVG image missing');
assert(html.includes('assets/year3-automation.svg'), 'Year 3 SVG image missing');
assert(html.includes('assets/year4-career.svg'), 'Year 4 SVG image missing');

// Interactive button IDs
const requiredButtons = [
  'theme-toggle',
  'btn-open-auth',
  'mobile-menu-toggle',
  'hero-btn-profile',
  'btn-download-pdf-hero',
  'btn-sync-cloud',
  'btn-sign-out',
  'btn-close-dash',
  'btn-save-notes',
  'btn-open-settings',
  'btn-save-settings',
  'btn-cancel-settings',
  'btn-expand-all',
  'btn-collapse-all',
  'btn-download-pdf',
  'btn-export-progress',
  'btn-reset-progress',
  'fb-submit-btn',
  'btn-close-auth-modal',
  'tab-login-btn',
  'tab-register-btn',
  'btn-submit-login',
  'btn-submit-register',
  'back-to-top',
  'btn-clear-roadmap-search',
  'btn-clear-resource-search'
];

requiredButtons.forEach((btnId) => {
  assert(html.includes(`id="${btnId}"`), `Button ID missing in HTML: ${btnId}`);
  console.log(`  ✓ Interactive element present: #${btnId}`);
});

// 4. Live Server HTTP Verification
console.log('\n[4] Probing Live Server on port 5000...');

function makeRequest(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${urlPath}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

(async () => {
  try {
    // Health check
    const health = await makeRequest('/api/health');
    assert.strictEqual(health.statusCode, 200, 'Health check failed');
    const healthData = JSON.parse(health.body);
    assert.strictEqual(healthData.status, 'online');
    console.log(`  ✓ /api/health returned 200: App "${healthData.appName}" by ${healthData.creator}`);

    // Favicon shortcut check
    const favRes = await makeRequest('/favicon.ico');
    assert.strictEqual(favRes.statusCode, 200, '/favicon.ico failed');
    assert(favRes.body.includes('<svg'), '/favicon.ico did not return valid SVG');
    console.log('  ✓ /favicon.ico returned 200 with SVG favicon');

    // Asset endpoints check
    const logoRes = await makeRequest('/assets/logo.svg');
    assert.strictEqual(logoRes.statusCode, 200, '/assets/logo.svg failed');
    console.log('  ✓ /assets/logo.svg served successfully (200)');

    const heroArchRes = await makeRequest('/assets/hero-diagram.svg');
    assert.strictEqual(heroArchRes.statusCode, 200, '/assets/hero-diagram.svg failed');
    console.log('  ✓ /assets/hero-diagram.svg served successfully (200)');

    // User Journey Test: Registration, Login, Settings Update & State Restoration
    const testEmail = `student_journey_${Date.now()}@uit.buruniv.ac.in`;
    const testPassword = 'Password@123';

    // Register
    const regRes = await makeRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Debankan Mukherjee',
        email: testEmail,
        password: testPassword,
        currentSemester: 1,
        careerGoal: 'Core Electronics & Embedded'
      }
    });
    assert.strictEqual(regRes.statusCode, 201, 'Registration failed');
    const regData = JSON.parse(regRes.body);
    const token = regData.token;
    assert(token, 'Auth token missing');
    console.log(`  ✓ User registered successfully: ${testEmail}`);

    // Update Profile (Settings)
    const profileRes = await makeRequest('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        currentSemester: 4,
        careerGoal: 'Industrial Automation & PLC'
      }
    });
    assert.strictEqual(profileRes.statusCode, 200, 'Profile update failed');
    const profData = JSON.parse(profileRes.body);
    assert.strictEqual(profData.user.currentSemester, 4);
    assert.strictEqual(profData.user.careerGoal, 'Industrial Automation & PLC');
    console.log('  ✓ Settings Profile updated: Semester 4, Industrial Automation & PLC');

    // Progress & Notes Sync
    const syncRes = await makeRequest('/api/progress/sync', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        completedSubjects: ['y1-s1-1', 'y1-s1-2', 'y2-s4-1'],
        completedProjects: ['proj-y1-1'],
        personalNotes: 'Complete PID tuning experiment in MATLAB and revise Nyquist criteria.',
        gateProgress: ['gate-math', 'gate-control'],
        themePreference: 'dark',
        dashboardPreferences: { targetCGPA: 9.0 }
      }
    });
    assert.strictEqual(syncRes.statusCode, 200, 'Sync failed');
    console.log('  ✓ Cloud progress, personal study notes & target CGPA synced');

    // State Restoration Verification
    const progRes = await makeRequest('/api/progress', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(progRes.statusCode, 200, 'Get progress failed');
    const restored = JSON.parse(progRes.body).data;
    assert.strictEqual(restored.completedSubjects.length, 3);
    assert.strictEqual(restored.gateProgress.length, 2);
    assert(restored.personalNotes.includes('PID tuning'));
    console.log('  ✓ Progress state fully restored from cloud database');

    // Contact & Feedback Submission
    const fbRes = await makeRequest('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'Debankan Mukherjee',
        email: testEmail,
        subject: 'Feedback on Semester 4 PLC Module',
        category: 'Suggestion',
        message: 'Please add more details regarding Modbus RTU vs Modbus TCP/IP in the industrial automation section.'
      }
    });
    assert.strictEqual(fbRes.statusCode, 201, 'Feedback submission failed');
    const fbData = JSON.parse(fbRes.body);
    assert(fbData.success, 'Feedback response unsuccessful');
    console.log(`  ✓ Feedback submitted and recorded: Category [Suggestion], Recipient: debdeveloper2207@gmail.com`);

    console.log('\n>>> COMPREHENSIVE END-TO-END TEST SUITE PASSED WITH 100% SUCCESS! <<<');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failure:', err);
    process.exit(1);
  }
})();


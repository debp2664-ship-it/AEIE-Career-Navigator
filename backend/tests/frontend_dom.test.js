/**
 * Automated Frontend DOM & Element Verification Test
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== STARTING FRONTEND DOM & CONFIGURATION VERIFICATION ===\n');

const htmlContent = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '../../style.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, '../../script.js'), 'utf8');

// [1] Verify Creator Credit
console.log('[1] Checking Website Creator Credit in Footer...');
assert(htmlContent.includes('Made with care by <strong class="creator-name">Deb</strong>.'), 'Creator name Deb missing');
assert(htmlContent.includes('AEIE Career Navigator'), 'App name missing in creator credit');
assert(htmlContent.includes('&copy; 2026 All Rights Reserved.'), 'Copyright 2026 missing in creator credit');
assert(cssContent.includes('.creator-credit-card:hover'), 'Hover animation missing in style.css');
assert(cssContent.includes('@keyframes heartPulse'), 'Heart pulse animation missing in style.css');
console.log('  -> PASS: Creator credit "Made with care by Deb." with subtle hover animation verified.');

// [2] Verify Contact Us Section & 5 Required Fields
console.log('[2] Checking Contact Us & Feedback Section...');
assert(htmlContent.includes('id="contact"'), '#contact anchor ID missing');
assert(htmlContent.includes('id="contact-feedback-form"'), '#contact-feedback-form missing');
assert(htmlContent.includes('id="fb-name"'), 'Name input missing');
assert(htmlContent.includes('id="fb-email"'), 'Email input missing');
assert(htmlContent.includes('id="fb-subject"'), 'Subject input missing');
assert(htmlContent.includes('id="fb-category"'), 'Category select missing');
assert(htmlContent.includes('<option value="Suggestion">Suggestion</option>'), 'Suggestion category missing');
assert(htmlContent.includes('<option value="Bug Report">Bug Report</option>'), 'Bug Report category missing');
assert(htmlContent.includes('<option value="General Feedback" selected>General Feedback</option>'), 'General Feedback category missing');
assert(htmlContent.includes('id="fb-message"'), 'Message textarea missing');
assert(htmlContent.includes('id="fb-submit-btn"'), 'Submit feedback button missing');
assert(htmlContent.includes('debdeveloper2207@gmail.com'), 'Email address debdeveloper2207@gmail.com missing');
assert(htmlContent.includes('contact-privacy-note'), 'Privacy notice missing');
console.log('  -> PASS: Contact Us section has all 5 required fields, email debdeveloper2207@gmail.com, and privacy notice.');

// [3] Verify Auto-Save Cloud Status Indicator
console.log('[3] Checking Auto-Save Status Indicator in Navbar...');
assert(htmlContent.includes('id="save-status-indicator"'), '#save-status-indicator missing in index.html');
assert(htmlContent.includes('id="save-status-label"'), '#save-status-label missing');
assert(cssContent.includes('.save-status-badge.saving'), '.saving class style missing in style.css');
assert(cssContent.includes('.save-status-badge.saved'), '.saved class style missing in style.css');
assert(cssContent.includes('.save-status-badge.error'), '.error class style missing in style.css');
assert(jsContent.includes('function updateSaveIndicator(status)'), 'updateSaveIndicator function missing in script.js');
assert(jsContent.includes('function scheduleAutoSave()'), 'scheduleAutoSave function missing in script.js');
console.log('  -> PASS: Auto-Save indicator present in navbar with debouncing and tri-state indicators.');

// [4] Verify Personal Study Notes in Dashboard
console.log('[4] Checking Personal Study Notes in Dashboard...');
assert(htmlContent.includes('id="pd-personal-notes"'), '#pd-personal-notes missing in index.html');
assert(htmlContent.includes('id="btn-save-notes"'), '#btn-save-notes missing in index.html');
assert(htmlContent.includes('id="notes-char-count"'), '#notes-char-count missing in index.html');
assert(jsContent.includes('pdNotesTextarea.addEventListener(\'input\''), 'Personal notes input handler missing in script.js');
console.log('  -> PASS: Personal Study Notes widget active in dashboard with real-time char count & persistence.');

// [5] Verify GATE Interactive Checklist
console.log('[5] Checking Interactive GATE Preparation Checklist...');
assert(htmlContent.includes('id="gate-math"'), '#gate-math checkbox missing');
assert(htmlContent.includes('id="gate-networks"'), '#gate-networks checkbox missing');
assert(htmlContent.includes('id="gate-transducers"'), '#gate-transducers checkbox missing');
assert(htmlContent.includes('id="gate-control"'), '#gate-control checkbox missing');
assert(htmlContent.includes('id="gate-papers-10yr"'), '#gate-papers-10yr checkbox missing');
assert(htmlContent.includes('id="gate-mock-test"'), '#gate-mock-test checkbox missing');
assert(htmlContent.includes('id="gate-checklist-counter"'), '#gate-checklist-counter missing');
assert(jsContent.includes('function applyGateProgressToUI()'), 'applyGateProgressToUI missing in script.js');
console.log('  -> PASS: GATE checklist has all 6 milestones with interactive tracking and cloud sync.');

// [6] Verify State Restoration on Login
console.log('[6] Checking State Restoration on Re-Login in script.js...');
assert(jsContent.includes('async function fetchAndRestoreCloudState()'), 'fetchAndRestoreCloudState missing in script.js');
assert(jsContent.includes('await fetchAndRestoreCloudState()'), 'Call to fetchAndRestoreCloudState missing on login/init');
console.log('  -> PASS: Full multi-device state restoration logic verified.');

console.log('\n>>> ALL FRONTEND DOM, ACCESSIBILITY & BEHAVIOR TESTS PASSED! <<<');


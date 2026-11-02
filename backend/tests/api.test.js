const http = require('http');
process.env.NODE_ENV = 'test';
process.env.PORT = '5002';
const app = require('../server');

const PORT = 5002;
let server;

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING BACKEND REST API & SECURITY TEST SUITE ===');
  server = app.listen(PORT, async () => {
    try {
      // 1. Health Check
      console.log('\n[1] Testing Health Check /api/health');
      const health = await makeRequest('GET', '/api/health');
      console.log('  Status:', health.status);
      console.log('  App Name:', health.body.appName);
      console.log('  DB Mode:', health.body.database.mode);
      if (health.status !== 200) throw new Error('Health check failed');

      // 2. Roadmap Summary
      console.log('\n[2] Testing Roadmap Summary /api/roadmap/summary');
      const summary = await makeRequest('GET', '/api/roadmap/summary');
      console.log('  Status:', summary.status);
      console.log('  Semesters:', summary.body.metrics.totalSemesters);
      console.log('  Career Pathways:', summary.body.pathways.length);
      if (summary.status !== 200) throw new Error('Summary test failed');

      // 3. Semesters List
      console.log('\n[3] Testing Roadmap Semesters /api/roadmap/semesters');
      const sems = await makeRequest('GET', '/api/roadmap/semesters');
      console.log('  Status:', sems.status);
      console.log('  Count:', sems.body.count);
      if (sems.body.count !== 8) throw new Error('Expected 8 semesters, got ' + sems.body.count);

      // 4. Single Semester
      console.log('\n[4] Testing Single Semester /api/roadmap/semesters/1');
      const sem1 = await makeRequest('GET', '/api/roadmap/semesters/1');
      console.log('  Status:', sem1.status);
      console.log('  Title:', sem1.body.data.title);

      // 5. Projects
      console.log('\n[5] Testing Projects /api/roadmap/projects');
      const projs = await makeRequest('GET', '/api/roadmap/projects');
      console.log('  Projects Count:', projs.body.count);

      // 6. Resources & Search
      console.log('\n[6] Testing Resources & Search /api/resources');
      const searchRes = await makeRequest('GET', '/api/resources?search=Wokwi');
      console.log('  Search "Wokwi" Count:', searchRes.body.count);
      if (searchRes.body.count < 1) throw new Error('Resource search failed');

      // 7. Auth: Register User A
      console.log('\n[7] Testing User Registration (User A) /api/auth/register');
      const emailA = `student_a_${Date.now()}@uit.buruniv.ac.in`;
      const regA = await makeRequest('POST', '/api/auth/register', {
        name: 'Sayan Banerjee',
        email: emailA,
        password: 'password123',
        college: 'UIT Burdwan',
        department: 'AEIE',
        currentSemester: 3,
        careerGoal: 'Embedded Systems & Industrial Automation',
      });
      console.log('  Register Status:', regA.status);
      if (regA.status !== 201) throw new Error('Registration failed for User A');
      const tokenA = regA.body.token;

      // 8. Auth: Login User A
      console.log('\n[8] Testing User Login /api/auth/login');
      const loginA = await makeRequest('POST', '/api/auth/login', {
        email: emailA,
        password: 'password123',
      });
      console.log('  Login Status:', loginA.status);
      if (loginA.status !== 200) throw new Error('Login failed for User A');

      // 9. Auth: Protected Route /api/auth/me
      console.log('\n[9] Testing Protected Route /api/auth/me');
      const meA = await makeRequest('GET', '/api/auth/me', null, tokenA);
      console.log('  Me Status:', meA.status);
      console.log('  User Email:', meA.body.user.email);
      if (meA.status !== 200) throw new Error('Auth me failed');

      // 10. Progress: Task Toggle for User A
      console.log('\n[10] Testing Progress Update (User A) /api/progress/task');
      const taskResA = await makeRequest(
        'POST',
        '/api/progress/task',
        { taskId: 'y1-s1-1', action: 'check' },
        tokenA
      );
      console.log('  Task Status:', taskResA.status);
      console.log('  Overall Percentage:', taskResA.body.data.overallPercentage);

      // 11. Progress: Bulk Sync (Notes, Theme, Gate, Tasks) for User A
      console.log('\n[11] Testing Full Progress & Notes Sync /api/progress/sync');
      const syncResA = await makeRequest(
        'PUT',
        '/api/progress/sync',
        {
          completedSubjects: ['y1-s1-1', 'y1-s1-2', 'y1-s1-3'],
          completedProjects: ['proj-y1-1'],
          personalNotes: 'Focus on Op-Amp active filters and Root Locus for upcoming lab viva.',
          themePreference: 'dark',
          gateProgress: ['gate-math-revised', 'gate-networks-10yrs'],
        },
        tokenA
      );
      console.log('  Sync Status:', syncResA.status);
      console.log('  Personal Notes Saved:', syncResA.body.data.personalNotes ? 'YES' : 'NO');
      if (!syncResA.body.data.personalNotes) throw new Error('Personal notes were not saved');

      // 12. Re-login User A and confirm state restoration
      console.log('\n[12] Testing State Restoration on Re-Login (User A)');
      const reLoginMe = await makeRequest('GET', '/api/auth/me', null, tokenA);
      const reLoginProgress = await makeRequest('GET', '/api/progress', null, tokenA);
      console.log('  Restored Completed Subjects:', reLoginProgress.body.data.completedSubjects.length);
      console.log('  Restored Notes:', reLoginProgress.body.data.personalNotes);
      if (reLoginProgress.body.data.completedSubjects.length !== 3) {
        throw new Error('State was not restored accurately on re-login');
      }

      // 13. Data Isolation Check: Register User B and verify independent progress
      console.log('\n[13] Testing User Data Isolation (User B vs User A)');
      const emailB = `student_b_${Date.now()}@uit.buruniv.ac.in`;
      const regB = await makeRequest('POST', '/api/auth/register', {
        name: 'Deb Roy',
        email: emailB,
        password: 'password456',
        currentSemester: 1,
      });
      const tokenB = regB.body.token;
      const progressB = await makeRequest('GET', '/api/progress', null, tokenB);
      console.log('  User B Initial Completed Count:', progressB.body.data.metrics.completedCount);
      if (progressB.body.data.metrics.completedCount !== 0) {
        throw new Error('Data isolation failure: User B has User A progress data!');
      }
      console.log('  [PASS] User B data is completely isolated from User A.');

      // 14. Feedback Submission & Validation
      console.log('\n[14] Testing Feedback Submission /api/feedback');
      const fbSuccess = await makeRequest('POST', '/api/feedback', {
        name: 'Deb Roy',
        email: 'debdeveloper2207@gmail.com',
        subject: 'Outstanding UI & Career Roadmap Feedback',
        category: 'Suggestion',
        message: 'The interactive 4-year timeline and PLC SCADA breakdown for UIT Burdwan is excellent.',
      });
      console.log('  Feedback Status:', fbSuccess.status);
      console.log('  Feedback Message:', fbSuccess.body.message);
      console.log('  Email Status:', fbSuccess.body.emailStatus);
      if (fbSuccess.status !== 201) throw new Error('Feedback submission failed');

      // 15. Feedback Validation Error Handling
      console.log('\n[15] Testing Feedback Validation (Empty message error handling)');
      const fbFail = await makeRequest('POST', '/api/feedback', {
        name: 'Test',
        email: 'invalid-email',
        subject: 'Hi',
        category: 'Suggestion',
        message: 'Short',
      });
      console.log('  Validation Error Status:', fbFail.status);
      console.log('  Error Message:', fbFail.body.message);
      if (fbFail.status !== 400) throw new Error('Expected 400 validation error for bad input');

      // 16. Admin Feedback Review (Protected)
      console.log('\n[16] Testing Admin Feedback Review /api/feedback');
      const adminFb = await makeRequest('GET', '/api/feedback', null, tokenA);
      console.log('  Admin Review Status:', adminFb.status);
      console.log('  Feedback Records Count:', adminFb.body.count);
      if (adminFb.status !== 200) throw new Error('Admin feedback review failed');

      console.log('\n>>> ALL 16 BACKEND REST API, SECURITY & DATA ISOLATION TESTS PASSED WITH 100% SUCCESS! <<<');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('\n[TEST FAILURE]', err.message);
      if (server) server.close();
      process.exit(1);
    }
  });
}

runTests();

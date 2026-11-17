const http = require('node:http');
const { app } = require('../src/server');

// Run tests against the in-memory or running Express server
async function runTests() {
  const PORT = 5055;
  const server = app.listen(PORT, async () => {
    console.log(`\n🧪 Testing Test Runner started on http://localhost:${PORT}`);

    try {
      // Helper function for making requests
      async function request(method, path, body = null, token = null) {
        return new Promise((resolve, reject) => {
          const payload = body ? JSON.stringify(body) : null;
          const headers = {
            'Content-Type': 'application/json',
          };
          if (payload) {
            headers['Content-Length'] = Buffer.byteLength(payload);
          }
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const req = http.request(
            {
              hostname: 'localhost',
              port: PORT,
              path,
              method,
              headers,
            },
            res => {
              let data = '';
              res.on('data', chunk => (data += chunk));
              res.on('end', () => {
                try {
                  const parsed = JSON.parse(data);
                  resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                  resolve({ status: res.statusCode, body: data });
                }
              });
            }
          );

          req.on('error', reject);
          if (payload) {
            req.write(payload);
          }
          req.end();
        });
      }

      console.log('\n--- TEST 1: Health Check ---');
      const health = await request('GET', '/api/health');
      if (health.status !== 200 || health.body.status !== 'healthy') {
        throw new Error('Health check failed: ' + JSON.stringify(health));
      }
      console.log('✅ Health check passed.');

      console.log('\n--- TEST 2: Send OTP for Admin ---');
      const adminOtpReq = await request('POST', '/api/auth/send-otp', {
        email: 'admin@agency.com',
      });
      if (adminOtpReq.status !== 200 || !adminOtpReq.body.devOtp) {
        throw new Error('Send OTP failed: ' + JSON.stringify(adminOtpReq));
      }
      const adminOtp = adminOtpReq.body.devOtp;
      console.log(`✅ Admin OTP received: ${adminOtp}`);

      console.log('\n--- TEST 3: Verify Admin OTP & Issue Token ---');
      const adminVerify = await request('POST', '/api/auth/verify-otp', {
        email: 'admin@agency.com',
        otp: adminOtp,
      });
      if (adminVerify.status !== 200 || !adminVerify.body.token) {
        throw new Error('Admin verify failed: ' + JSON.stringify(adminVerify));
      }
      const adminToken = adminVerify.body.token;
      console.log('✅ Admin login verified. Role:', adminVerify.body.user.role);

      console.log('\n--- TEST 4: Send & Verify OTP for New Client ---');
      const clientEmail = 'client.newtest@agency.test';
      const clientOtpReq = await request('POST', '/api/auth/send-otp', {
        email: clientEmail,
        name: 'New Test Client',
      });
      const clientOtp = clientOtpReq.body.devOtp;
      const clientVerify = await request('POST', '/api/auth/verify-otp', {
        email: clientEmail,
        otp: clientOtp,
        name: 'New Test Client',
        role: 'client',
        phone: '+91 9999888877',
      });
      if (clientVerify.status !== 200 || !clientVerify.body.token) {
        throw new Error('Client auth failed: ' + JSON.stringify(clientVerify));
      }
      const clientToken = clientVerify.body.token;
      console.log('✅ New Client registered and verified with role:', clientVerify.body.user.role);

      console.log('\n--- TEST 5: Client Posts New Project ---');
      const newTask = await request(
        'POST',
        '/api/tasks',
        {
          title: 'Deploy Next.js App to Render with Custom Domain',
          service_category: 'Render Deployment',
          description: 'Need full setup with automatic deploys and SSL domain link.',
          budget_inr: 8500,
          deadline: '3 Days',
          contact_number: '+91 9999888877',
          attachment_url: 'https://github.com/test/my-repo',
        },
        clientToken
      );
      if (newTask.status !== 201 || !newTask.body.task) {
        throw new Error('Task creation failed: ' + JSON.stringify(newTask));
      }
      const createdTaskId = newTask.body.task.id;
      console.log(`✅ Task created with ID ${createdTaskId}, Budget ₹${newTask.body.task.budget_inr}`);

      console.log('\n--- TEST 6: Client Views Their Tasks ---');
      const clientTasks = await request('GET', '/api/tasks/my-client-tasks', null, clientToken);
      if (clientTasks.status !== 200 || clientTasks.body.tasks.length === 0) {
        throw new Error('Get client tasks failed: ' + JSON.stringify(clientTasks));
      }
      console.log(`✅ Client retrieved ${clientTasks.body.tasks.length} task(s).`);

      console.log('\n--- TEST 7: Admin Overview & Stats ---');
      const adminOverview = await request('GET', '/api/admin/overview', null, adminToken);
      if (adminOverview.status !== 200 || !adminOverview.body.stats) {
        throw new Error('Admin overview failed: ' + JSON.stringify(adminOverview));
      }
      console.log(`✅ Admin Overview verified. Total Revenue: ₹${adminOverview.body.stats.totalRevenue}, Tasks: ${adminOverview.body.stats.totalTasks}`);

      console.log('\n--- TEST 8: Admin Fetches Workers and Assigns Task ---');
      const workersList = await request('GET', '/api/admin/workers', null, adminToken);
      if (workersList.status !== 200 || workersList.body.workers.length === 0) {
        throw new Error('Get workers list failed: ' + JSON.stringify(workersList));
      }
      const assignedWorker = workersList.body.workers[0];
      console.log(`Found worker: ${assignedWorker.name} (ID: ${assignedWorker.id})`);

      const assignReq = await request(
        'PATCH',
        `/api/admin/tasks/${createdTaskId}/assign`,
        { worker_id: assignedWorker.id },
        adminToken
      );
      if (assignReq.status !== 200 || assignReq.body.task.worker_id !== assignedWorker.id) {
        throw new Error('Worker assignment failed: ' + JSON.stringify(assignReq));
      }
      console.log(`✅ Task ${createdTaskId} assigned to ${assignedWorker.name}.`);

      console.log('\n--- TEST 9: Worker Login & Update Task Progress ---');
      const workerOtpReq = await request('POST', '/api/auth/send-otp', {
        email: assignedWorker.email,
      });
      const workerVerify = await request('POST', '/api/auth/verify-otp', {
        email: assignedWorker.email,
        otp: workerOtpReq.body.devOtp,
      });
      const workerToken = workerVerify.body.token;

      const workerTasks = await request('GET', '/api/tasks/my-worker-tasks', null, workerToken);
      if (workerTasks.status !== 200 || workerTasks.body.tasks.length === 0) {
        throw new Error('Worker tasks fetch failed: ' + JSON.stringify(workerTasks));
      }

      const updateProgress = await request(
        'PATCH',
        `/api/tasks/${createdTaskId}/progress`,
        {
          status: 'In Progress',
          worker_notes: 'Started environment configuration on Render.',
          submission_link: 'https://render.com/demo-service-status',
        },
        workerToken
      );
      if (updateProgress.status !== 200 || updateProgress.body.task.status !== 'In Progress') {
        throw new Error('Worker progress update failed: ' + JSON.stringify(updateProgress));
      }
      console.log('✅ Worker updated task progress to "In Progress" with notes and link.');

      console.log('\n--- TEST 10: Task Detail & Full Audit Logs ---');
      const taskDetail = await request('GET', `/api/tasks/${createdTaskId}`, null, clientToken);
      if (taskDetail.status !== 200 || taskDetail.body.logs.length === 0) {
        throw new Error('Task detail fetch failed: ' + JSON.stringify(taskDetail));
      }
      console.log(`✅ Task audit history verified with ${taskDetail.body.logs.length} activity entries.`);

      console.log('\n🎉 ALL 10 TESTS PASSED SUCCESSFULLY! BACKEND & DATABASE ARE 100% OPERATIONAL.\n');
    } catch (err) {
      console.error('\n❌ Test Suite Error:', err);
      process.exitCode = 1;
    } finally {
      server.close();
      process.exit(process.exitCode || 0);
    }
  });
}

runTests();

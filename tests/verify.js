const BACKEND_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting integration test for MERN RBAC and Activity Tracking System...');
  
  let adminToken = '';
  let userToken = '';
  let userId = '';
  let taskId = '';
  
  // Helper for JSON headers
  const getHeaders = (token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  try {
    // 1. Admin Login
    console.log('\n--- 1. Admin Login ---');
    const adminLoginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'Admin@123'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginRes.ok) throw new Error(`Admin login failed: ${adminLoginData.message}`);
    adminToken = adminLoginData.data.token;
    console.log('✅ Admin logged in successfully!');
    
    // Cleanup any existing test user first, just in case
    console.log('Cleaning up existing test user if any...');
    const usersRes = await fetch(`${BACKEND_URL}/admin/users?search=testuser@example.com`, {
      method: 'GET',
      headers: getHeaders(adminToken)
    });
    const usersData = await usersRes.json();
    if (usersData.data && usersData.data.length > 0) {
      const existingUser = usersData.data[0];
      console.log(`Found existing test user ${existingUser.email} (${existingUser._id}), deleting...`);
      const deleteRes = await fetch(`${BACKEND_URL}/admin/users/${existingUser._id}`, {
        method: 'DELETE',
        headers: getHeaders(adminToken)
      });
      console.log(`Delete response status: ${deleteRes.status}`);
    }

    // 2. User Registration
    console.log('\n--- 2. Register New User ---');
    const regRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'TestUser@123'
      })
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(`User registration failed: ${regData.message}`);
    console.log('✅ User registered successfully!');
    
    // 3. User Login
    console.log('\n--- 3. User Login ---');
    const userLoginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestUser@123'
      })
    });
    const userLoginData = await userLoginRes.json();
    if (!userLoginRes.ok) throw new Error(`User login failed: ${userLoginData.message}`);
    userToken = userLoginData.data.token;
    userId = userLoginData.data._id;
    console.log(`✅ User logged in successfully! User ID: ${userId}`);

    // 4. Create Task
    console.log('\n--- 4. Create Task ---');
    const createTaskRes = await fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(userToken),
      body: JSON.stringify({
        title: 'Complete Test Task',
        description: 'Verify all end-to-end flows programmatically',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString() // tomorrow
      })
    });
    const createTaskData = await createTaskRes.json();
    if (!createTaskRes.ok) throw new Error(`Task creation failed: ${createTaskData.message}`);
    taskId = createTaskData.data._id;
    console.log(`✅ Task created successfully! Task ID: ${taskId}`);

    // 5. Get User Tasks
    console.log('\n--- 5. Get User Tasks ---');
    const getTasksRes = await fetch(`${BACKEND_URL}/tasks`, {
      method: 'GET',
      headers: getHeaders(userToken)
    });
    const getTasksData = await getTasksRes.json();
    if (!getTasksRes.ok) throw new Error(`Get tasks failed: ${getTasksData.message}`);
    const foundTask = getTasksData.data.find(t => t._id === taskId);
    if (!foundTask) throw new Error('Created task not found in user task list!');
    console.log(`✅ Found created task: "${foundTask.title}" with priority "${foundTask.priority}"`);

    // 6. Update Task
    console.log('\n--- 6. Update Task ---');
    const updateTaskRes = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(userToken),
      body: JSON.stringify({
        title: 'Complete Test Task (Updated)',
        status: 'in_progress',
        priority: 'medium'
      })
    });
    const updateTaskData = await updateTaskRes.json();
    if (!updateTaskRes.ok) throw new Error(`Task update failed: ${updateTaskData.message}`);
    console.log(`✅ Task updated successfully! Title: "${updateTaskData.data.title}", Status: "${updateTaskData.data.status}", Priority: "${updateTaskData.data.priority}"`);

    // 7. Get Admin Stats & Verify Activities
    console.log('\n--- 7. Get Admin Stats & Verify Activities ---');
    const statsRes = await fetch(`${BACKEND_URL}/admin/stats`, {
      method: 'GET',
      headers: getHeaders(adminToken)
    });
    const statsData = await statsRes.json();
    if (!statsRes.ok) throw new Error(`Get admin stats failed: ${statsData.message}`);
    console.log('✅ Admin stats retrieved successfully!');
    console.log(`   Total Users: ${statsData.data.users.total}`);
    console.log(`   Active Users: ${statsData.data.users.active}`);
    console.log(`   Total Tasks: ${statsData.data.tasks.total}`);
    console.log('   Recent Activity Logs:');
    statsData.data.recentActivities.forEach((act, idx) => {
      console.log(`     [${idx + 1}] [${act.action}] - ${act.description}`);
    });

    // 8. Deactivate User Account
    console.log('\n--- 8. Deactivate User Account ---');
    const deactivateRes = await fetch(`${BACKEND_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(adminToken),
      body: JSON.stringify({ status: 'inactive' })
    });
    const deactivateData = await deactivateRes.json();
    if (!deactivateRes.ok) throw new Error(`Deactivation failed: ${deactivateData.message}`);
    console.log(`✅ User status set to: ${deactivateData.data.status}`);

    // 9. Verify Token Rejection on Deactivated User
    console.log('\n--- 9. Verify Token Rejection on Deactivated User ---');
    const userTasksAfterDeactivateRes = await fetch(`${BACKEND_URL}/tasks`, {
      method: 'GET',
      headers: getHeaders(userToken)
    });
    const userTasksAfterDeactivateData = await userTasksAfterDeactivateRes.json();
    console.log(`   Response status code: ${userTasksAfterDeactivateRes.status}`);
    console.log(`   Response message: ${userTasksAfterDeactivateData.message}`);
    if (userTasksAfterDeactivateRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden status, but got ${userTasksAfterDeactivateRes.status}`);
    }
    console.log('✅ Token rejection verified! Active user session is successfully blocked/rejected with 403.');

    // 10. Verify Login Failure for Deactivated User
    console.log('\n--- 10. Verify Login Failure for Deactivated User ---');
    const userLoginAfterDeactivateRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestUser@123'
      })
    });
    const userLoginAfterDeactivateData = await userLoginAfterDeactivateRes.json();
    console.log(`   Response status code: ${userLoginAfterDeactivateRes.status}`);
    console.log(`   Response message: ${userLoginAfterDeactivateData.message}`);
    if (userLoginAfterDeactivateRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden login status, but got ${userLoginAfterDeactivateRes.status}`);
    }
    console.log('✅ Login rejection verified! Deactivated user cannot log back in.');

    // 11. Reactivate User Account
    console.log('\n--- 11. Reactivate User Account ---');
    const reactivateRes = await fetch(`${BACKEND_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(adminToken),
      body: JSON.stringify({ status: 'active' })
    });
    const reactivateData = await reactivateRes.json();
    if (!reactivateRes.ok) throw new Error(`Reactivation failed: ${reactivateData.message}`);
    console.log(`✅ User status set to: ${reactivateData.data.status}`);

    // 12. Verify Login Success after Reactivation
    console.log('\n--- 12. Verify Login Success after Reactivation ---');
    const userLoginAfterReactivateRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestUser@123'
      })
    });
    const userLoginAfterReactivateData = await userLoginAfterReactivateRes.json();
    if (!userLoginAfterReactivateRes.ok) throw new Error(`Re-login failed: ${userLoginAfterReactivateData.message}`);
    userToken = userLoginAfterReactivateData.data.token;
    console.log('✅ User successfully logged in again after reactivation!');

    // 13. Delete User & Cascade Delete Verification
    console.log('\n--- 13. Delete User & Cascade Delete Verification ---');
    const deleteUserRes = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(adminToken)
    });
    const deleteUserData = await deleteUserRes.json();
    if (!deleteUserRes.ok) throw new Error(`User deletion failed: ${deleteUserData.message}`);
    console.log(`✅ User deleted successfully: ${deleteUserData.message}`);

    // Verify task is deleted
    const allTasksRes = await fetch(`${BACKEND_URL}/admin/tasks`, {
      method: 'GET',
      headers: getHeaders(adminToken)
    });
    const allTasksData = await allTasksRes.json();
    const taskFound = allTasksData.data.find(t => t._id === taskId);
    if (taskFound) {
      throw new Error(`Cascade delete failed! Task ${taskId} is still in the database after deleting owner ${userId}`);
    }
    console.log('✅ Cascade delete verified! All user tasks deleted successfully along with user.');

    console.log('\n🌟 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🌟');
  } catch (error) {
    console.error('\n❌ INTEGRATION TEST FAILED:', error);
    process.exit(1);
  }
}

runTests();

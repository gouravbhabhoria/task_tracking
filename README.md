# 📋 MERN Task Tracking & Role-Based Access Control (RBAC) System

A modern, responsive task tracking web application built on the MERN stack (MongoDB, Express, React, Node.js). The platform is styled with a premium slate-dark glassmorphic user interface. It implements role-based routing, real-time activity auditing, administrative panels, and instant session eviction for suspended users.

---

## 🚀 Key Features

* **Dual-Role Architecture**:
  * **Admin**: Access to global statistics and user activity dashboards, user management (activate/deactivate access, delete users), task monitoring across all users, and automated analytics rendering.
  * **User**: Manage personal tasks (create, edit, delete, and view), change status, and update priorities.
* **Audit Trail / Activity Logger**: Every major event (user registration, logins, task creations/updates/deletions, user status toggles) is logged into the database and viewable in real-time in the admin panel.
* **Instant Session Eviction**: If an admin sets a user's status to `inactive`, the backend instantly rejects their active token. The frontend Axios interceptor intercepts the `403 Forbidden` response, deletes the user session, clears localStorage, and redirects them to the login screen.
* **Cascading Deletion**: Deleting a user account automatically deletes all task documents created by that user, keeping the database clean.
* **Rich Glassmorphism UI**: Beautiful, interactive charts (Recharts), dynamic tables, task modals, and customized dashboards without standard grid patterns or browser styling defaults.

---

## 📁 Project Structure

```text
assignment21May/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── activityController.js # Activity log retrieval
│   │   ├── adminController.js    # Admin stats, user tables, and task audits
│   │   ├── authController.js     # JWT user login & registration logic
│   │   └── taskController.js     # Task CRUD with user scoping
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT token decoding & activity block validation
│   │   ├── errorHandler.js       # Centralized API error handling
│   │   └── roleMiddleware.js     # Restricts access to Admin-only endpoints
│   ├── models/
│   │   ├── ActivityLog.js        # Schema for logging user actions
│   │   ├── Task.js               # Schema for tasks (with cascading hooks)
│   │   └── User.js               # Schema for users (role, status, password hashing)
│   ├── routes/
│   │   ├── activityRoutes.js     # Routes for fetching activity logs
│   │   ├── adminRoutes.js        # Admin actions (stats, status, users CRUD)
│   │   ├── authRoutes.js         # Routes for sign-in and sign-up
│   │   └── taskRoutes.js         # Routes for task management
│   ├── utils/
│   │   ├── generateToken.js      # JWT token sign utility
│   │   ├── logger.js             # Helper function for adding activity logs
│   │   └── seedAdmin.js          # Database seeder for admin accounts
│   ├── .env                      # Local environment configurations (ignored)
│   ├── package.json              # Backend package definitions & scripts
│   └── server.js                 # Main server entrypoint
│
├── frontend/
│   ├── public/                   # Public assets & icons
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Custom Axios client with request & response interceptors
│   │   ├── components/
│   │   │   ├── admin/            # Activity, Task, and User tables for Admin
│   │   │   ├── common/           # Collapsible Sidebar, Loader, ProtectedRoute, StatsCard, Navbar
│   │   │   └── tasks/            # Task Card layouts, Task creation/edit modals
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global Authentication context provider
│   │   ├── hooks/
│   │   │   └── useAuth.js        # Simplifies access to auth variables
│   │   ├── pages/
│   │   │   ├── admin/            # Screens: ActivityLogs, AdminDashboard, TaskMonitoring, UserManagement
│   │   │   ├── auth/             # Screens: Login, Register
│   │   │   └── user/             # Screens: MyTasks, TaskDetail, UserDashboard
│   │   ├── App.css               # Dynamic layouts and element stylings
│   │   ├── App.jsx               # Routes configuration and path layout setup
│   │   ├── index.css             # Main stylesheet (color variables, scrollbars, glassmorphism templates)
│   │   └── main.jsx              # React app mounting root
│   ├── package.json              # Frontend package definitions & scripts
│   └── vite.config.js            # Dev proxy configuration (maps /api to port 5000)
│
└── README.md                     # Project documentation (this file)
```

---

## 🛠️ Tech Stack

* **Frontend**: React 19, React Router v7, Axios, Recharts, React Icons, React Toastify, Vite.
* **Backend**: Node.js, Express.js, Mongoose, JSON Web Token (JWT), BcryptJS, Morgan.
* **Database**: MongoDB (Atlas Cloud Cluster).

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **MongoDB** (Atlas connection string or local MongoDB instance running)

---

### Step 1: Clone or Open the Repository
```bash
cd assignment21May
```

---

### Step 2: Configure and Run Backend

1. **Navigate to the Backend Folder**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` directory:
   ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/task_tracking_db?retryWrites=true&w=majority
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d
   ```

4. **Seed the Administrator Account**:
   Populate the database with the default administrative credential:
   ```bash
   npm run seed
   ```
   *Seeded Admin Credentials:*
   * **Email**: `admin@example.com`
   * **Password**: `Admin@123`

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### Step 3: Configure and Run Frontend

1. **Open a New Terminal and Navigate to the Frontend Folder**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will spin up on `http://localhost:3000` and proxy API calls seamlessly to `http://localhost:5000/api`.

---

## 🧪 Integration Testing & Verification

The project includes an end-to-end programmatic verification script. This script verifies full functionality by simulating admin actions, registering users, checking task CRUD operations, toggling user statuses, checking token session eviction, and verifying database cascading triggers.

To run the verification suite:
1. Ensure the **backend server** is running on port `5000`.
2. Locate the verification script path or create/run a script with the test steps.
3. Run the node verification script:
   ```bash
   # Run the integration test suite
   node tests/verify.js
   ```


All tests should output `✅` and finish with `🌟 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🌟`.
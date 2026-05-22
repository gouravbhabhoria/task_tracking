import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Dashboard & Pages
import UserDashboard from './pages/user/UserDashboard';
import MyTasks from './pages/user/MyTasks';
import TaskDetail from './pages/user/TaskDetail';

// Admin Dashboard & Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TaskMonitoring from './pages/admin/TaskMonitoring';
import ActivityLogs from './pages/admin/ActivityLogs';

import useAuth from './hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Home redirect helper
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' 
    ? <Navigate to="/admin" replace /> 
    : <Navigate to="/dashboard" replace />;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="dashboard-layout">
        {user && <Sidebar />}
        
        <main className="main-content">
          <Routes>
            {/* Base Routes */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Regular User Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/tasks" 
              element={
                <ProtectedRoute>
                  <MyTasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/tasks/:id" 
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              } 
            />

            {/* Admin Dashboard Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tasks" 
              element={
                <ProtectedRoute adminOnly>
                  <TaskMonitoring />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/activities" 
              element={
                <ProtectedRoute adminOnly>
                  <ActivityLogs />
                </ProtectedRoute>
              } 
            />

            {/* Redirect any other paths to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global alert toasts */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;

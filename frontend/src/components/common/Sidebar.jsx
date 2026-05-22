import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  FiGrid, 
  FiCheckSquare, 
  FiUsers, 
  FiActivity, 
  FiMonitor,
  FiTrendingUp
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {isAdmin ? (
          <>
            <li>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiTrendingUp />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiUsers />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/tasks" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiMonitor />
                <span>Tasks</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/activities" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiActivity />
                <span>Activity Audit</span>
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink 
                to="/dashboard" 
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiGrid />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard/tasks" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FiCheckSquare />
                <span>My Tasks</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;

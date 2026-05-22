import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FiLogOut, FiUser, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAdmin ? '/admin' : '/dashboard'}>
          📋 TaskManager
        </Link>
      </div>

      {user && (
        <div className="navbar-right">
          <div className="user-info">
            {isAdmin ? <FiShield /> : <FiUser />}
            <span className="user-name">{user.name}</span>
            <span className={`role-badge ${user.role}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

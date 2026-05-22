import { useState, useEffect } from 'react';
import { FiSearch, FiUsers, FiFilter } from 'react-icons/fi';
import API from '../../api/axios';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Query parameters
      const params = {};
      if (search.trim()) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const { data } = await API.get('/admin/users', { params });
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { data } = await API.put(`/admin/users/${userId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`User account successfully ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will permanently remove their account and delete all tasks associated with them. Are you sure you want to proceed?')) {
      return;
    }
    try {
      const { data } = await API.delete(`/admin/users/${userId}`);
      if (data.success) {
        toast.success('User and associated tasks successfully deleted');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', textAlign: 'left' }}>User Directory</h1>
          <p style={{ textAlign: 'left' }}>Manage system user authentication status, credentials and authorizations</p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
            Search
          </button>

          {/* Filter options */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <FiFilter style={{ color: 'var(--text-muted)' }} />
            
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: '130px', padding: '8px 12px' }}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '130px', padding: '8px 12px' }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

        </form>
      </div>

      {/* User listing */}
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <FiUsers style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No registered users found matching the query.
          </p>
        </div>
      ) : (
        <UserTable
          users={users}
          onToggleStatus={handleToggleStatus}
          onDeleteUser={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default UserManagement;

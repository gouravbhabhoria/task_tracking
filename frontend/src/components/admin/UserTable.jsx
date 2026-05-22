import PropTypes from 'prop-types';
import { FiTrash2, FiUserCheck, FiUserX, FiCalendar } from 'react-icons/fi';

const UserTable = ({ users, onToggleStatus, onDeleteUser }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="table-container fade-in">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td style={{ fontWeight: 600 }}>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge ${u.role}`}>
                  {u.role.toUpperCase()}
                </span>
              </td>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FiCalendar /> {formatDate(u.createdAt)}
                </span>
              </td>
              <td>
                <span className={`badge ${u.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                  {u.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {u.role !== 'admin' && (
                    <>
                      <button
                        className={`task-btn-icon ${u.status === 'active' ? 'delete' : 'edit'}`}
                        onClick={() => onToggleStatus(u._id, u.status)}
                        title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.status === 'active' ? <FiUserX /> : <FiUserCheck />}
                      </button>
                      <button
                        className="task-btn-icon delete"
                        onClick={() => onDeleteUser(u._id)}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};

export default UserTable;

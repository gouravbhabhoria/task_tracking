import PropTypes from 'prop-types';
import { FiClock, FiUser, FiActivity } from 'react-icons/fi';

const ActivityTable = ({ activities }) => {
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionBadgeColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'badge-active';
    if (actionLower.includes('delete') || actionLower.includes('deactivate')) return 'badge-inactive';
    if (actionLower.includes('create')) return 'badge-low';
    if (actionLower.includes('update')) return 'badge-medium';
    return 'badge-pending';
  };

  return (
    <div className="table-container fade-in">
      <table className="custom-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>IP Address</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a._id}>
              <td>
                {a.user ? (
                  <>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <FiUser style={{ color: 'var(--accent-purple)' }} />
                      {a.user.name}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '18px' }}>
                      {a.user.email}
                    </div>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>System / Guest</span>
                )}
              </td>
              <td>
                <span className={`badge ${getActionBadgeColor(a.action)}`} style={{ textTransform: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FiActivity />
                  {a.action}
                </span>
              </td>
              <td>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {a.details}
                </span>
              </td>
              <td>
                <code style={{ fontSize: '0.8rem' }}>{a.ipAddress || 'Unknown'}</code>
              </td>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <FiClock /> {formatDateTime(a.createdAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ActivityTable.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      action: PropTypes.string.isRequired,
      details: PropTypes.string.isRequired,
      ipAddress: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default ActivityTable;

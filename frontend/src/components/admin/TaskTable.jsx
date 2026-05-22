import PropTypes from 'prop-types';
import { FiCalendar, FiUser } from 'react-icons/fi';

const TaskTable = ({ tasks }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
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
            <th>Task Title</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td style={{ fontWeight: 600 }}>{t.title}</td>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FiUser style={{ color: 'var(--accent-purple)' }} />
                  {t.user?.name || 'Unassigned (Obsolete User)'}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '18px' }}>
                  {t.user?.email || ''}
                </div>
              </td>
              <td>
                <span className={`badge badge-${t.priority}`}>{t.priority}</span>
              </td>
              <td>
                <span className={`badge badge-${t.status}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </td>
              <td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FiCalendar /> {formatDate(t.dueDate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      dueDate: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default TaskTable;

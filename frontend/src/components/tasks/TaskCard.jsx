import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiCalendar, FiEdit, FiTrash, FiEye } from 'react-icons/fi';
import './Tasks.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (e) => {
    onStatusChange(_id, e.target.value);
  };

  return (
    <div className="task-card">
      <div>
        <div className="task-header">
          <h4 className="task-title">{title}</h4>
        </div>
        
        <div className="task-badges">
          <span className={`badge badge-${priority}`}>{priority}</span>
          <span className={`badge badge-${status}`}>
            {status.replace('_', ' ')}
          </span>
        </div>

        <p className="task-desc">{description}</p>
      </div>

      <div>
        <div style={{ marginBottom: '14px', textAlign: 'left' }}>
          <select 
            className="form-select" 
            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            value={status}
            onChange={handleStatusChange}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="task-footer">
          <div className="task-due-date">
            <FiCalendar />
            <span>{formatDate(dueDate)}</span>
          </div>

          <div className="task-actions">
            <Link to={`/dashboard/tasks/${_id}`} className="task-btn-icon" title="View Details">
              <FiEye />
            </Link>
            {onEdit && (
              <button 
                onClick={() => onEdit(task)} 
                className="task-btn-icon edit" 
                title="Edit Task"
              >
                <FiEdit />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(_id)} 
                className="task-btn-icon delete" 
                title="Delete Task"
              >
                <FiTrash />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func.isRequired,
};

export default TaskCard;

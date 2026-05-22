import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const { data } = await API.get(`/tasks/${id}`);
        if (data.success) {
          setTask(data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch task details');
        navigate('/dashboard/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No limit';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle style={{ color: 'var(--success)' }} />;
      case 'in_progress': return <FiClock style={{ color: 'var(--warning)' }} />;
      default: return <FiAlertTriangle style={{ color: 'var(--accent-blue)' }} />;
    }
  };

  return (
    <div className="task-detail-container fade-in">
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Link to="/dashboard/tasks" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '8px' }}>
          <FiArrowLeft /> Back to Tasks
        </Link>
      </div>

      <div className="task-detail-card">
        <div className="task-detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem', textAlign: 'left', background: 'linear-gradient(135deg, var(--text-primary), #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {task.title}
            </h1>
            <div className="task-detail-meta">
              <span className={`badge badge-${task.priority}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Priority: {task.priority}
              </span>
              <span className={`badge badge-${task.status}`} style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                {getStatusIcon(task.status)}
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="task-detail-body">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)', textAlign: 'left' }}>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="task-detail-info-row">
          <div className="task-detail-info-item">
            <label>Due Date</label>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <FiCalendar /> {formatDate(task.dueDate)}
            </span>
          </div>

          <div className="task-detail-info-item">
            <label>Created On</label>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <FiCalendar /> {formatDate(task.createdAt)}
            </span>
          </div>

          <div className="task-detail-info-item">
            <label>Last Updated</label>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <FiClock /> {formatDate(task.updatedAt)}
            </span>
          </div>
        </div>

        <div className="task-detail-footer">
          <Link to={`/dashboard/tasks`} className="btn btn-primary">
            Edit in Task Manager
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

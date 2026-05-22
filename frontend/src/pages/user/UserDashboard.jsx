import { useState, useEffect } from 'react';
import { FiCheckSquare, FiClock, FiAlertCircle, FiPlus, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import TaskForm from '../../components/tasks/TaskForm';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const { data } = await API.post('/tasks', taskData);
      if (data.success) {
        toast.success('Task created successfully');
        setIsModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  if (loading) return <Loader />;

  // Calculate metrics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const urgentTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').slice(0, 3);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', textAlign: 'left' }}>My Workspace</h1>
          <p style={{ textAlign: 'left' }}>Overview of your current deliverables and task progression</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FiPlus /> Create Task
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <StatsCard 
          title="Total Tasks" 
          value={totalTasks} 
          icon={<FiGrid />} 
          color="purple" 
        />
        <StatsCard 
          title="Pending" 
          value={pendingTasks} 
          icon={<FiAlertCircle />} 
          color="blue" 
        />
        <StatsCard 
          title="In Progress" 
          value={inProgressTasks} 
          icon={<FiClock />} 
          color="teal" 
        />
        <StatsCard 
          title="Completed" 
          value={completedTasks} 
          icon={<FiCheckSquare />} 
          color="pink" 
        />
      </div>

      <div className="dashboard-grid">
        {/* Urgent deliverables */}
        <div className="glass-card">
          <h2 className="section-title">
            <FiAlertCircle style={{ color: 'var(--danger)' }} /> Critical Attention Tasks
          </h2>
          {urgentTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              No critical or high-priority pending tasks. Keep it up!
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentTasks.map((task) => (
                    <tr key={task._id}>
                      <td style={{ fontWeight: 600 }}>{task.title}</td>
                      <td>
                        <span className="badge badge-high">{task.priority}</span>
                      </td>
                      <td>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No limit'}
                      </td>
                      <td>
                        <Link to={`/dashboard/tasks/${task._id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Nav Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <FiCheckSquare style={{ fontSize: '3.5rem', color: 'var(--accent-purple)' }} />
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Organize Deliverables</h3>
          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Access all your tasks to update statuses, write descriptions, or delete obsolete entries.
          </p>
          <Link to="/dashboard/tasks" className="btn btn-primary" style={{ width: '100%' }}>
            Manage Tasks
          </Link>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default UserDashboard;

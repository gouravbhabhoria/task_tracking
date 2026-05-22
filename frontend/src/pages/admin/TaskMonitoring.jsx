import { useState, useEffect } from 'react';
import { FiSearch, FiLayers, FiFilter } from 'react-icons/fi';
import API from '../../api/axios';
import TaskTable from '../../components/admin/TaskTable';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const TaskMonitoring = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const { data } = await API.get('/admin/tasks', { params });
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch global tasks list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', textAlign: 'left' }}>Task Monitoring</h1>
          <p style={{ textAlign: 'left' }}>Audit, review, and track deliverables across all user accounts</p>
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
              placeholder="Search by task title or description..."
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '140px', padding: '8px 12px' }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: '140px', padding: '8px 12px' }}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

        </form>
      </div>

      {/* Tasks listing */}
      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <FiLayers style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No tasks registered in the system match these criteria.
          </p>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
};

export default TaskMonitoring;

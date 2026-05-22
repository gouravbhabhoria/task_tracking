import { useState, useEffect } from 'react';
import { FiActivity, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../../api/axios';
import ActivityTable from '../../components/admin/ActivityTable';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
      };
      if (actionFilter) params.action = actionFilter;

      const { data } = await API.get('/activities', { params });
      if (data.success) {
        setLogs(data.data);
        setTotalPages(data.pagination.pages);
        setTotalCount(data.pagination.total);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter]);

  const handleActionChange = (e) => {
    setActionFilter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', textAlign: 'left' }}>System Audit Logs</h1>
          <p style={{ textAlign: 'left' }}>Audit trail records of logins, CRUD operations, and administrative overrides</p>
        </div>
      </div>

      {/* Filters section */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter style={{ color: 'var(--text-muted)' }} />
            <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Filter Action:</label>
            <select
              className="form-select"
              value={actionFilter}
              onChange={handleActionChange}
              style={{ width: '220px', padding: '8px 12px' }}
            >
              <option value="">All Actions</option>
              <option value="USER_REGISTERED">User Registration</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILURE">Login Failure</option>
              <option value="TASK_CREATED">Task Creation</option>
              <option value="TASK_UPDATED">Task Updates</option>
              <option value="TASK_DELETED">Task Deletion</option>
              <option value="USER_STATUS_CHANGED">User Status Changed</option>
              <option value="USER_DELETED">User Deleted</option>
            </select>
          </div>
          
          <div style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Found {totalCount} total audit records.
          </div>
        </div>
      </div>

      {/* Table view */}
      {loading ? (
        <Loader />
      ) : logs.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <FiActivity style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No activity records recorded under this action.
          </p>
        </div>
      ) : (
        <>
          <ActivityTable activities={logs} />
          
          {/* Pagination controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
              style={{ display: 'inline-flex', gap: '6px', padding: '8px 14px' }}
            >
              <FiChevronLeft /> Previous
            </button>
            
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
              disabled={page === totalPages}
              style={{ display: 'inline-flex', gap: '6px', padding: '8px 14px' }}
            >
              Next <FiChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogs;

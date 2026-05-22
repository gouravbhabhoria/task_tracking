import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiLayers, 
  FiCheckCircle, 
  FiShield, 
  FiTrendingUp, 
  FiActivity, 
  FiCalendar 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';
import API from '../../api/axios';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const COLORS = {
  pending: '#3b82f6',
  inProgress: '#f59e0b',
  completed: '#10b981',
  low: '#14b8a6',
  medium: '#f59e0b',
  high: '#ef4444'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (!stats) return <div style={{ padding: '40px', textAlign: 'center' }}>No stats data loaded.</div>;

  // Prepare chart data
  const statusData = [
    { name: 'Pending', value: stats.tasks.pending || 0, color: COLORS.pending },
    { name: 'In Progress', value: stats.tasks.inProgress || 0, color: COLORS.inProgress },
    { name: 'Completed', value: stats.tasks.completed || 0, color: COLORS.completed }
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'Low', count: stats.tasksByPriority?.low || 0, color: COLORS.low },
    { name: 'Medium', count: stats.tasksByPriority?.medium || 0, color: COLORS.medium },
    { name: 'High', count: stats.tasksByPriority?.high || 0, color: COLORS.high }
  ];

  const trendData = stats.tasksPerDay.map(day => ({
    date: day._id,
    count: day.count
  }));

  // Calculations
  const totalTasks = stats.tasks.total || 0;
  const completedCount = stats.tasks.completed || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '2rem', textAlign: 'left' }}>Admin Control Center</h1>
          <p style={{ textAlign: 'left' }}>System aggregates, user compliance tracking, and activity audits</p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="stats-grid">
        <StatsCard 
          title="Total Users" 
          value={stats.users.total} 
          icon={<FiUsers />} 
          color="purple" 
        />
        <StatsCard 
          title="Active Sessions" 
          value={stats.users.active} 
          icon={<FiShield />} 
          color="blue" 
        />
        <StatsCard 
          title="Total Tasks" 
          value={totalTasks} 
          icon={<FiLayers />} 
          color="teal" 
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${completionRate}%`} 
          icon={<FiCheckCircle />} 
          color="pink" 
        />
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Task Status Share */}
        <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="section-title"><FiCheckCircle /> Task Statuses</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            {statusData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No task distributions to plot.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Density */}
        <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="section-title"><FiTrendingUp /> Task Priorities</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="var(--accent-purple)">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Over Time */}
        <div className="glass-card" style={{ height: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="section-title"><FiCalendar /> Setup Activity Trend</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            {trendData.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No creation history for past 7 days.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="count" name="Tasks Created" stroke="#c084fc" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activities Section */}
      <div className="glass-card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            <FiActivity style={{ color: 'var(--accent-pink)' }} /> Real-time Audit Trail (Recent)
          </h2>
          <Link to="/admin/activities" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            Full Logs
          </Link>
        </div>

        {stats.recentActivities?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No security logs recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivities.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.user ? log.user.name : 'System/Guest'}
                      </span>
                      {log.user && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.user.email}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-medium" style={{ textTransform: 'none', fontSize: '0.7rem' }}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.details}</td>
                    <td>{formatDateTime(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

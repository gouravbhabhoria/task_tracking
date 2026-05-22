import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon, color = 'purple' }) => {
  return (
    <div className="glass-card stats-card">
      <div className="stats-info">
        <h3>{title}</h3>
        <div className="stats-value">{value}</div>
      </div>
      <div className={`stats-icon ${color}`}>
        {icon}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string,
};

export default StatsCard;

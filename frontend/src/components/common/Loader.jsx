const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading system resources...</p>
      </div>
    </div>
  );
};

export default Loader;

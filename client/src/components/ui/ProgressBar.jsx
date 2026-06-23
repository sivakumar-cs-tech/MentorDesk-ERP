
const ProgressBar = ({ value, max = 100, label }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="progress-bar-wrap">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;

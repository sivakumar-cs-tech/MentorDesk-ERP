
const STATUS_STYLES = {
  Active: "badge-success",
  Completed: "badge-primary",
  Inactive: "badge-muted",
  Present: "badge-success",
  Absent: "badge-danger",
  Leave: "badge-warning",
  Late: "badge-warning",
  "In Progress": "badge-primary",
  "Pending Practice": "badge-warning",
  "Practice Completed": "badge-info",
  Completed: "badge-success",
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${STATUS_STYLES[status] || "badge-muted"}`}>
    {status}
  </span>
);

export default StatusBadge;


const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="empty-state">
    {Icon && <Icon size={32} />}
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

export default EmptyState;


const PageHeader = ({ title, subtitle, children }) => (
  <div className="page-header">
    <div className="page-header-text">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {children && <div className="page-header-actions">{children}</div>}
  </div>
);

export default PageHeader;

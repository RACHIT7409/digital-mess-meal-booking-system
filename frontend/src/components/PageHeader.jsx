const PageHeader = ({ title, subtitle, rightContent }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 fade-in">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {rightContent && <div className="flex flex-wrap gap-3">{rightContent}</div>}
    </div>
  );
};

export default PageHeader;
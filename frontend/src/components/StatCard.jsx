const StatCard = ({ title, value, icon, hint }) => {
  return (
    <div className="stat-card fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <h2 className="stat-value">{value}</h2>
          {hint && <p className="text-xs text-green-600 mt-2">{hint}</p>}
        </div>

        {icon && (
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
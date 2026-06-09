import { Link } from "react-router-dom";

const ActionCard = ({ to, title, description, icon }) => {
  return (
    <Link to={to} className="action-card block fade-in">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
            {icon}
          </div>
        )}

        <div>
          <h2 className="action-title">{title}</h2>
          <p className="action-text">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ActionCard;
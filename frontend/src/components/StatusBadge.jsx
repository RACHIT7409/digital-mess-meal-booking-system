const StatusBadge = ({ status }) => {
  const getClassName = () => {
    if (!status) return "badge-gray";

    const value = status.toUpperCase();

    if (
      value === "CONFIRMED" ||
      value === "ACTIVE" ||
      value === "APPROVED" ||
      value === "COMPLETED"
    ) {
      return "badge-success";
    }

    if (value === "PAID" || value === "SERVED") {
      return "badge-blue";
    }

    if (
      value === "PENDING" ||
      value === "PENDING_PAYMENT" ||
      value === "REQUESTED" ||
      value === "REFUND_REQUESTED"
    ) {
      return "badge-warning";
    }

    if (
      value === "FAILED" ||
      value === "CANCELLED" ||
      value === "REJECTED" ||
      value === "NOT_SERVED"
    ) {
      return "badge-danger";
    }

    return "badge-gray";
  };

  return <span className={`status-badge ${getClassName()}`}>{status}</span>;
};

export default StatusBadge;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const MyRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const fetchRefunds = async () => {
    try {
      const res = await API.get("/refunds/my-refunds");
      setRefunds(res.data.refunds);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch refunds");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading refunds...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="My Refunds"
        subtitle="Track your refund requests and approval status."
        rightContent={
          <Link to="/student/bookings" className="btn-primary flex items-center gap-2">
            <FiArrowLeft />
            My Bookings
          </Link>
        }
      />

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>
      )}

      {refunds.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiRefreshCw className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No refund requests found</h2>
          <p className="text-slate-500 mt-2">
            Your refund requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {refunds.map((refund) => (
            <div key={refund._id} className="pro-card p-6 fade-in">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Meal</p>
                  <h2 className="text-xl font-extrabold">
                    {refund.booking?.mealName ||
                      refund.booking?.meal?.mealName ||
                      "Meal"}
                  </h2>
                </div>

                <StatusBadge status={refund.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <h3 className="font-bold">₹{refund.amount}</h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Requested</p>
                  <h3 className="font-bold">{formatDate(refund.requestedAt)}</h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Refund Method</p>
                  <h3 className="font-bold">{refund.refundMethod || "-"}</h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Razorpay Status</p>
                  <h3 className="font-bold">
                    {refund.razorpayRefundStatus || "-"}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-slate-500 mb-1">Reason</p>
                <p className="font-medium">{refund.reason}</p>
              </div>

              {refund.adminRemark && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-bold mb-1">
                    Admin/Manager Remark
                  </p>
                  <p>{refund.adminRemark}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyRefunds;
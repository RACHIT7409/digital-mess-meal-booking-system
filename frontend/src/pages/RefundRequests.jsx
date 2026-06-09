import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const RefundRequests = () => {
  const [refunds, setRefunds] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchRefunds = async () => {
    try {
      setPageLoading(true);
      const res = await API.get("/refunds");
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

  const handleRemarkChange = (refundId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [refundId]: value,
    }));
  };

  const handleApprove = async (refundId, mode = "razorpay") => {
    const confirmApprove = window.confirm(
      mode === "manual"
        ? "Approve this refund manually?"
        : "Initiate Razorpay refund for this request?"
    );

    if (!confirmApprove) return;

    setError("");
    setSuccess("");
    setLoadingId(refundId);

    try {
      const url =
        mode === "manual"
          ? `/refunds/${refundId}/approve-manual`
          : `/refunds/${refundId}/approve`;

      await API.patch(url, {
        adminRemark:
          remarks[refundId] ||
          (mode === "manual"
            ? "Manual refund approved"
            : "Razorpay refund approved"),
      });

      setSuccess(
        mode === "manual"
          ? "Manual refund approved successfully."
          : "Razorpay refund initiated successfully."
      );

      fetchRefunds();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve refund");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (refundId) => {
    const adminRemark = remarks[refundId];

    if (!adminRemark || adminRemark.trim().length < 5) {
      setError("Please enter a proper rejection remark");
      return;
    }

    const confirmReject = window.confirm(
      "Are you sure you want to reject this refund request?"
    );

    if (!confirmReject) return;

    setError("");
    setSuccess("");
    setLoadingId(refundId);

    try {
      await API.patch(`/refunds/${refundId}/reject`, {
        adminRemark,
      });

      setSuccess("Refund rejected successfully.");
      fetchRefunds();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject refund");
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString("en-IN");
  };

  if (pageLoading) {
    return (
      <main className="page-container">
        <div className="glass-card p-6">Loading refund requests...</div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <PageHeader
        title="Refund Requests"
        subtitle="Review student refund requests, approve Razorpay refunds, or reject invalid claims."
        rightContent={
          <>
            <button
              onClick={fetchRefunds}
              className="btn-primary flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <Link
              to="/manager/dashboard"
              className="btn-dark flex items-center gap-2"
            >
              <FiArrowLeft />
              Back
            </Link>
          </>
        }
      />

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>
      )}

      {success && (
        <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-4">
          {success}
        </p>
      )}

      {refunds.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiRefreshCw className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No refund requests found</h2>
          <p className="text-slate-500 mt-2">
            Student refund requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-5">
          {refunds.map((refund) => (
            <div key={refund._id} className="pro-card p-6 fade-in">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm text-slate-500">Student</p>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {refund.student?.name || "Student"}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Roll No:{" "}
                    <span className="font-bold text-slate-700">
                      {refund.student?.rollNumber || "-"}
                    </span>
                  </p>
                </div>

                <StatusBadge status={refund.status} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Meal</p>
                  <h3 className="font-extrabold mt-1">
                    {refund.booking?.mealName ||
                      refund.booking?.meal?.mealName ||
                      "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Amount</p>
                  <h3 className="font-extrabold mt-1">₹{refund.amount}</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Requested At</p>
                  <h3 className="font-extrabold mt-1">
                    {formatDate(refund.requestedAt)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Hostel / Room</p>
                  <h3 className="font-extrabold mt-1">
                    {refund.student?.hostel || "-"} /{" "}
                    {refund.student?.roomNumber || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Refund Method</p>
                  <h3 className="font-extrabold mt-1">
                    {refund.refundMethod || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Razorpay Status</p>
                  <h3 className="font-extrabold mt-1">
                    {refund.razorpayRefundStatus || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Razorpay Refund ID</p>
                  <h3 className="font-mono text-xs font-bold break-all mt-1">
                    {refund.razorpayRefundId || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 sm:col-span-2">
                  <p className="text-sm text-slate-500">Processed By</p>
                  <h3 className="font-extrabold mt-1">
                    {refund.processedBy?.name || "-"}
                  </h3>

                  {refund.processedAt && (
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDateTime(refund.processedAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
                <p className="text-sm text-orange-700 font-extrabold mb-1">
                  Student Reason
                </p>
                <p className="text-slate-800">{refund.reason}</p>
              </div>

              {refund.adminRemark && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-blue-700 font-extrabold mb-1">
                    Admin/Manager Remark
                  </p>
                  <p className="text-slate-800">{refund.adminRemark}</p>
                </div>
              )}

              {refund.failureReason && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-red-700 font-extrabold mb-1">
                    Failure Reason
                  </p>
                  <p className="text-slate-800">{refund.failureReason}</p>
                </div>
              )}

              {refund.status === "REQUESTED" && (
                <div className="border-t border-slate-200 pt-5">
                  <label className="block font-bold text-slate-700 mb-2">
                    Admin/Manager Remark
                  </label>

                  <textarea
                    value={remarks[refund._id] || ""}
                    onChange={(e) =>
                      handleRemarkChange(refund._id, e.target.value)
                    }
                    className="w-full mb-4"
                    rows="3"
                    placeholder="Write approval/rejection remark..."
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(refund._id, "razorpay")}
                      disabled={loadingId === refund._id}
                      className="btn-success flex items-center gap-2"
                    >
                      <FiCheckCircle />
                      {loadingId === refund._id
                        ? "Processing..."
                        : "Approve Razorpay"}
                    </button>

                    <button
                      onClick={() => handleApprove(refund._id, "manual")}
                      disabled={loadingId === refund._id}
                      className="btn-dark flex items-center gap-2"
                    >
                      <FiCheckCircle />
                      Manual Approve
                    </button>

                    <button
                      onClick={() => handleReject(refund._id)}
                      disabled={loadingId === refund._id}
                      className="btn-danger flex items-center gap-2"
                    >
                      <FiXCircle />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {refund.status !== "REQUESTED" && (
                <div className="border-t border-slate-200 pt-4 text-sm text-slate-500">
                  This refund request is already processed.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default RefundRequests;
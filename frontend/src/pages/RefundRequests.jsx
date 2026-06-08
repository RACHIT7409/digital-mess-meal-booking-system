import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const RefundRequests = () => {
  const [refunds, setRefunds] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchRefunds = async () => {
    try {
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
    setError("");
    setSuccess("");
    setLoading(true);

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
      setLoading(false);
    }
  };

  const handleReject = async (refundId) => {
    const adminRemark = remarks[refundId];

    if (!adminRemark || adminRemark.trim().length < 5) {
      setError("Please enter a proper rejection remark");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.patch(`/refunds/${refundId}/reject`, {
        adminRemark,
      });

      setSuccess("Refund rejected successfully.");
      fetchRefunds();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject refund");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  if (pageLoading) {
    return (
      <div className="p-6">
        <p>Loading refund requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          Refund Requests
        </h1>

        <Link
          to="/manager/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      {refunds.length === 0 ? (
        <div className="bg-white shadow rounded p-6">
          <p>No refund requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {refunds.map((refund) => (
            <div key={refund._id} className="bg-white shadow rounded p-5">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Student</p>
                  <h2 className="font-bold">{refund.student?.name}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Roll No.</p>
                  <h2 className="font-bold">{refund.student?.rollNumber}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Meal</p>
                  <h2 className="font-bold">
                    {refund.booking?.mealName ||
                      refund.booking?.meal?.mealName ||
                      "-"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <h2 className="font-bold">₹{refund.amount}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Requested At</p>
                  <h2 className="font-bold">
                    {formatDate(refund.requestedAt)}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <h2 className="font-bold">{refund.status}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Hostel/Room</p>
                  <h2 className="font-bold">
                    {refund.student?.hostel || "-"} /{" "}
                    {refund.student?.roomNumber || "-"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Processed By</p>
                  <h2 className="font-bold">
                    {refund.processedBy?.name || "-"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Refund Method</p>
                  <h2 className="font-bold">{refund.refundMethod || "-"}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Razorpay Refund</p>
                  <h2 className="font-bold break-all text-xs">
                    {refund.razorpayRefundId || "-"}
                  </h2>
                </div>
              </div>

              <p className="mb-2">
                <strong>Student Reason:</strong> {refund.reason}
              </p>

              {refund.razorpayRefundStatus && (
                <p className="mb-2">
                  <strong>Razorpay Refund Status:</strong>{" "}
                  {refund.razorpayRefundStatus}
                </p>
              )}

              {refund.adminRemark && (
                <p className="mb-3">
                  <strong>Admin/Manager Remark:</strong>{" "}
                  {refund.adminRemark}
                </p>
              )}

              {refund.status === "REQUESTED" && (
                <div className="border-t pt-4">
                  <label className="block font-medium mb-2">
                    Admin/Manager Remark
                  </label>

                  <textarea
                    value={remarks[refund._id] || ""}
                    onChange={(e) =>
                      handleRemarkChange(refund._id, e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded mb-3"
                    rows="2"
                    placeholder="Write approval/rejection remark..."
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(refund._id, "razorpay")}
                      disabled={loading}
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
                    >
                      Approve Razorpay Refund
                    </button>

                    <button
                      onClick={() => handleApprove(refund._id, "manual")}
                      disabled={loading}
                      className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
                    >
                      Approve Manual Refund
                    </button>

                    <button
                      onClick={() => handleReject(refund._id)}
                      disabled={loading}
                      className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 disabled:bg-gray-400"
                    >
                      Reject Refund
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundRequests;
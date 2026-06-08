import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

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
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  if (pageLoading) {
    return (
      <div className="p-6">
        <p>Loading refunds...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">My Refunds</h1>

        <Link
          to="/student/bookings"
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          My Bookings
        </Link>
      </div>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
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
                  <p className="text-gray-500 text-sm">Meal</p>
                  <h2 className="font-bold">
                    {refund.booking?.mealName ||
                      refund.booking?.meal?.mealName ||
                      "Meal"}
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <h2 className="font-bold">₹{refund.amount}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <h2 className="font-bold">{refund.status}</h2>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Requested</p>
                  <h2 className="font-bold">
                    {formatDate(refund.requestedAt)}
                  </h2>
                </div>
              </div>

              <p className="mb-2">
                <strong>Reason:</strong> {refund.reason}
              </p>

              {refund.adminRemark && (
                <p>
                  <strong>Admin Remark:</strong> {refund.adminRemark}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRefunds;
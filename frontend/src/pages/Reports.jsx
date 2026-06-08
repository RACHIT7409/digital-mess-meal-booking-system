import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const Reports = () => {
  const [reportType, setReportType] = useState("date-wise");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async (e) => {
    e.preventDefault();

    setError("");
    setReport([]);
    setLoading(true);

    try {
      let url = "";

      if (reportType === "date-wise") {
        if (!startDate || !endDate) {
          setError("Start date and end date are required for date-wise report");
          setLoading(false);
          return;
        }

        url = `/dashboard/date-wise?startDate=${startDate}&endDate=${endDate}`;
      } else {
        if (startDate && endDate) {
          url = `/dashboard/meal-wise?startDate=${startDate}&endDate=${endDate}`;
        } else {
          url = "/dashboard/meal-wise";
        }
      }

      const res = await API.get(url);
      setReport(res.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Reports</h1>

        <Link
          to="/admin/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <form onSubmit={fetchReport} className="bg-white shadow rounded p-5 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <select
            className="border px-3 py-2 rounded"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="date-wise">Date-wise Report</option>
            <option value="meal-wise">Meal-wise Report</option>
          </select>

          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            disabled={loading}
            className="bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </form>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {report.length === 0 ? (
        <div className="bg-white shadow rounded p-6">
          <p>No report data to show.</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">
                  {reportType === "date-wise" ? "Date" : "Meal"}
                </th>
                <th className="p-3 text-left">Total Bookings</th>
                <th className="p-3 text-left">Paid Bookings</th>
                <th className="p-3 text-left">Served Meals</th>
                <th className="p-3 text-left">Refunded</th>
                <th className="p-3 text-left">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {report.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">
                    {reportType === "date-wise"
                      ? formatDate(item._id)
                      : item._id}
                  </td>
                  <td className="p-3">{item.totalBookings}</td>
                  <td className="p-3">{item.paidBookings}</td>
                  <td className="p-3">{item.servedMeals}</td>
                  <td className="p-3">{item.refundedBookings}</td>
                  <td className="p-3">₹{item.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-yellow-100 text-yellow-800 p-4 rounded mt-6">
        <p>
          Note: Current revenue is calculated from bookings with payment status
          PAID. Refunded bookings are excluded from net revenue.
        </p>
      </div>
    </div>
  );
};

export default Reports;
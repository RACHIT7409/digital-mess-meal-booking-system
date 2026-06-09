import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import API from "../api/api";
import PageHeader from "../components/PageHeader";

const Reports = () => {
  const [reportType, setReportType] = useState("date-wise");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async (e) => {
    if (e) e.preventDefault();

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

  const getTotal = (key) => {
    return report.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  };

  const exportCSV = () => {
    if (report.length === 0) {
      setError("No report data available to export");
      return;
    }

    const headers = [
      reportType === "date-wise" ? "Date" : "Meal",
      "Total Bookings",
      "Paid Bookings",
      "Served Meals",
      "Refunded Bookings",
      "Revenue",
    ];

    const rows = report.map((item) => [
      reportType === "date-wise" ? formatDate(item._id) : item._id,
      item.totalBookings,
      item.paidBookings,
      item.servedMeals,
      item.refundedBookings,
      item.totalRevenue,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${reportType}-report.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="page-container">
      <PageHeader
        title="Reports"
        subtitle="Generate booking, revenue, served meal, and refund reports."
        rightContent={
          <Link
            to="/admin/dashboard"
            className="btn-dark flex items-center gap-2"
          >
            <FiArrowLeft />
            Back
          </Link>
        }
      />

      {error && (
        <p className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl mb-4">
          {error}
        </p>
      )}

      <form onSubmit={fetchReport} className="glass-card p-5 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FiFilter />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Report Filters
            </h2>
            <p className="text-sm text-slate-500">
              Select report type and date range.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Report Type
            </label>

            <select
              className="w-full"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="date-wise">Date-wise Report</option>
              <option value="meal-wise">Meal-wise Report</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Start Date
            </label>

            <div className="relative">
              <FiCalendar className="auth-icon" />
              <input
                type="date"
                className="auth-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2">
              End Date
            </label>

            <div className="relative">
              <FiCalendar className="auth-icon" />
              <input
                type="date"
                className="auth-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FiBarChart2 />
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </form>

      {report.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">Total Bookings</p>
                <h2 className="stat-value">{getTotal("totalBookings")}</h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FiBarChart2 />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">Paid Bookings</p>
                <h2 className="stat-value">{getTotal("paidBookings")}</h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center">
                <FiCreditCard />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">Served Meals</p>
                <h2 className="stat-value">{getTotal("servedMeals")}</h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <FiRefreshCw />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">Revenue</p>
                <h2 className="stat-value">₹{getTotal("totalRevenue")}</h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <FiCreditCard />
              </div>
            </div>
          </div>
        </div>
      )}

      {report.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <FiBarChart2 className="mx-auto text-4xl text-blue-700 mb-3" />
          <h2 className="text-xl font-extrabold">No report data to show</h2>
          <p className="text-slate-500 mt-2">
            Select filters and generate a report.
          </p>
        </div>
      ) : (
        <div className="table-card">
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {reportType === "date-wise"
                  ? "Date-wise Report"
                  : "Meal-wise Report"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {report.length} result rows.
              </p>
            </div>

            <button
              onClick={exportCSV}
              type="button"
              className="btn-success flex items-center justify-center gap-2"
            >
              <FiDownload />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-pro">
              <thead>
                <tr>
                  <th>{reportType === "date-wise" ? "Date" : "Meal"}</th>
                  <th>Total Bookings</th>
                  <th>Paid Bookings</th>
                  <th>Served Meals</th>
                  <th>Refunded</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {report.map((item) => (
                  <tr key={item._id}>
                    <td className="font-extrabold">
                      {reportType === "date-wise"
                        ? formatDate(item._id)
                        : item._id}
                    </td>
                    <td>{item.totalBookings}</td>
                    <td>{item.paidBookings}</td>
                    <td>{item.servedMeals}</td>
                    <td>{item.refundedBookings}</td>
                    <td className="font-extrabold">₹{item.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-2xl mt-6">
        <p className="font-bold">Note</p>
        <p className="text-sm mt-1">
          Current revenue is calculated from paid bookings. Refunded bookings
          are excluded from net revenue based on backend report logic.
        </p>
      </div>
    </main>
  );
};

export default Reports;
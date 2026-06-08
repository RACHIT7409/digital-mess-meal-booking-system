import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import QRScanner from "../components/QRScanner";

const QRVerification = () => {
  const [qrInput, setQrInput] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);
  const [scanMode, setScanMode] = useState("manual");
  const [autoVerify, setAutoVerify] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const extractQrToken = (inputValue = qrInput) => {
    const value = inputValue.trim();

    if (!value) return "";

    try {
      const parsed = JSON.parse(value);
      return parsed.qrToken || value;
    } catch {
      return value;
    }
  };

  const checkCouponByToken = async (qrToken) => {
    setError("");
    setSuccess("");
    setCouponDetails(null);
    setLoading(true);

    try {
      const res = await API.post("/qr/check", { qrToken });
      setCouponDetails(res.data.bookingDetails);
      setSuccess("Coupon details fetched successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to check coupon");

      if (err.response?.data?.bookingDetails) {
        setCouponDetails(err.response.data.bookingDetails);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCouponByToken = async (qrToken) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/qr/verify", { qrToken });
      setCouponDetails(res.data.bookingDetails);
      setSuccess("QR verified successfully. Meal marked as served.");
    } catch (err) {
      setError(err.response?.data?.message || "QR verification failed");

      if (err.response?.data?.bookingDetails) {
        setCouponDetails(err.response.data.bookingDetails);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCoupon = async () => {
    const qrToken = extractQrToken();

    if (!qrToken) {
      setError("Please enter QR token");
      return;
    }

    await checkCouponByToken(qrToken);
  };

  const handleVerifyCoupon = async () => {
    const qrToken = extractQrToken();

    if (!qrToken) {
      setError("Please enter QR token");
      return;
    }

    await verifyCouponByToken(qrToken);
  };

  const handleScanSuccess = async (decodedText) => {
    setQrInput(decodedText);

    const qrToken = extractQrToken(decodedText);

    if (!qrToken) {
      setError("Invalid QR code scanned");
      return;
    }

    if (autoVerify) {
      await verifyCouponByToken(qrToken);
    } else {
      await checkCouponByToken(qrToken);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleDateString("en-IN");
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "-";
    return new Date(dateValue).toLocaleString("en-IN");
  };

  const getStatusColor = (status) => {
    if (status === "CONFIRMED") return "text-green-700 bg-green-100";
    if (status === "SERVED") return "text-blue-700 bg-blue-100";
    if (status === "REFUND_REQUESTED") return "text-orange-700 bg-orange-100";
    if (status === "REFUNDED") return "text-purple-700 bg-purple-100";
    return "text-gray-700 bg-gray-100";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          QR Coupon Verification
        </h1>

        <Link
          to="/manager/dashboard"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setScanMode("manual")}
            className={`px-4 py-2 rounded ${
              scanMode === "manual"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Manual Token
          </button>

          <button
            onClick={() => setScanMode("camera")}
            className={`px-4 py-2 rounded ${
              scanMode === "camera"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Camera Scanner
          </button>

          <label className="flex items-center gap-2 ml-0 md:ml-4">
            <input
              type="checkbox"
              checked={autoVerify}
              onChange={(e) => setAutoVerify(e.target.checked)}
            />
            <span className="text-sm">
              Auto verify after scan
            </span>
          </label>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          If auto verify is off, scanning only checks coupon details. If auto
          verify is on, scanning directly marks the meal as served.
        </p>
      </div>

      {scanMode === "camera" && (
        <div className="mb-6">
          <QRScanner onScanSuccess={handleScanSuccess} />
        </div>
      )}

      {scanMode === "manual" && (
        <div className="bg-white shadow rounded p-6 mb-6">
          <label className="block font-medium mb-2">
            Paste QR Token or QR JSON
          </label>

          <textarea
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
            rows="4"
            placeholder='Example: {"qrToken":"abc123"} or directly paste token'
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCheckCoupon}
              disabled={loading}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
            >
              {loading ? "Checking..." : "Check Coupon"}
            </button>

            <button
              onClick={handleVerifyCoupon}
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify & Mark Served"}
            </button>
          </div>
        </div>
      )}

      {scanMode === "camera" && qrInput && (
        <div className="bg-white shadow rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Last scanned data:</p>
          <p className="break-all bg-gray-100 p-3 rounded text-sm">
            {qrInput}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={handleCheckCoupon}
              disabled={loading}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
            >
              Check Again
            </button>

            <button
              onClick={handleVerifyCoupon}
              disabled={loading}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
            >
              Verify & Mark Served
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {success && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </p>
      )}

      {couponDetails && (
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">Coupon Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <p>
              <strong>Student:</strong> {couponDetails.studentName}
            </p>

            <p>
              <strong>Roll Number:</strong> {couponDetails.rollNumber}
            </p>

            <p>
              <strong>Hostel:</strong> {couponDetails.hostel || "-"}
            </p>

            <p>
              <strong>Room:</strong> {couponDetails.roomNumber || "-"}
            </p>

            <p>
              <strong>Meal:</strong> {couponDetails.mealName}
            </p>

            <p>
              <strong>Meal Date:</strong>{" "}
              {formatDate(
                couponDetails.mealDate || couponDetails.bookedMealDate
              )}
            </p>

            <p>
              <strong>Amount:</strong> ₹{couponDetails.amount || "-"}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              {couponDetails.paymentStatus || "-"}
            </p>

            <p>
              <strong>Booking Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${getStatusColor(
                  couponDetails.bookingStatus
                )}`}
              >
                {couponDetails.bookingStatus || "-"}
              </span>
            </p>

            <p>
              <strong>Served At:</strong> {formatTime(couponDetails.servedAt)}
            </p>

            <p>
              <strong>Scanned By:</strong> {couponDetails.scannedBy || "-"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRVerification;
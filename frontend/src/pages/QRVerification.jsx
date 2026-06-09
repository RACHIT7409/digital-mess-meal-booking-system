import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiEye,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import API from "../api/api";
import QRScanner from "../components/QRScanner";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

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
      setError("Please enter QR token or scan QR code");
      return;
    }

    await checkCouponByToken(qrToken);
  };

  const handleVerifyCoupon = async () => {
    const qrToken = extractQrToken();

    if (!qrToken) {
      setError("Please enter QR token or scan QR code");
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

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(qrInput);
      setSuccess("Scanned QR data copied.");
    } catch {
      setError("Unable to copy QR data.");
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

  return (
    <main className="page-container">
      <PageHeader
        title="QR Coupon Verification"
        subtitle="Scan student coupon, check details, and mark meal as served securely."
        rightContent={
          <Link to="/manager/dashboard" className="btn-dark flex items-center gap-2">
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

      {success && (
        <p className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl mb-4">
          {success}
        </p>
      )}

      <div className="grid xl:grid-cols-[1fr_420px] gap-6">
        {/* Left section */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Verification Mode
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Use manual token entry or camera scanner.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setScanMode("manual")}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    scanMode === "manual"
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Manual Token
                </button>

                <button
                  onClick={() => setScanMode("camera")}
                  className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
                    scanMode === "camera"
                      ? "bg-blue-700 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <MdQrCodeScanner />
                  Camera Scanner
                </button>
              </div>
            </div>

            <button
              onClick={() => setAutoVerify(!autoVerify)}
              className={`mt-5 w-full md:w-auto flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                autoVerify
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-orange-50 border-orange-200 text-orange-700"
              }`}
            >
              {autoVerify ? <FiToggleRight /> : <FiToggleLeft />}
              <span className="font-bold">
                Auto verify after scan: {autoVerify ? "ON" : "OFF"}
              </span>
            </button>

            <p className="text-sm text-slate-500 mt-3">
              If auto verify is off, scanning only checks coupon details. If on,
              scanning directly marks the meal as served.
            </p>
          </div>

          {scanMode === "camera" && (
            <div className="pro-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
                  <MdQrCodeScanner />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">Camera Scanner</h2>
                  <p className="text-sm text-slate-500">
                    Allow camera permission and scan student QR coupon.
                  </p>
                </div>
              </div>

              <QRScanner onScanSuccess={handleScanSuccess} />
            </div>
          )}

          {scanMode === "manual" && (
            <div className="pro-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FiShield />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">Manual Verification</h2>
                  <p className="text-sm text-slate-500">
                    Paste QR token or QR JSON and verify coupon.
                  </p>
                </div>
              </div>

              <textarea
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="w-full mb-4"
                rows="5"
                placeholder='Example: {"qrToken":"abc123"} or directly paste token'
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCheckCoupon}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiEye />
                  {loading ? "Checking..." : "Check Coupon"}
                </button>

                <button
                  onClick={handleVerifyCoupon}
                  disabled={loading}
                  className="btn-success flex items-center gap-2"
                >
                  <FiCheckCircle />
                  {loading ? "Verifying..." : "Verify & Mark Served"}
                </button>
              </div>
            </div>
          )}

          {qrInput && (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="font-extrabold text-slate-900">
                  Last Scanned / Entered Data
                </h2>

                <button
                  onClick={handleCopyToken}
                  className="btn-dark flex items-center gap-2"
                >
                  <FiCopy />
                  Copy
                </button>
              </div>

              <p className="break-all bg-slate-100 border border-slate-200 p-3 rounded-xl text-sm font-mono">
                {qrInput}
              </p>

              {scanMode === "camera" && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={handleCheckCoupon}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FiEye />
                    Check Again
                  </button>

                  <button
                    onClick={handleVerifyCoupon}
                    disabled={loading}
                    className="btn-success flex items-center gap-2"
                  >
                    <FiCheckCircle />
                    Verify & Mark Served
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right details section */}
        <div className="pro-card p-6 h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
              <FiCheckCircle />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Coupon Details
              </h2>
              <p className="text-sm text-slate-500">
                Verified details will appear here.
              </p>
            </div>
          </div>

          {!couponDetails ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
              <MdQrCodeScanner className="mx-auto text-5xl text-blue-700 mb-3" />
              <h3 className="font-extrabold text-slate-900">
                No coupon checked yet
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Scan or paste QR token to see student and meal details.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Student</p>
                <h3 className="text-xl font-extrabold">
                  {couponDetails.studentName}
                </h3>
                <p className="text-sm text-slate-500">
                  Roll No: {couponDetails.rollNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Hostel</p>
                  <h3 className="font-extrabold">
                    {couponDetails.hostel || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Room</p>
                  <h3 className="font-extrabold">
                    {couponDetails.roomNumber || "-"}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Meal</p>
                  <h3 className="font-extrabold">
                    {couponDetails.mealName}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500">Amount</p>
                  <h3 className="font-extrabold">
                    ₹{couponDetails.amount || "-"}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Meal Date</p>
                <h3 className="font-extrabold">
                  {formatDate(
                    couponDetails.mealDate || couponDetails.bookedMealDate
                  )}
                </h3>
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                <span className="text-sm text-slate-500">Payment</span>
                <StatusBadge status={couponDetails.paymentStatus || "-"} />
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                <span className="text-sm text-slate-500">Booking</span>
                <StatusBadge status={couponDetails.bookingStatus || "-"} />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Served At</p>
                <h3 className="font-extrabold">
                  {formatTime(couponDetails.servedAt)}
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Scanned By</p>
                <h3 className="font-extrabold">
                  {couponDetails.scannedBy || "-"}
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default QRVerification;
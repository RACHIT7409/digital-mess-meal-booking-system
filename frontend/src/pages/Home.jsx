import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import lnmiitLogo from "../assets/lnmiit-logo.png";
import developerImage from "../assets/developer.jpg";

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="page-container min-h-[calc(100vh-90px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
          {/* Left Content */}
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold text-sm mb-5">
              <FiShield />
              Digital Hostel Mess Solution
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Digital Mess Meal
              <span className="block text-blue-700">Booking System</span>
            </h1>

            <p className="text-slate-600 text-lg leading-8 mt-5 max-w-2xl">
              Book breakfast, lunch, snacks, and dinner online. Pay securely
              using Razorpay, generate QR coupons, verify meal entry, and manage
              refunds digitally.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                Student Register
                <FiArrowRight />
              </Link>

              <Link to="/login" className="btn-dark flex items-center gap-2">
                Login
                <FiArrowRight />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              <div className="glass-card p-4">
                <h3 className="font-extrabold text-slate-900">Razorpay</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Secure test payment integration
                </p>
              </div>

              <div className="glass-card p-4">
                <h3 className="font-extrabold text-slate-900">QR Coupon</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Single-use digital coupon
                </p>
              </div>

              <div className="glass-card p-4">
                <h3 className="font-extrabold text-slate-900">Refunds</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Transparent refund workflow
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="fade-in">
            <div className="relative">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />

              <div className="form-card p-6 md:p-8 relative overflow-hidden">
                <div className="flex justify-between items-start mb-7">
                  <div>
                    <p className="text-sm text-slate-500 font-bold">
                      Institution
                    </p>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      LNMIIT Jaipur
                    </h2>
                  </div>

                  <img
                    src={lnmiitLogo}
                    alt="LNMIIT Logo"
                    className="w-20 h-20 object-contain bg-white rounded-2xl border border-slate-200 p-2 shadow-sm"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-2xl">
                      <FiCreditCard />
                    </div>
                    <div>
                      <h3 className="font-extrabold">Online Meal Payment</h3>
                      <p className="text-sm text-slate-500">
                        Students pay before collecting digital coupon.
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-700 text-white flex items-center justify-center text-2xl">
                      <MdQrCodeScanner />
                    </div>
                    <div>
                      <h3 className="font-extrabold">QR Verification</h3>
                      <p className="text-sm text-slate-500">
                        Manager verifies coupon at mess entry.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <h3 className="font-extrabold">Refund Handling</h3>
                      <p className="text-sm text-slate-500">
                        Refund requests are tracked and approved digitally.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 bg-slate-900 text-white rounded-2xl p-5">
                  <p className="text-sm text-slate-300">Today’s System Flow</p>
                  <h3 className="text-xl font-extrabold mt-1">
                    Book → Pay → QR → Verify → Serve
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


            {/* Features Section */}
      <section className="page-container">
        <div className="text-center mb-10">
          <h2 className="page-title">Project Features</h2>
          <p className="page-subtitle">
            A complete MERN stack solution for real hostel mess coupon problems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="action-card">
            <FiUser className="text-3xl text-blue-700 mb-4" />
            <h3 className="action-title">Student Module</h3>
            <p className="action-text">
              Students can register, book meals, pay online, view QR coupons,
              and request refunds.
            </p>
          </div>

          <div className="action-card">
            <MdQrCodeScanner className="text-3xl text-blue-700 mb-4" />
            <h3 className="action-title">Manager Module</h3>
            <p className="action-text">
              Managers can verify QR coupons, mark meals as served, and handle
              not-served cases.
            </p>
          </div>

          <div className="action-card">
            <FiShield className="text-3xl text-blue-700 mb-4" />
            <h3 className="action-title">Admin Module</h3>
            <p className="action-text">
              Admin can manage users, meals, staff accounts, reports, and refund
              workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="page-container">
        <div className="glass-card p-7 md:p-10">
          <div className="text-center mb-10">
            <h2 className="page-title">How It Works</h2>
            <p className="page-subtitle">
              Simple digital process from booking to meal verification.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              "Student books meal",
              "Payment via Razorpay",
              "QR coupon generated",
              "Manager scans QR",
              "Meal served securely",
            ].map((step, index) => (
              <div key={step} className="bg-white rounded-2xl p-5 text-center border border-slate-200 shadow-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-700 text-white flex items-center justify-center font-extrabold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-extrabold text-slate-900">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Developer Section */}
      <section className="page-container">
        <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-center">
          <div className="form-card p-6 text-center">
            <img
              src={developerImage}
              alt="Developer"
              className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-blue-100 shadow-lg"
            />

            <h2 className="text-2xl font-extrabold text-slate-900 mt-5">
              Rhitwik Prakash
            </h2>

            <p className="text-blue-700 font-bold mt-1">
              MERN Stack Developer
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Digital Mess Meal Booking System
            </p>
          </div>

          <div className="pro-card p-7 md:p-8">
            <h2 className="page-title mb-3">Developer Details</h2>

            <p className="text-slate-600 leading-7 mb-6">
              This project is developed to solve the real-life hostel mess coupon
              problem by replacing paper coupons with secure digital meal
              booking, online payment, QR verification, and refund management.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Name</p>
                <h3 className="font-extrabold">RACHIT CHAWLA</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Roll Number</p>
                <h3 className="font-extrabold">23UEC598</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Email</p>
                <h3 className="font-extrabold break-all">
                  23uec598@lnmiit.ac.in
                </h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-sm text-slate-500">Contact</p>
                <h3 className="font-extrabold">+91 7409479254</h3>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 md:col-span-2">
                <p className="text-sm text-slate-500">Tech Stack</p>
                <h3 className="font-extrabold">
                  MongoDB, Express.js, React.js, Node.js, Razorpay, QR Code,
                  Tailwind CSS
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 bg-slate-900 text-white">
        <div className="page-container py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-xl">MessMate</h2>
            <p className="text-slate-400 text-sm mt-1">
              Digital Mess Meal Booking System for hostel students.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <FiMail />
              23uec598@lnmiit.ac.in
            </span>

            <span className="flex items-center gap-2">
              <FiPhone />
              +91 7409479254
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
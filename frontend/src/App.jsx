import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import StudentDashboard from "./pages/StudentDashboard";
import AvailableMeals from "./pages/AvailableMeals";
import MyBookings from "./pages/MyBookings";
import MyCoupon from "./pages/MyCoupon";
import MyRefunds from "./pages/MyRefunds";

import ManagerDashboard from "./pages/ManagerDashboard";
import TodayBookings from "./pages/TodayBookings";
import QRVerification from "./pages/QRVerification";
import RefundRequests from "./pages/RefundRequests";

import UserManagement from "./pages/UserManagement";
import CreateStaff from "./pages/CreateStaff";
import MealManagement from "./pages/MealManagement";
import Reports from "./pages/Reports";

import AdminDashboard from "./pages/AdminDashboard";

import Profile from "./pages/Profile";




function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />


<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["student", "manager", "admin"]}>
      <Profile />
    </ProtectedRoute>
  }
/>



        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/meals"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AvailableMeals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/bookings"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/coupon/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyCoupon />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/refunds"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyRefunds />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/today-bookings"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <TodayBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/qr-verification"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <QRVerification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/refunds"
          element={
            <ProtectedRoute allowedRoles={["manager", "admin"]}>
              <RefundRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <UserManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/create-staff"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <CreateStaff />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/meals"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <MealManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Reports />
    </ProtectedRoute>
  }
/>



      </Routes>
    </div>
  );
}

export default App;
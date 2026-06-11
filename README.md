# Mess Coupon Booking System

A full-stack **Digital Mess Meal Coupon Booking System** built using the **MERN Stack**.
This project solves the real-life hostel mess coupon problem by replacing paper coupons with a secure online meal booking, Razorpay payment, QR coupon generation, QR verification, and refund management system.

---

## Project Overview

In many college hostels, students collect paper coupons from the mess counter for meals such as breakfast, lunch, snacks, and dinner. This process can create problems like:

* Long queues at the mess counter
* Lost paper coupons
* Manual payment tracking
* Students entering without valid coupons
* Difficulty in handling refunds
* No proper digital record of bookings and served meals

This project provides a digital solution where students can book meals online, pay using Razorpay, receive a QR coupon, and show it at the mess entry. The mess manager can verify the QR coupon and mark the meal as served.

---

## Live Project Links

Frontend Deployment:

```bash
https://your-vercel-frontend-url.vercel.app
```

Backend Deployment:

```bash
https://your-render-backend-url.onrender.com
```

GitHub Repository:

```bash
https://github.com/your-username/your-repository-name
```

---

## Screenshots

### Home Page

![Home Page](./screenshots/home.png)

---

### Login Page

![Login Page](./screenshots/login.png)

---

### Register Page

![Register Page](./screenshots/register.png)

---

### Student Dashboard

![Student Dashboard](./screenshots/student-dashboard.png)

---

### Book Meal Page

![Book Meal Page](./screenshots/book-meal.png)

---

### My Bookings Page

![My Bookings Page](./screenshots/my-bookings.png)

---

### Digital QR Coupon Page

![Digital QR Coupon](./screenshots/coupon.png)

---

### Manager Dashboard

![Manager Dashboard](./screenshots/manager-dashboard.png)

---

### QR Verification Page

![QR Verification](./screenshots/qr-verification.png)

---

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

---

### Meal Management Page

![Meal Management](./screenshots/meal-management.png)

---

### User Management Page

![User Management](./screenshots/user-management.png)

---

### Reports Page

![Reports Page](./screenshots/reports.png)

---

## Main Features

### Student Features

* Student registration and login
* Role-based secure authentication
* View available meals
* Book breakfast, lunch, snacks, and dinner
* Select meal date
* Razorpay payment integration
* Retry payment if payment fails or is incomplete
* QR coupon generation after successful payment
* View booking history
* View digital meal coupon
* Request refund if meal is not served
* Update profile details
* Change password securely

---

### Manager Features

* Manager login
* View today’s bookings
* Filter bookings by meal type
* Verify student QR coupon
* Manual QR token verification
* Camera-based QR scanning
* Mark meal as served
* Mark booking as not served with reason
* View refund requests
* Approve or reject refund requests

---

### Admin Features

* Admin login
* User management
* Activate or deactivate users
* Change user roles
* Create manager/admin staff accounts
* Create, update, enable, disable, and delete meals
* Manage meal price and timings
* View reports
* View revenue, paid bookings, served meals, and refunds
* Export reports as CSV
* Manage system-level data

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Icons
* QR Scanner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Razorpay API
* QR Code Generator
* CORS
* Dotenv

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Backend keep-alive: UptimeRobot

---

## System Roles

The project has three main roles:

| Role    | Description                                                         |
| ------- | ------------------------------------------------------------------- |
| Student | Books meals, pays online, views QR coupon, requests refund          |
| Manager | Verifies QR coupons, marks meals as served, manages refund requests |
| Admin   | Manages users, meals, staff, reports, and system settings           |

---

## Meal Booking Flow

```text
Student Login
↓
View Available Meals
↓
Select Meal and Date
↓
Book Meal
↓
Pay with Razorpay
↓
Payment Verified
↓
QR Coupon Generated
↓
Manager Scans QR
↓
Meal Marked as Served
```

---

## Payment Flow

This project uses Razorpay Test Mode for payment testing.

```text
Student creates booking
↓
Backend creates Razorpay order
↓
Razorpay payment popup opens
↓
Student completes payment
↓
Backend verifies Razorpay signature
↓
Booking becomes CONFIRMED
↓
QR coupon is generated
```

In test mode:

* No real money is deducted
* No real settlement happens
* No transaction charge is applied
* It is safe for project testing

In production, Razorpay Live Mode can be used after completing Razorpay KYC.

---

## QR Coupon Flow

After successful payment, the system generates:

* Unique QR token
* QR code image
* Digital coupon details

The QR coupon contains booking-related secure data and can be verified by the manager.

QR coupon can be used only once. After successful verification, the booking is marked as served.

---

## Refund Flow

Refund system handles real-life cases where a student paid but did not receive the meal.

```text
Student requests refund
↓
Manager/Admin reviews request
↓
Refund approved or rejected
↓
If approved, Razorpay refund/manual refund can be processed
↓
Refund status is updated
```

Refund statuses include:

* REQUESTED
* APPROVED
* REJECTED
* COMPLETED
* FAILED

---

## Payment Retry Handling

This project handles failed or incomplete Razorpay payments properly.

If a student:

* Closes Razorpay popup
* Loses internet during payment
* Payment fails
* Does not complete payment

Then the booking remains in:

```text
PENDING_PAYMENT
```

or:

```text
FAILED
```

The student can go to **My Bookings** and retry payment using the **Pay with Razorpay** button.

The system does not wrongly block the student from completing payment for the same meal and date.

---

## Project Folder Structure

```bash
Digital Mess Meal Booking System
│
├── backend
│   ├── config
│   │   ├── db.js
│   │   └── razorpay.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── refundController.js
│   │   ├── userController.js
│   │   ├── mealController.js
│   │   └── dashboardController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Meal.js
│   │   ├── Booking.js
│   │   └── Refund.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── refundRoutes.js
│   │   ├── userRoutes.js
│   │   ├── mealRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── utils
│   │   ├── qrUtils.js
│   │   ├── validators.js
│   │   └── dateTimeUtils.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   │   └── messmate-logo.png
│   │
│   ├── src
│   │   ├── api
│   │   │   └── api.js
│   │   │
│   │   ├── assets
│   │   │   ├── lnmiit-logo.png
│   │   │   ├── developer.jpg
│   │   │   ├── food-breakfast.jpg
│   │   │   ├── foodlunch.jpg
│   │   │   ├── food-snacks.jpg
│   │   │   └── food-dinner.jpg
│   │   │
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── QRScanner.jsx
│   │   │
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AvailableMeals.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── MyCoupon.jsx
│   │   │   ├── MyRefunds.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── TodayBookings.jsx
│   │   │   ├── QRVerification.jsx
│   │   │   ├── RefundRequests.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── CreateStaff.jsx
│   │   │   ├── MealManagement.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── utils
│   │   │   └── loadRazorpay.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
├── screenshots
│   ├── home.png
│   ├── login.png
│   ├── register.png
│   ├── student-dashboard.png
│   ├── book-meal.png
│   ├── my-bookings.png
│   ├── coupon.png
│   ├── manager-dashboard.png
│   ├── qr-verification.png
│   ├── admin-dashboard.png
│   ├── meal-management.png
│   ├── user-management.png
│   └── reports.png
│
└── README.md
```

---

## Environment Variables

### Backend `.env`

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

For production on Render:

```env
NODE_ENV=production
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
```

---

### Frontend `.env`

Create a `.env` file inside the `frontend` folder.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production on Vercel:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

---

### 2. Backend setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## Build Commands

### Frontend build

```bash
cd frontend
npm run build
```

### Backend start

```bash
cd backend
npm start
```

---

## API Modules

The backend contains APIs for:

* Authentication
* User management
* Staff creation
* Meal management
* Booking management
* Razorpay payment
* QR coupon verification
* Refund management
* Admin/manager dashboards
* Reports

---

## Authentication and Authorization

The project uses JWT-based authentication.

After login, the backend sends a token to the frontend. The frontend stores the token and sends it with protected API requests.

Role-based access is implemented for:

* Student routes
* Manager routes
* Admin routes

Example:

```text
Student cannot access admin dashboard
Manager cannot access user management
Admin can manage users and meals
```

---

## Database Models

### User Model

Stores:

* Name
* Email
* Password
* Role
* Roll number
* Hostel
* Room number
* Phone
* Active status

### Meal Model

Stores:

* Meal name
* Price
* Start time
* End time
* Booking deadline
* Cancellation deadline
* Availability status
* Description

### Booking Model

Stores:

* Student
* Meal
* Meal date
* Amount
* Payment status
* Booking status
* Razorpay order details
* QR token
* QR code
* Served status
* Not-served reason

### Refund Model

Stores:

* Student
* Booking
* Amount
* Reason
* Status
* Refund method
* Razorpay refund ID
* Admin/manager remarks
* Processed by
* Processed date

---

## Important Status Values

### Payment Status

```text
PENDING_PAYMENT
PAID
FAILED
REFUNDED
```

### Booking Status

```text
PENDING_PAYMENT
CONFIRMED
SERVED
NOT_SERVED
CANCELLED
REFUND_REQUESTED
REFUNDED
```

### Refund Status

```text
REQUESTED
APPROVED
REJECTED
COMPLETED
FAILED
```

---

## Production Deployment

### Frontend Deployment on Vercel

1. Push frontend code to GitHub
2. Open Vercel
3. Import GitHub repository
4. Select frontend as root directory
5. Add environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

6. Deploy

---

### Backend Deployment on Render

1. Push backend code to GitHub
2. Open Render
3. Create Web Service
4. Select backend root directory
5. Add environment variables
6. Build command:

```bash
npm install
```

7. Start command:

```bash
npm start
```

8. Deploy

---

### MongoDB Atlas Setup

1. Create free MongoDB Atlas cluster
2. Create database user
3. Allow network access
4. Copy connection string
5. Add connection string to backend `.env`

---

### UptimeRobot Keep Alive

Render free backend may sleep after inactivity. To reduce cold start delay:

1. Create UptimeRobot account
2. Add HTTP monitor
3. Add backend Render URL:

```bash
https://your-render-backend-url.onrender.com
```

4. Set interval to 5 minutes
5. Keep monitor active

---

## Razorpay Setup

1. Create Razorpay account
2. Use Test Mode keys for development
3. Add keys in backend `.env`
4. Use Razorpay Checkout in frontend
5. Verify payment signature in backend
6. Generate QR coupon after successful payment

Test mode does not transfer real money.

---

## Security Features

* JWT authentication
* Role-based route protection
* Password hashing using bcrypt
* Secure payment verification using Razorpay signature
* QR coupon verification
* Single-use QR coupon
* Protected admin and manager routes
* User activation/deactivation
* Environment variables for secrets
* CORS configuration

---

## Real-Life Use Cases

This project is useful for:

* College hostel mess systems
* Summer term mess coupon management
* Paid meal booking systems
* Student meal tracking
* Mess entry verification
* Digital coupon generation
* Refund management

---

## Future Improvements

* Email notifications after booking/payment
* SMS notification
* Forgot password feature
* Meal capacity limit
* Daily menu image upload
* Admin analytics charts
* Monthly revenue reports
* Student wallet system
* Bulk student upload by admin
* Attendance-style meal verification report
* Progressive Web App support

---

## Developer Details

Name:

```text
RACHIT CHAWLA
```

Roll Number:

```text
23UEC598
```

Email:

```text
23uec598@lnmiit.ac.in
```

Contact:

```text
+91 7409479254
```

Project:

```text
Digital Mess Meal Booking System
```

Institution:

```text
LNMIIT Jaipur
```

---

## Demo Credentials

You can add demo credentials here if needed.

### Student

```text
Email: student@example.com
Password: student123
```

### Manager

```text
Email: manager@example.com
Password: manager123
```

### Admin

```text
Email: admin@example.com
Password: admin123
```

Do not add real production credentials in public GitHub repositories.

---

## License

This project is created for educational and academic purposes.

---

## Project Status

```text
Completed
```

The system is fully functional with:

* Authentication
* Meal booking
* Razorpay test payment
* QR coupon generation
* QR verification
* Refund management
* Admin dashboard
* Manager dashboard
* Student dashboard
* Deployment
* Responsive professional UI

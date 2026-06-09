import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCoffee,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiChevronDown,
} from "react-icons/fi";

import developerImage from "../assets/developer.jpg";
import breakfastImg from "../assets/food-breakfast.jpg";
import lunchImg from "../assets/foodlunch.jpg";
import snacksImg from "../assets/food-snacks.jpg";
import dinnerImg from "../assets/food-dinner.jpg";

const Home = () => {
  const scrollToDeveloper = () => {
    const section = document.getElementById("developer-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <main className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="page-container min-h-[calc(100vh-90px)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* LEFT CONTENT */}
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 shadow-sm text-blue-700 px-4 py-2 rounded-full font-bold text-sm mb-6">
              <FiCoffee />
              Summer Term Mess Coupon System
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Book Your Mess Meal
              <span className="block text-blue-700">
                Without Standing in Queue
              </span>
            </h1>

            <p className="text-slate-600 text-lg leading-8 mt-6 max-w-xl">
              A simple digital meal booking system for hostel students. Book
              breakfast, lunch, snacks, or dinner online and show your QR coupon
              at the mess counter.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/register"
                className="btn-primary flex items-center gap-2"
              >
                Book as Student
                <FiArrowRight />
              </Link>

              <Link to="/login" className="btn-dark flex items-center gap-2">
                Login
                <FiArrowRight />
              </Link>

              <button
                onClick={scrollToDeveloper}
                className="bg-white text-blue-700 border border-blue-200 px-5 py-3 rounded-xl font-extrabold shadow-sm hover:shadow-md hover:bg-blue-50 transition flex items-center gap-2"
              >
                Developer
                <FiChevronDown />
              </button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Breakfast</p>
                <h3 className="text-xl font-extrabold text-slate-900">₹35</h3>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Lunch</p>
                <h3 className="text-xl font-extrabold text-slate-900">₹60</h3>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Snacks</p>
                <h3 className="text-xl font-extrabold text-slate-900">₹25</h3>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-500">Dinner</p>
                <h3 className="text-xl font-extrabold text-slate-900">₹60</h3>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE CARD */}
          <div className="fade-in">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-52 h-52 bg-blue-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-orange-300/20 rounded-full blur-3xl" />

              <div className="relative bg-white rounded-[32px] shadow-2xl border border-slate-200 p-5">
                <div className="mb-5">
                  <p className="text-sm text-slate-500 font-bold">
                    Digital Mess Service
                  </p>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    LNMIIT Hostel Mess
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <img
                    src={breakfastImg}
                    alt="Breakfast"
                    className="w-full h-56 object-cover rounded-3xl"
                  />

                  <div className="grid gap-4">
                    <img
                      src={lunchImg}
                      alt="Lunch"
                      className="w-full h-[104px] object-cover rounded-3xl"
                    />

                    <img
                      src={snacksImg}
                      alt="Snacks"
                      className="w-full h-[104px] object-cover rounded-3xl"
                    />
                  </div>
                </div>

                <img
                  src={dinnerImg}
                  alt="Dinner"
                  className="w-full h-40 object-cover rounded-3xl mt-4"
                />

                <div className="mt-5 bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-slate-300 text-sm">Today’s Booking</p>
                    <h3 className="text-xl font-extrabold">Open Now</h3>
                  </div>

                  <Link
                    to="/register"
                    className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-extrabold text-center hover:bg-blue-50 transition"
                  >
                    Get Coupon
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEAL SECTION */}
      <section className="page-container pt-0">
        <div className="bg-white rounded-[30px] border border-slate-200 shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Choose Your Meal
              </h2>
              <p className="text-slate-500 mt-2">
                Select date, pay online, and get a digital QR coupon.
              </p>
            </div>

            <Link
              to="/student/meals"
              className="btn-primary flex items-center justify-center gap-2"
            >
              View Meals
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition">
              <img
                src={breakfastImg}
                alt="Breakfast"
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Breakfast
                  </h3>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-extrabold text-sm">
                    ₹25
                  </span>
                </div>

                <p className="text-slate-500 mt-2">
                  Start your day with a booked breakfast coupon.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition">
              <img
                src={lunchImg}
                alt="Lunch"
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Lunch
                  </h3>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-extrabold text-sm">
                    ₹60
                  </span>
                </div>

                <p className="text-slate-500 mt-2">
                  Avoid crowd and book your lunch in advance.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition">
              <img
                src={snacksImg}
                alt="Snacks"
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Snacks
                  </h3>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-extrabold text-sm">
                    ₹25
                  </span>
                </div>

                <p className="text-slate-500 mt-2">
                  Book evening snacks without waiting for paper coupons.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition">
              <img
                src={dinnerImg}
                alt="Dinner"
                className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
              />

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Dinner
                  </h3>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-extrabold text-sm">
                    ₹60
                  </span>
                </div>

                <p className="text-slate-500 mt-2">
                  Book your dinner coupon and verify at mess entry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER SECTION */}
      <section id="developer-section" className="page-container">
        <div className="bg-white rounded-[30px] border border-slate-200 shadow-lg p-6 md:p-9">
          <div className="grid lg:grid-cols-[360px_1fr] gap-10 items-center">
            <div className="text-center lg:text-left">
              <img
                src={developerImage}
                alt="Developer"
                className="w-56 h-56 rounded-[32px] object-cover mx-auto lg:mx-0 border border-slate-200 shadow-xl"
              />
            </div>

            <div>
              <p className="text-blue-700 font-extrabold mb-2">
                Developer Details
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                RACHIT CHAWLA
              </h2>

              <p className="text-slate-500 mt-2">
                Student Developer, LNMIIT Jaipur
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-7">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FiUser />
                    Roll Number
                  </p>
                  <h3 className="font-extrabold mt-1">23UEC598</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FiMail />
                    Email
                  </p>
                  <h3 className="font-extrabold mt-1 break-all">
                    23uec598@lnmiit.ac.in
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FiPhone />
                    Contact
                  </p>
                  <h3 className="font-extrabold mt-1">+91 7409479254</h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <FiMapPin />
                    Project
                  </p>
                  <h3 className="font-extrabold mt-1">
                    Digital Mess Meal Booking System
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:23uec598@lnmiit.ac.in"
                  className="btn-primary flex items-center gap-2"
                >
                  <FiMail />
                  Send Mail
                </a>

                <a
                  href="tel:+917409479254"
                  className="btn-dark flex items-center gap-2"
                >
                  <FiPhone />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white mt-10">
        <div className="page-container py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h2 className="font-extrabold text-2xl">MessMate</h2>
              <p className="text-slate-400 text-sm mt-2 leading-6">
                A simple digital mess booking system for hostel students.
              </p>
            </div>

            <div>
              <h3 className="font-extrabold mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
                <Link to="/register" className="hover:text-white transition">
                  Student Register
                </Link>
                <button
                  onClick={scrollToDeveloper}
                  className="text-left hover:text-white transition"
                >
                  Developer
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold mb-3">Contact</h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p className="flex items-center gap-2">
                  <FiMail />
                  23uec598@lnmiit.ac.in
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone />
                  +91 7409479254
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin />
                  LNMIIT Jaipur
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-7 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-slate-500 text-sm">
              © 2026 Digital Mess Meal Booking System. All rights reserved.
            </p>

            <p className="text-slate-500 text-sm">
              Developed by RACHIT CHAWLA
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
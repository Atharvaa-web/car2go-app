"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [index, setIndex] = useState(3);
  const [page, setPage] = useState("dashboard");
  const [pickupLocation, setPickupLocation] = useState("");
  const [activeTab, setActiveTab] = useState("Daily");

  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ STATES
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  // 🧑‍💼 Customer Info
const [customerName, setCustomerName] = useState("");
const [customerMobile, setCustomerMobile] = useState("");
const [customerAddress, setCustomerAddress] = useState("");
const [customerAadhar, setCustomerAadhar] = useState("");

const [searchTrackingId, setSearchTrackingId] = useState("");
const [bookingData, setBookingData] = useState<any>(null);

const [bookingSuccess, setBookingSuccess] = useState(false);
const [trackingId, setTrackingId] = useState("");
// 🚗 Booking Info (if not already present)
//const [pickupDate, setPickupDate] = useState("");
const [pickupTime, setPickupTime] = useState("");
//const [returnDate, setReturnDate] = useState("");
const [returnTime, setReturnTime] = useState("");
//const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    getCars();
  }, []);

const handleTrackOrder = async () => {
  if (!searchTrackingId) {
    alert("Enter Tracking ID");
    return;
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("tracking_id", searchTrackingId)
    .single();

  if (error || !data) {
    alert("Booking not found");
    setBookingData(null);
    return;
  }

  setBookingData(data);
};

  const handleBooking = async () => {
  // simple validation
  if (!customerName || !customerMobile) {
    alert("Please fill required details");
    return;
  }

  const generatedId = "TRK" + Math.floor(100000 + Math.random() * 900000);

  // OPTIONAL: save to Supabase
  const { error } = await supabase.from("bookings").insert([
    {
      customer_name: customerName,
      mobile: customerMobile,
      address: customerAddress,
      aadhar: customerAadhar,
      car_name: selectedCar.name,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      return_date: returnDate,
      return_time: returnTime,
      total_amount: totalAmount,
      tracking_id: generatedId,
    },
  ]);

  if (error) {
console.log("ERROR:", error);
alert(error.message);    alert("Booking failed");
    return;
  }

  setTrackingId(generatedId);
  setShowModal(false);
  setBookingSuccess(true);
};
  async function getCars() {
    const { data } = await supabase.from("cars").select("*");

    if (data) {
      const fixed = data.map((car) => ({
        ...car,
        name: car.name || car.car_name || "CAR MODEL",
        price: car.price || car.price_per_day || 250,
        description:
          car.description ||
          "Comfortable, fuel-efficient and perfect for city rides.",
      }));

      setCars(fixed);
    }
  }

  const loopCars = [...cars, ...cars, ...cars];

  useEffect(() => {
    if (!cars.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [cars]);

  useEffect(() => {
    if (index >= cars.length * 2) {
      setIndex(cars.length);
    }
  }, [index, cars]);

  const getDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 1;
  };

  const totalAmount = selectedCar ? selectedCar.price * getDays() : 0;

  return (
  <div className="flex">

    {/* SIDEBAR */}
    <div className="hidden md:flex w-64 h-screen sticky top-0 bg-gradient-to-b from-orange-500 to-orange-700 text-white p-6 flex-col gap-6">
      <h1 className="text-3xl font-extrabold">Car2Go</h1>

      {["dashboard", "cars", "track", "about"].map((item) => (
        <button
          key={item}
          onClick={() => setPage(item)}
          className="px-5 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition text-left"
        >
          {item === "dashboard"
            ? "Dashboard"
            : item === "cars"
            ? "Available Cars"
            : item === "track"
            ? "Track Order"
            : "About Us"}
        </button>
      ))}
    </div>

    <div className="flex-1 bg-gray-100 overflow-x-hidden">

{page === "track" && (
  <div className="bg-gray-100 min-h-screen">

    <div className="sticky top-0 z-30 bg-orange-500 text-black px-6 py-3 flex justify-center shadow-md">
      <span className="font-semibold"><b>TRACK BOOKING</b></span>
    </div>

    <div className="p-4 md:p-10">
      <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Enter Your Tracking Number
        </h2>

        <input
          type="text"
          placeholder="e.g. TRK123456"
          value={searchTrackingId}
          onChange={(e) => setSearchTrackingId(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4 text-black"
        />

        <button
          onClick={handleTrackOrder}
          className="w-full bg-orange-500 text-white py-3 rounded-full font-bold"
        >
          Track Booking
        </button>

        {bookingData && (
          <div className="mt-6 p-5 bg-gray-100 rounded-xl text-black">
            <p><b>Name:</b> {bookingData.customer_name}</p>
            <p><b>Mobile:</b> {bookingData.mobile}</p>
            <p><b>Car:</b> {bookingData.car_name}</p>
            <p><b>Pickup:</b> {bookingData.pickup_date} ({bookingData.pickup_time})</p>
            <p><b>Return:</b> {bookingData.return_date} ({bookingData.return_time})</p>
            <p><b>Total:</b> ₹{bookingData.total_amount}</p>
          </div>
        )}

      </div>
    </div>

  </div>
)}

{/* DASHBOARD */}
{page === "dashboard" && (
  <>
    <div className="sticky top-0 z-30 bg-orange-500 text-white px-6 py-3 flex justify-around shadow-md">
      <span className="font-semibold"><b></b></span>
    </div>

    <div className="px-4 md:px-6 mt-6">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 md:p-8 shadow-xl text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-2">
          Welcome to CAR2GO Dashboard!
        </h1>
        <p className="text-sm md:text-lg font-medium">
          Book your perfect ride anytime, anywhere in Pune.
        </p>
      </div>
    </div>

    <div className="pt-6 md:pt-10 px-4 md:px-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-6xl mx-auto shadow-xl">

        <div className="flex gap-3 mb-6 flex-wrap">
          {["Daily", "Monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {tab === "Daily"
                ? "Daily Rentals"
                : "Monthly Subscription"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          <div>
            <p className="text-sm text-black mb-1">Pickup Location</p>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-4 border rounded-lg text-black bg-white"
            >
              <option value="">Select pickup location</option>
              <option>Warje</option>
              <option>Sinhagad Road</option>
              <option>Karve Nagar</option>
              <option>Kothrud</option>
            </select>
          </div>

          <div>
            <p className="text-sm text-black mb-1">City</p>
            <div className="p-4 border rounded-lg bg-gray-100 text-black font-medium">
              Pune
            </div>
          </div>

          <div>
            <p className="text-sm text-black mb-1">Dropping Location</p>
            <select className="w-full p-4 border rounded-lg text-black bg-white">
              <option>Select Dropping location</option>
              <option>Warje</option>
              <option>Sinhagad Road</option>
              <option>Karve Nagar</option>
              <option>Kothrud</option>
            </select>
          </div>

          <div>
            <p className="text-sm text-black mb-1">Pick-Up Date & Time</p>
            <div className="flex border rounded-lg">
              <input
                type="date"
                onChange={(e) => setPickupDate(e.target.value)}
                className="p-3 flex-1 text-black"
              />
              <input type="time" className="p-3 w-32 border-l text-black" />
            </div>
          </div>

          <div>
            <p className="text-sm text-black mb-1">Return Date & Time</p>
            <div className="flex border rounded-lg">
              <input
                type="date"
                onChange={(e) => setReturnDate(e.target.value)}
                className="p-3 flex-1 text-black"
              />
              <input type="time" className="p-3 w-32 border-l text-black" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setFilteredCars(cars);
              setPage("cars");
            }}
            className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600"
          >
            Show Cars
          </button>
        </div>
      </div>
    </div>

    {/* CAROUSEL */}
    <div className="sticky top-0 z-30 bg-orange-500 text-white px-6 py-3 flex justify-around shadow-md">
      <span className="font-semibold"><b>WE HAVE A VARIETY OF CARS AVAILABLE</b></span>
    </div>

    <div className="mt-10 md:mt-16 overflow-hidden px-4 md:px-6">
      <div
        className="flex items-center transition-transform duration-[1200ms] ease-in-out"
        style={{
          transform: `translateX(calc(-${index * 33.33}% + 33.33%))`,
        }}
      >
        {loopCars.map((car, i) => {
          const isActive = i === index;

          return (
            <div key={i} className="min-w-full md:min-w-[33.33%] flex justify-center px-4 md:px-6">
              <div
                className={`w-full md:w-[320px] h-[480px] rounded-2xl p-5 flex flex-col justify-between
                bg-gradient-to-b from-white-900 via-gray-800 to-black text-white shadow-xl
                transition-all duration-700 ${
                  isActive
                    ? "scale-110 opacity-100 z-10"
                    : "scale-90 opacity-60 blur-[2px]"
                }`}
              >
                <div className="flex justify-center mt-3">
                  <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                    {car.name}
                  </span>
                </div>

                <div className="flex justify-center items-center">
                  <img src={car.image_url} className="h-36 object-contain" />
                </div>

                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-1">
                    {car.type || "Premium Vehicle"}
                  </p>

                  <p className="text-xs text-gray-400 mb-2">
                    {car.description}
                  </p>

                  <div className="text-2xl font-bold">
                    ₹{car.price} <span className="text-sm">/day</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setShowModal(true);
                    }}
                    className="mt-3 w-full bg-orange-500 py-2 rounded-full"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>
)}
{bookingSuccess && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 md:p-10 rounded-2xl text-center shadow-2xl max-w-md w-full">
      
      <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
        Booking Confirmed 🎉
      </h2>

      <p className="text-base md:text-lg mb-2">
        Your car has been successfully booked.
      </p>

      <p className="text-lg md:text-xl font-bold text-orange-500 mb-4 break-words">
        Tracking ID: {trackingId}
      </p>

      <button
        onClick={() => {
          setBookingSuccess(false);
          setPage("dashboard");
        }}
        className="bg-orange-500 text-white px-6 py-2 rounded-full w-full md:w-auto"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
)}

{/* AVAILABLE CARS */}
{page === "cars" && (
  <div className="p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-gray-100">
    {(filteredCars.length ? filteredCars : cars).map((car) => (
      <div
        key={car.id}
        className="rounded-2xl shadow-xl bg-gradient-to-b from-gray-900 to-white text-white p-5 
        transition-all duration-300 hover:scale-105 hover:shadow-2xl 
        hover:bg-gradient-to-b hover:from-orange-500 hover:to-white hover:text-black cursor-pointer"
      >
        <div className="flex justify-center mb-3">
          <span className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm font-bold 
          transition hover:bg-orange-500">
            {car.name}
          </span>
        </div>

        <div className="flex justify-center my-4">
          <img
            src={car.image_url}
            className="h-28 object-contain transition-transform duration-300 hover:scale-110"
          />
        </div>

        <div className="text-center">
          <p className="text-gray-300 text-sm mb-1 hover:text-black transition">
            {car.type || "Premium Vehicle"}
          </p>

          <p className="text-xs text-gray-400 mb-2 hover:text-gray-700 transition">
            {car.description}
          </p>

          <div className="text-2xl font-bold">
            ₹{car.price} /day
          </div>

          <button
            onClick={() => {
              setSelectedCar(car);
              setShowModal(true);
            }}
            className="mt-4 w-full bg-orange-500 py-2 rounded-full font-semibold 
            hover:bg-orange-600 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    ))}
  </div>
)}

<div className="w-full h-6 bg-white"></div>

{page === "about" && (
  <div className="p-4 md:p-10 bg-gray-100">

    <div className="sticky top-0 z-30 bg-orange-500 text-white px-6 py-3 flex justify-around shadow-md">
      <button
        onClick={() => setPage("cars")}
        className="px-4 py-2 rounded-full bg-white text-orange-500 font-semibold hover:bg-gray-100 transition"
      >
        ABOUT US
      </button>
    </div>

    {/* HERO */}
    <div className="mt-10 md:mt-16 bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl text-center">

      <h1 className="text-2xl md:text-4xl font-extrabold mb-6 text-white">
        About Car2Go
      </h1>

      <div className="max-w-2xl mx-auto space-y-4 text-base md:text-lg font-medium text-white">

        <p>
          Car2Go is your trusted car rental partner in Pune, offering affordable,
          reliable, and premium vehicles for every journey.
        </p>

        <p>
          Car2Go India is a self-drive car rental platform that provides customers
          with access to a wide range of vehicles including hatchbacks,
          sedans, and SUVs.
        </p>

        <p>
          The platform enables seamless booking, transparent pricing,
          and flexible rental durations.
        </p>

        <p>
          It also allows car owners to list their vehicles and generate
          passive income through a revenue-sharing model.
        </p>

        <p className="font-bold">📞 Contact us: +91 8530899927</p>

      </div>
    </div>

    {/* FEATURES */}
    <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      
      <div className="bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl">
        <h2 className="font-bold text-lg mb-2">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full inline-block">
            🚗 Wide Range
          </span>
        </h2>
        <p className="text-white-600 text-sm">
          From hatchbacks to SUVs, choose the perfect car.
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl">
        <h2 className="font-bold text-lg mb-2">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full inline-block">
            💸 Affordable
          </span>
        </h2>
        <p className="text-white-600 text-sm">
          Transparent pricing with no hidden charges.
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl">
        <h2 className="font-bold text-lg mb-2">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full inline-block">
            ⚡ Instant Booking
          </span>
        </h2>
        <p className="text-white-600 text-sm">
          Book your ride in seconds with ease.
        </p>
      </div>

    </div>

    {/* DARK SECTION */}
    <div className="mt-10 md:mt-16 bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl">

      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
        <span className="bg-orange-500 text-white px-6 py-2 rounded-full inline-block shadow-lg">
          Why Choose Car2Go?
        </span>
      </h2>

      <ul className="space-y-4 max-w-2xl mx-auto text-sm">
        <li className="backdrop-blur-md bg-gray/10 text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition w-fit mx-auto">
          ✔ Well-maintained & sanitized vehicles
        </li>
        <li className="backdrop-blur-md bg-gray/10 text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition w-fit mx-auto">
          ✔ 24/7 customer support
        </li>
        <li className="backdrop-blur-md bg-gray/10 text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition w-fit mx-auto">
          ✔ Easy pickup & drop locations
        </li>
        <li className="backdrop-blur-md bg-gray/10 text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition w-fit mx-auto">
          ✔ Trusted by hundreds of customers
        </li>
      </ul>

    </div>

    {/* CTA */}
    <div className="mt-10 md:mt-12 text-center">
      <button
        onClick={() => setPage("cars")}
        className="bg-gradient-to-br from-gray-900 to-white p-6 md:p-10 rounded-2xl shadow-xl"
      >
        Explore Cars
      </button>
    </div>

    <div className="w-full h-6 bg-white"></div>

    {/* BOTTOM NAVBAR */}
    <div className="sticky bottom-0 z-40 bg-orange-500 text-white shadow-inner px-4 md:px-6 py-3 flex justify-around">
      <button onClick={() => setPage("cars")} className="px-4 py-2 rounded-full bg-white text-orange-500 font-semibold">
        HOME
      </button>
      <button onClick={() => setPage("cars")} className="px-4 py-2 rounded-full bg-white text-orange-500 font-semibold">
        CARS
      </button>
      <button onClick={() => setPage("cars")} className="px-4 py-2 rounded-full bg-white text-orange-500 font-semibold">
        ABOUT US
      </button>
    </div>

  </div>
)}

      </div>

     {/* ⭐ BOOKING MODAL */}
{showModal && selectedCar && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto px-4 pt-20 pb-10">

    <div className="mx-auto bg-gradient-to-br from-gray-900 to-white p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-white/20">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-3 text-center text-white break-words">
        Booking — {selectedCar.name}
      </h2>

      {/* CUSTOMER DETAILS */}
      <h3 className="text-xl font-semibold mb-2 mt-4 text-center text-white">
        Customer Details
      </h3>

      <input
        type="text"
        placeholder="Full Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white placeholder-white/70 outline-none"
      />

      <input
        type="text"
        placeholder="Mobile Number"
        value={customerMobile}
        onChange={(e) => setCustomerMobile(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white placeholder-white/70 outline-none"
      />

      <input
        type="text"
        placeholder="Address"
        value={customerAddress}
        onChange={(e) => setCustomerAddress(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white placeholder-white/70 outline-none"
      />

      <input
        type="text"
        placeholder="Aadhar Card Number"
        value={customerAadhar}
        onChange={(e) => setCustomerAadhar(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white placeholder-white/70 outline-none"
      />

      {/* BOOKING DETAILS */}
      <h3 className="text-xl font-semibold mb-2 mt-4 text-center text-white">
        Booking Details
      </h3>

      <label className="text-sm font-medium text-white">Pickup Date</label>
      <input
        type="date"
        value={pickupDate}
        onChange={(e) => setPickupDate(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white outline-none"
      />

      <label className="text-sm font-medium text-white">Pickup Time</label>
      <input
        type="time"
        value={pickupTime}
        onChange={(e) => setPickupTime(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white outline-none"
      />

      <label className="text-sm font-medium text-white">Return Date</label>
      <input
        type="date"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white outline-none"
      />

      <label className="text-sm font-medium text-white">Return Time</label>
      <input
        type="time"
        value={returnTime}
        onChange={(e) => setReturnTime(e.target.value)}
        className="w-full p-3 rounded-lg mb-3 bg-white/20 border border-white/30 text-white outline-none"
      />

      <label className="text-sm font-medium text-white">Total Amount (₹)</label>
      <div className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white font-semibold mb-3 text-center">
        ₹{totalAmount}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleBooking}
        className="w-full bg-orange-500 py-3 mt-3 rounded-full font-bold hover:bg-orange-600 transition"
      >
        Confirm Booking
      </button>

      {/* CLOSE */}
      <button
        onClick={() => setShowModal(false)}
        className="mt-4 w-full text-center text-white/80 font-semibold hover:text-white transition"
      >
        CANCEL
      </button>

    </div>
  </div>
)}

    </div>
  );
}

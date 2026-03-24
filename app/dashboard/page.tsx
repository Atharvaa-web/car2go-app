"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [cars, setCars] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1555215695-3004980ad54a",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
  ];

  useEffect(() => {
    fetchStats();

    // Background image change every 3 sec
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    const { data: carsData } = await supabase.from("cars").select("*");
    const { data: bookingData } = await supabase.from("bookings").select("*");

    setCars(carsData?.length || 0);
    setBookings(bookingData?.length || 0);
  }

  return (
    <div className="relative min-h-screen bg-gray-100 p-8 overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 transition-all duration-700"
        style={{ backgroundImage: `url(${images[bgIndex]})` }}
      ></div>

      {/* CONTENT */}
      <div className="relative z-10">

        <h1 className="text-4xl font-bold text-yellow-600 mb-10">
          📊 Dashboard
        </h1>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold mb-2">Total Cars</h2>
            <p className="text-4xl font-bold text-yellow-500">{cars}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
            <p className="text-4xl font-bold text-yellow-500">{bookings}</p>
          </div>

        </div>

        {/* BIG BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.href = "/"}
            className="px-12 py-5 text-xl font-bold rounded-full 
            bg-yellow-500 hover:bg-yellow-600 
            shadow-lg hover:shadow-2xl 
            transform hover:scale-105 transition duration-300"
          >
            🚗 View Available Cars
          </button>
        </div>

      </div>
    </div>
  );
}
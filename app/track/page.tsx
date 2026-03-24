"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchBooking() {
    if (!bookingId) return;
    setLoading(true);
    setError("");
    setBooking(null);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !data) {
      setError("Booking not found. Check your ID.");
      setLoading(false);
      return;
    }

    setBooking(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      {/* Heading */}
      <h1 className="text-3xl font-extrabold mb-6 bg-orange-500 text-white px-6 py-2 rounded-full">
        Track Your Booking
      </h1>

      {/* Input Box */}
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <label className="font-semibold text-gray-700">Enter Booking ID</label>

        <input
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="w-full p-3 mt-2 border rounded-lg"
          placeholder="e.g. BK10293"
        />

        <button
          onClick={fetchBooking}
          className="w-full mt-4 bg-orange-500 text-white font-bold p-3 rounded-full hover:bg-orange-600 transition"
        >
          {loading ? "Checking..." : "Track Booking"}
        </button>

        {error && (
          <p className="mt-3 text-red-500 font-semibold">{error}</p>
        )}
      </div>

      {/* Booking Status */}
      {booking && (
        <div className="bg-gradient-to-br from-gray-900 to-white text-white mt-6 p-6 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-xl font-bold text-center mb-3">
            Booking Details
          </h2>

          <p><b>Car:</b> {booking.car_name}</p>
          <p><b>Pickup:</b> {booking.pickup_date}</p>
          <p><b>Return:</b> {booking.return_date}</p>
          <p><b>Total Paid:</b> ₹{booking.total_amount}</p>
          <p>
            <b>Status:</b>{" "}
            <span className="bg-orange-500 px-3 py-1 rounded-full font-bold">
              {booking.status || "Confirmed"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
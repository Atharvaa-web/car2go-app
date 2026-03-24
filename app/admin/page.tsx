"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Car = {
  id: number;
  car_name: string;
  price_per_day: number;
  seats?: number;
  image_url?: string;
};

type Booking = {
  id: number;
  user_name: string | null;
  car_id: number | null;
  start_date: string | null;
  end_date: string | null;
  status?: string | null;
  accepted_at?: string | null;
};

export default function Admin() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [newCar, setNewCar] = useState({
    car_name: "",
    price_per_day: "",
    seats: "",
    image_url: "",
  });

  useEffect(() => {
    getCars();
    getBookings();
  }, []);

  async function getCars() {
    const { data, error } = await supabase.from("cars").select("*");

    if (error) {
      console.log("Cars fetch error:", error);
    } else {
      console.log("Cars:", data);
      setCars(data as Car[]);
    }
  }

  async function getBookings() {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log("❌ Booking fetch error:", error);
    } else {
      console.log("✅ Bookings fetched:", data);

      // 🔥 IMPORTANT FILTER (only valid bookings)
      const validBookings = (data || []).filter(
        (b) => b.user_name !== null || b.car_id !== null
      );

      setBookings(validBookings as Booking[]);
    }

    setLoadingBookings(false);
  }

  async function addCar() {
    if (!newCar.car_name || !newCar.price_per_day) {
      alert("Fill required fields");
      return;
    }

    const { error } = await supabase.from("cars").insert([
      {
        car_name: newCar.car_name,
        price_per_day: Number(newCar.price_per_day),
        seats: Number(newCar.seats),
        image_url: newCar.image_url,
      },
    ]);

    if (error) {
      alert("Error adding car");
    } else {
      alert("Car added ✅");
      setNewCar({
        car_name: "",
        price_per_day: "",
        seats: "",
        image_url: "",
      });
      getCars();
    }
  }

  async function deleteCar(id: number) {
    await supabase.from("cars").delete().eq("id", id);
    getCars();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">

      <h1 className="text-3xl font-bold text-yellow-600 mb-6">
        🚗 Admin Dashboard
      </h1>

      {/* ================= ADD CAR ================= */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md mb-10">
        <h2 className="text-xl font-bold mb-4">Add New Car</h2>

        <input
          placeholder="Car Name"
          value={newCar.car_name}
          onChange={(e) =>
            setNewCar({ ...newCar, car_name: e.target.value })
          }
          className="border w-full p-2 mb-3"
        />

        <input
          placeholder="Price per day"
          value={newCar.price_per_day}
          onChange={(e) =>
            setNewCar({ ...newCar, price_per_day: e.target.value })
          }
          className="border w-full p-2 mb-3"
        />

        <input
          placeholder="Seats"
          value={newCar.seats}
          onChange={(e) =>
            setNewCar({ ...newCar, seats: e.target.value })
          }
          className="border w-full p-2 mb-3"
        />

        <input
          placeholder="Image URL"
          value={newCar.image_url}
          onChange={(e) =>
            setNewCar({ ...newCar, image_url: e.target.value })
          }
          className="border w-full p-2 mb-3"
        />

        <button
          onClick={addCar}
          className="bg-yellow-500 w-full py-2 rounded font-semibold hover:bg-yellow-600"
        >
          Add Car
        </button>
      </div>

      {/* ================= CAR LIST ================= */}
      <h2 className="text-2xl font-bold mb-4">🚘 Cars</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-xl transition"
          >
            <img
              src={car.image_url || "https://via.placeholder.com/300"}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h3 className="font-bold">{car.car_name}</h3>
            <p>₹{car.price_per_day}/day</p>
            <p>{car.seats} Seater</p>

            <button
              onClick={() => deleteCar(car.id)}
              className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= BOOKINGS ================= */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📋 Bookings</h2>

        <button
          onClick={getBookings}
          className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-yellow-500">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Car ID</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Status</th>
              <th className="p-3">Accepted</th>
            </tr>
          </thead>

          <tbody>
            {loadingBookings ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.user_name ?? "—"}</td>
                  <td className="p-3">{b.car_id ?? "—"}</td>
                  <td className="p-3">{b.start_date ?? "—"}</td>
                  <td className="p-3">{b.end_date ?? "—"}</td>
                  <td className="p-3">{b.status ?? "—"}</td>
                  <td className="p-3">
                    {b.accepted_at
                      ? new Date(b.accepted_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
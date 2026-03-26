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
  customer_name: string | null;
  user_name?: string | null;
  mobile: string | null;
  car_name: string | null;
  pickup_date: string | null;
  return_date: string | null;
  total_amount?: number | null;
  tracking_id?: string | null;
};

export default function Admin() {
  const [page, setPage] = useState("dashboard");

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
    const { data } = await supabase.from("cars").select("*");
    if (data) setCars(data as Car[]);
  }

  async function getBookings() {
    setLoadingBookings(true);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setBookings(data || []);
    }

    setLoadingBookings(false);
  }

  async function addCar() {
    if (!newCar.car_name || !newCar.price_per_day) {
      alert("Fill required fields");
      return;
    }

    await supabase.from("cars").insert([
      {
        car_name: newCar.car_name,
        price_per_day: Number(newCar.price_per_day),
        seats: Number(newCar.seats),
        image_url: newCar.image_url,
      },
    ]);

    alert("Car added ✅");

    setNewCar({
      car_name: "",
      price_per_day: "",
      seats: "",
      image_url: "",
    });

    getCars();
  }

  async function deleteCar(id: number) {
    await supabase.from("cars").delete().eq("id", id);
    getCars();
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-sm md:text-base">

      {/* SIDEBAR / TOPBAR */}
      <div className="w-full md:w-64 bg-gradient-to-r md:bg-gradient-to-b from-orange-500 to-orange-700 text-white p-2 md:p-6 flex md:flex-col gap-2 overflow-x-auto">
        <h1 className="text-base md:text-2xl font-bold whitespace-nowrap">
          Admin Panel
        </h1>

        <div className="flex md:flex-col gap-2">
          {["dashboard", "cars", "bookings"].map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`px-2 py-1 md:px-4 md:py-2 rounded-full font-semibold text-xs md:text-base whitespace-nowrap transition
              ${
                page === item
                  ? "bg-white text-orange-600"
                  : "bg-orange-600 hover:bg-orange-500 text-white"
              }`}
            >
              {item === "dashboard"
                ? "Dashboard"
                : item === "cars"
                ? "Cars"
                : "Bookings"}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-2 sm:p-3 md:p-8">

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1 className="text-lg md:text-3xl font-bold mb-3 md:mb-6 text-orange-600">
              🚗 Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-white p-3 md:p-6 rounded-xl shadow text-center">
                <h2 className="text-sm md:text-xl font-bold">Total Cars</h2>
                <p className="text-xl md:text-3xl mt-1">{cars.length}</p>
              </div>

              <div className="bg-white p-3 md:p-6 rounded-xl shadow text-center">
                <h2 className="text-sm md:text-xl font-bold">Total Bookings</h2>
                <p className="text-xl md:text-3xl mt-1">{bookings.length}</p>
              </div>

              <div className="bg-white p-3 md:p-6 rounded-xl shadow text-center">
                <h2 className="text-sm md:text-xl font-bold">Revenue</h2>
                <p className="text-xl md:text-3xl mt-1">
                  ₹{bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* CARS */}
        {page === "cars" && (
          <>
            <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-orange-600">
              🚘 Cars
            </h2>

            <div className="bg-black p-3 md:p-6 rounded-xl shadow w-full md:max-w-md mb-6">
              <h2 className="text-sm md:text-xl font-bold mb-3 text-white">
                Add New Car
              </h2>

              <input
                placeholder="Car Name"
                value={newCar.car_name}
                onChange={(e) =>
                  setNewCar({ ...newCar, car_name: e.target.value })
                }
                className="border w-full p-2 mb-2 bg-white text-black text-sm"
              />

              <input
                placeholder="Price per day"
                value={newCar.price_per_day}
                onChange={(e) =>
                  setNewCar({ ...newCar, price_per_day: e.target.value })
                }
                className="border w-full p-2 mb-2 bg-white text-black text-sm"
              />

              <input
                placeholder="Seats"
                value={newCar.seats}
                onChange={(e) =>
                  setNewCar({ ...newCar, seats: e.target.value })
                }
                className="border w-full p-2 mb-2 bg-white text-black text-sm"
              />

              <input
                placeholder="Image URL"
                value={newCar.image_url}
                onChange={(e) =>
                  setNewCar({ ...newCar, image_url: e.target.value })
                }
                className="border w-full p-2 mb-2 bg-white text-black text-sm"
              />

              <button
                onClick={addCar}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded text-sm"
              >
                Add Car
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white p-3 md:p-4 rounded-xl shadow">
                  <img
                    src={car.image_url || "https://via.placeholder.com/300"}
                    alt={car.car_name}
                    className="w-full h-32 md:h-40 object-cover rounded mb-2"
                  />

                  <h3 className="font-bold text-sm md:text-base">{car.car_name}</h3>
                  <p className="text-sm">₹{car.price_per_day}/day</p>
                  <p className="text-sm">{car.seats} Seater</p>

                  <button
                    onClick={() => deleteCar(car.id)}
                    className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BOOKINGS */}
        {page === "bookings" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
              <h2 className="text-lg md:text-2xl font-bold text-orange-600">
                📋 Bookings
              </h2>

              <button
                onClick={getBookings}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
              >
                Refresh
              </button>
            </div>

            <div className="bg-black rounded-xl shadow overflow-x-auto text-white text-xs md:text-sm">
              <table className="w-full text-left">
                <thead className="bg-orange-500">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Mobile</th>
                    <th className="p-2">Car</th>
                    <th className="p-2">Pickup</th>
                    <th className="p-2">Return</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Tracking</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingBookings ? (
                    <tr>
                      <td colSpan={9} className="p-2 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-2 text-center">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b, index) => (
                      <tr key={b.id} className="border-t border-gray-700">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{b.customer_name}</td>
                        <td className="p-2">{b.mobile}</td>
                        <td className="p-2">{b.car_name}</td>
                        <td className="p-2">{b.pickup_date}</td>
                        <td className="p-2">{b.return_date}</td>
                        <td className="p-2">₹{b.total_amount}</td>

                        <td className="p-2 text-green-400">
                          {b.tracking_id || "—"}
                        </td>

                        <td className="p-2 flex gap-2">
                          <button className="bg-blue-500 px-2 py-1 rounded text-xs">
                            Edit
                          </button>
                          <button className="bg-red-500 px-2 py-1 rounded text-xs">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
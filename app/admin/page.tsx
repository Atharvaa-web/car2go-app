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
      console.log("Booking error:", error);
    } else {
      setBookings([]);
      setTimeout(() => {
        setBookings(data || []);
      }, 100);
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* SIDEBAR / TOPBAR */}
      <div className="w-full md:w-64 bg-gradient-to-r md:bg-gradient-to-b from-orange-500 to-orange-700 text-white p-4 md:p-6 flex md:flex-col gap-3 overflow-x-auto">
        <h1 className="text-lg md:text-2xl font-bold whitespace-nowrap">
          Admin Panel
        </h1>

        <div className="flex md:flex-col gap-2">
          {["dashboard", "cars", "bookings"].map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`px-3 md:px-4 py-2 rounded-full font-semibold text-sm md:text-base whitespace-nowrap transition
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
      <div className="flex-1 p-4 md:p-8">

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-600">
              🚗 Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white text-black p-4 md:p-6 rounded-xl shadow text-center border-t-4 border-orange-500">
                <h2 className="text-lg md:text-xl font-bold">Total Cars</h2>
                <p className="text-2xl md:text-3xl mt-2">{cars.length}</p>
              </div>

              <div className="bg-white text-black p-4 md:p-6 rounded-xl shadow text-center border-t-4 border-orange-500">
                <h2 className="text-lg md:text-xl font-bold">Total Bookings</h2>
                <p className="text-2xl md:text-3xl mt-2">{bookings.length}</p>
              </div>

              <div className="bg-white text-black p-4 md:p-6 rounded-xl shadow text-center border-t-4 border-orange-500">
                <h2 className="text-lg md:text-xl font-bold">Revenue</h2>
                <p className="text-2xl md:text-3xl mt-2">
                  ₹{bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* CARS */}
        {page === "cars" && (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-orange-600">
              🚘 Cars
            </h2>

            <div className="bg-black p-4 md:p-6 rounded-xl shadow w-full md:max-w-md mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Add New Car
              </h2>

              <input
                placeholder="Car Name"
                value={newCar.car_name}
                onChange={(e) =>
                  setNewCar({ ...newCar, car_name: e.target.value })
                }
                className="border w-full p-2 mb-3 bg-white text-black"
              />

              <input
                placeholder="Price per day"
                value={newCar.price_per_day}
                onChange={(e) =>
                  setNewCar({ ...newCar, price_per_day: e.target.value })
                }
                className="border w-full p-2 mb-3 bg-white text-black"
              />

              <input
                placeholder="Seats"
                value={newCar.seats}
                onChange={(e) =>
                  setNewCar({ ...newCar, seats: e.target.value })
                }
                className="border w-full p-2 mb-3 bg-white text-black"
              />

              <input
                placeholder="Image URL"
                value={newCar.image_url}
                onChange={(e) =>
                  setNewCar({ ...newCar, image_url: e.target.value })
                }
                className="border w-full p-2 mb-3 bg-white text-black"
              />

              <button
                onClick={addCar}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded font-semibold"
              >
                Add Car
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white text-black p-4 rounded-xl shadow"
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
                    className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-orange-600">
                📋 Bookings
              </h2>

              <button
                onClick={getBookings}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Refresh
              </button>
            </div>

            <div className="bg-black rounded-xl shadow overflow-x-auto text-white">
              <table className="min-w-[800px] w-full text-left text-sm md:text-base">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Car</th>
                    <th className="p-3">Pickup</th>
                    <th className="p-3">Return</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Tracking</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingBookings ? (
                    <tr>
                      <td colSpan={9} className="p-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-4 text-center">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b, index) => (
                      <tr key={b.id} className="border-t border-gray-700">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{b.customer_name}</td>
                        <td className="p-3">{b.mobile}</td>
                        <td className="p-3">{b.car_name}</td>
                        <td className="p-3">{b.pickup_date}</td>
                        <td className="p-3">{b.return_date}</td>
                        <td className="p-3">₹{b.total_amount}</td>

                        <td className="p-3 text-green-400 font-semibold">
                          {b.tracking_id ? b.tracking_id : "—"}
                        </td>

                        <td className="p-3 flex gap-2">
                          <button
                            onClick={async () => {
                              const newName = prompt(
                                "Enter new name",
                                b.customer_name || ""
                              );
                              if (!newName) return;

                              const { data, error } = await supabase
                                .from("bookings")
                                .update({
                                  customer_name: newName,
                                  user_name: newName,
                                })
                                .eq("id", b.id)
                                .select();

                              if (error) {
                                alert("Update failed");
                              } else {
                                alert("Updated ✅");
                                setBookings((prev) =>
                                  prev.map((item) =>
                                    item.id === b.id
                                      ? { ...item, ...data[0] }
                                      : item
                                  )
                                );
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={async () => {
                              if (!confirm("Delete booking?")) return;

                              await supabase
                                .from("bookings")
                                .delete()
                                .eq("id", b.id);

                              alert("Deleted ✅");
                              getBookings();
                            }}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
                          >
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
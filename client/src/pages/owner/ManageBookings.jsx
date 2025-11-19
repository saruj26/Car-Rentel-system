import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { dummyMyBookingsData } from "../../assets/assets";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY || "Rs";

  const fetchOwnerBookings = async () => {
    // Replace with real API call later. Use dummy data for now.
    setBookings(dummyMyBookingsData);
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subtitle="View, edit, and manage all bookings listed on the platform"
      />

      <div
        className="max-w-3xl w-full rounded-md overflow-hidden border
      border-borderColor mt-6"
      >
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-600">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id ?? booking.id}
                className="border-t border-borderColor text-gray-500"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={booking?.car?.image}
                    alt={booking?.car?.model ?? "car"}
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {booking.car.brand} . {booking.car.model}
                    </p>
                  </div>
                </td>
                <td className=" p-3 max-md:hidden">
                  {booking.pickupDate.split("T")[0]} -{" "}
                  {booking.returnDate.split("T")[0]}
                </td>
                <td className="p-3">
                  {currency} {booking.price}/day
                </td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    offline
                  </span>
                </td>

                <td className=" p-3">
                  {booking.status === "pending" ? (
                    <select
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md
                    outline-none"
                      defaultValue={booking.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {" "}
                      {booking.status}{" "}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;

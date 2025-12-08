import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { dummyMyBookingsData } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

const ManageBookings = () => {
  const { axios, currency, isOwner } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/bookings/owner");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 border border-green-200 text-green-700";
      case "cancelled":
        return "bg-red-50 border border-red-200 text-red-700";
      default:
        return "bg-amber-50 border border-amber-200 text-amber-700";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="px-4 pt-10 md:px-10 w-full">
        <Title
          title="Manage Bookings"
          subtitle="View, edit, and manage all bookings listed on the platform"
        />
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 md:px-6 lg:px-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <Title
          title="Manage Bookings"
          subtitle="View, edit, and manage all bookings listed on the platform"
        />
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-500">All bookings will appear here once customers make reservations.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-4">Car Details</div>
              <div className="col-span-2">Date Range</div>
              <div className="col-span-2">Total Price</div>
              <div className="col-span-2">Payment</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking._id ?? booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={booking?.car?.image}
                            alt={booking?.car?.model ?? "car"}
                            className="h-16 w-24 rounded-lg object-cover border border-gray-200"
                          />
                          <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-500' :
                            booking.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking?.car?.brand} {booking?.car?.model}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {booking?.car?.year} • {booking?.car?.transmission}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-900">{formatDate(booking.pickUpDate || booking.pickupDate)}</p>
                          <p className="text-gray-500 text-xs">to {formatDate(booking.returnDate)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {currency} {booking.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">per day</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Offline Payment
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex justify-end">
                        {booking.status === "pending" ? (
                          <div className="relative">
                            <select
                              onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                              defaultValue={booking.status}
                              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-gray-100">
            {bookings.map((booking) => (
              <div key={booking._id ?? booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={booking?.car?.image}
                        alt={booking?.car?.model ?? "car"}
                        className="h-16 w-24 rounded-lg object-cover border border-gray-200"
                      />
                      <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking?.car?.brand} {booking?.car?.model}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {booking?.car?.year} • {booking?.car?.transmission}
                      </p>
                    </div>
                  </div>
                  
                  {booking.status !== "pending" && (
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-medium">Dates</span>
                    </div>
                    <p className="text-gray-900">{formatDate(booking.pickUpDate || booking.pickupDate)}</p>
                    <p className="text-gray-900">{formatDate(booking.returnDate)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span className="font-medium">Price</span>
                    </div>
                    <p className="text-gray-900">
                      {currency} {booking.price.toLocaleString()} / day
                    </p>
                    <p className="text-xs text-gray-500">Offline Payment</p>
                  </div>
                </div>
                
                {booking.status === "pending" && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="relative">
                      <select
                        onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                        defaultValue={booking.status}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm Booking</option>
                        <option value="cancelled">Cancel Booking</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
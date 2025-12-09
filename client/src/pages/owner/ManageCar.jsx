import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, dummyCarData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const ManageCar = () => {
  const { axios, currency, isOwner } = useAppContext();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchOwnerCars = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
        setCars([]);
      }
    } catch (error) {
      toast.error(error.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this car? This action cannot be undone."
      );

      if (!confirm) return null;

      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editCar = (carId) => {
    if (!carId) return;
    navigate(`/owner/edit-car/${carId}`);
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
    }
  }, [isOwner]);

  const ActionButton = ({ Icon, onClick, color = "gray", tooltip }) => {
    const colorClasses = {
      red: "text-red-600 hover:bg-red-50",
      green: "text-green-600 hover:bg-green-50",
      blue: "text-blue-600 hover:bg-blue-50",
      gray: "text-gray-700 hover:bg-gray-100",
    };
    return (
      <button
        onClick={onClick}
        className={`p-2.5 rounded-lg border border-gray-200 transition-all duration-200 relative group ${
          colorClasses[color] || colorClasses.gray
        }`}
        title={tooltip}
      >
        <Icon className="w-5 h-5" aria-hidden />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {tooltip}
        </span>
      </button>
    );
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full min-h-screen bg-gray-50">
      <Title
        title="Manage Cars"
        subtitle="View, edit, and manage all cars listed on the platform"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-borderColor">
          <p className="text-sm text-gray-600">Total Cars</p>
          <p className="text-2xl font-bold text-gray-800">{cars.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-borderColor">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {cars.filter((car) => car.isAvailale).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-borderColor">
          <p className="text-sm text-gray-600">Unavailable</p>
          <p className="text-2xl font-bold text-red-600">
            {cars.filter((car) => !car.isAvailale).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl">
          <button
            onClick={() => navigate("/owner/add-car")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <img src={assets.addIcon} alt="Add" className="w-6 h-6" />
            Add New Car
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-borderColor p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search cars by name, brand, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <img
              src={assets.search_icon}
              alt="Search"
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-sm border border-borderColor overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16">
            <img
              src={assets.empty_car_icon || assets.car_icon}
              alt="No cars"
              className="w-24 h-24 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No cars match your search" : "No cars added yet"}
            </p>
            <button
              onClick={() => navigate("/owner/add-car")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200"
            >
              Add Your First Car
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-borderColor">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Car Details
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 max-md:hidden">
                      Category
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 max-lg:hidden">
                      Location
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 max-lg:hidden">
                      Fuel Type
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car, index) => (
                    <tr
                      key={car._id || index}
                      className={`border-b border-borderColor hover:bg-gray-50 transition-colors duration-150 ${
                        !car.isAvailale ? "opacity-75" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                            />
                            {!car.isAvailale && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {car.brand} {car.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {car.seating_capacity} seats • {car.transmission}
                            </p>
                            <div className="md:hidden mt-2">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Location:</span>{" "}
                                {car.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Fuel:</span>{" "}
                                {car.fuel_type}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 max-md:hidden">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {car.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-gray-800">
                            {currency} {car.pricePerDay}
                            <span className="text-sm font-normal text-gray-600">
                              /day
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="p-4 max-lg:hidden">
                        <div className="flex items-center gap-1 text-gray-700">
                          <img
                            src={assets.location_icon}
                            alt="Location"
                            className="w-4 h-4"
                          />
                          {car.location}
                        </div>
                      </td>
                      <td className="p-4 max-lg:hidden">
                        <div className="flex items-center gap-1 text-gray-700">
                          <img
                            src={assets.fuel_icon}
                            alt="Fuel"
                            className="w-4 h-4"
                          />
                          {car.fuel_type}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              car.isAvailale
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {car.isAvailale ? "Available" : "Unavailable"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {car.bookingsCount || 0} bookings
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ActionButton
                            Icon={car.isAvailale ? EyeSlashIcon : EyeIcon}
                            onClick={() => toggleAvailability(car._id)}
                            color={car.isAvailale ? "red" : "green"}
                            tooltip={
                              car.isAvailale
                                ? "Mark as Unavailable"
                                : "Mark as Available"
                            }
                          />
                          <ActionButton
                            Icon={PencilIcon}
                            onClick={() => editCar(car._id)}
                            color="blue"
                            tooltip="Edit Car"
                          />
                          <ActionButton
                            Icon={TrashIcon}
                            onClick={() => deleteCar(car._id)}
                            color="red"
                            tooltip="Delete Car"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-borderColor bg-gray-50 flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-600 mb-2 md:mb-0">
                Showing {filteredCars.length} of {cars.length} cars
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={() => navigate("/owner/add-car")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          title="Add New Car"
        >
          <img src={assets.addIcon} alt="Add" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ManageCar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, dummyCarData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCar = () => {
  const { axios, currency, isOwner } = useAppContext();

  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
        "Are you sure you want to delete this car?"
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

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subtitle="View, edit, and manage all cars listed on the platform"
      />

      <div
        className="max-w-3xl w-full rounded-md overflow-hidden border
      border-borderColor mt-6"
      >
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-600">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Fuel Type</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr
                key={car._id || index}
                className="border-t border-borderColor"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-12 w-12 aspect-squre
                  rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} . {car.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {car.seating_capacity} . {car.transmission}
                    </p>
                  </div>
                </td>
                <td className=" p-3 max-md:hidden">{car.category}</td>
                <td className="p-3">
                  {currency} {car.pricePerDay}/day
                </td>
                <td className="p-3">
                  {car.location}
                </td>
                <td className="p-3">
                  {car.fuel_type}
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailale
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {car.isAvailale ? "Availale" : "UnAvailale"}
                  </span>
                </td>

                <td className="flex items-center p-3">
                  <img
                    onClick={() => toggleAvailability(car._id)}
                    src={
                      car.isAvailale ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                  />

                  <img
                    onClick={() => deleteCar(car._id)}
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                  />

                  <img
                    onClick={() => editCar(car._id)}
                    src={assets.edit_icon}
                    alt="Edit"
                    className="cursor-pointer ml-3 bg-gray-400 p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCar;
